import json
from rest_framework import serializers
from .models import Form, Question, Option, QuestionType, Response, Answer
from django.db import transaction

#READ(List and Retrieve) Serializers
class OptionReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = ['option_id','text','order']

class QuestionReadSerializer(serializers.ModelSerializer):

    options = OptionReadSerializer(many=True, read_only=True)
    question_type = serializers.ChoiceField(choices=QuestionType.choices)

    class Meta:
        model = Question
        fields = ['question_id','text', 'question_type', 'is_required', 'options' ]

class FormReadSerializer(serializers.ModelSerializer):
    owner =serializers.ReadOnlyField(source='owner.username')
    questions= QuestionReadSerializer(many=True, read_only=True)
    class Meta:
        model = Form
        fields = ['title','description','owner','form_id', 'questions','updated_at']


#WRITE(Create and Update) Serializers
class OptionWriteSerializer(serializers.Serializer):
    option_id = serializers.CharField(max_length=100)
    text=serializers.CharField(max_length=200)
    order= serializers.IntegerField()

class QuestionWriteSerializer(serializers.Serializer):
    options=OptionWriteSerializer(many=True, required=False)
    question_id=serializers.CharField(max_length=100)
    text=serializers.CharField(max_length=200)
    question_type=serializers.ChoiceField(choices=QuestionType.choices)
    order=serializers.IntegerField()
    is_required=serializers.BooleanField(default=False)

    def validate(self, data):
        question_type=data.get('question_type')
        options=data.get('options')
        option_question_types=[
            QuestionType.MULTIPLE_CHOICE,
            QuestionType.CHECKBOX,
            QuestionType.DROPDOWN,
        ]

        if question_type in option_question_types and not options:
            raise serializers.ValidationError(f'Options are required for: {QuestionType(question_type).label} Questions.')
        return data

class FormWriteSerializer(serializers.ModelSerializer):
    questions=QuestionWriteSerializer(many=True)

    class Meta:
        model= Form
        fields=['title', 'description','questions']
    
    @transaction.atomic
    def create(self, validated_data):
        questions_data=validated_data.pop('questions')
        owner = self.context['request'].user

        form= Form.objects.create(
            owner=owner,
            title=validated_data.get('title'),
            description=validated_data.get('description','')
        )

        for question_data in questions_data:
            options_data=question_data.pop('options',None)
            question=Question.objects.create(form=form,**question_data)

            if options_data:
                options_to_create=[Option(question=question, **option) for option in options_data]
                Option.objects.bulk_create(options_to_create)
        return form
    
    @transaction.atomic
    def update(self, instance, validated_data):
        form_updates=[]

        new_title=validated_data.get('title',instance.title)
        if instance.title!=new_title:
            instance.title=new_title
            form_updates.append('title')

        new_description=validated_data.get('description',instance.description)
        if instance.description!=new_description:
            instance.description=new_description
            form_updates.append('description')

        if form_updates:
            instance.save(updated_fields=form_updates)

        questions_data=validated_data.pop('questions')

        existing_questions={q.id:q for q in instance.questions.all()}
        incoming_question_ids=set()
        questions_to_update=[]

        for question_data in questions_data:
            question_id=question_data.get('question_id')
            incoming_question_ids.add(question_id)

            if question_id in existing_questions:
                question_instance=existing_questions[question_id]
                has_changed=False

                new_text=question_data.get('text',question_instance.text)
                if question_instance.text!=new_text:
                    question_instance.text=new_text
                    has_changed=True

                new_question_type=question_data.get('question_type',question_instance.question_type)
                if question_instance.question_type!=new_question_type:
                    question_instance.question_type=new_question_type
                    has_changed=True

                is_required=question_data.get('is_required', question_instance.is_required)
                if question_instance.is_required!=is_required:
                    question_instance.is_required=is_required
                    has_changed=True

                new_order=question_data.get('order',question_instance.order)
                if question_instance.order!=new_order:
                    question_instance.order=new_order
                    has_changed=True

                if has_changed:
                    questions_to_update.append(question_instance)
                if question_instance.question_type in ['MC','DD','CB']:
                    self._update_options(question_instance, question_data.get('options',[]))
            else:
                option_data=question_data.pop('options',[])
                new_question=Question.objects.create(form=instance,**question_data)
                if option_data:
                    options_to_create=[Option(question=new_question,**option) for option in option_data]
                    Option.objects.bulk_create(options_to_create)

        if questions_to_update:
            Question.objects.bulk_update(questions_to_update,['text','description','is_required','order'])

        question_ids_to_delete=set(existing_questions.keys())-incoming_question_ids
        if question_ids_to_delete:
            Question.objects.filter(id__in=question_ids_to_delete).delete()

        return instance

    def _update_options(self, question_instance, options_data):
        existing_options = {opt.id: opt for opt in question_instance.options.all()}
        incoming_option_ids = {opt_data.get('id') for opt_data in options_data if opt_data.get('id')}

        options_to_update = []
        for option_data in options_data:
            option_id = option_data.get('id')
            
            if option_id and option_id in existing_options:
                option_instance = existing_options[option_id]
                option_instance.text = option_data['text']
                option_instance.order = option_data['order']
                options_to_update.append(option_instance)
            else:
                option_data.pop('id', None)
                Option.objects.create(question=question_instance, **option_data)

        if options_to_update:
            Option.objects.bulk_update(options_to_update, ['text', 'order'])

        option_ids_to_delete = set(existing_options.keys()) - incoming_option_ids
        if option_ids_to_delete:
            Option.objects.filter(id__in=option_ids_to_delete).delete()

class AnswerWriteSerializer(serializers.Serializer):
    question_id=serializers.CharField(max_length=100)
    value=serializers.JSONField(required=True)

class ResponseSubmitSerializer(serializers.Serializer):
    answers=AnswerWriteSerializer(many=True)

    def validate(self,data):
        answers_data=data.get('answers',[])
        if not answers_data:
            raise serializers.ValidationError("There is no data provided for answers.")
        
        question_ids=[answer['question_id'] for answer in answers_data]
        questions=Question.objects.in_bulk(question_ids,field_name='question_id')

        for answer_data in answers_data:
            question_id=answer_data.get('question_id')
            value=answer_data.get('value')

            question=questions.get(question_id)
            if not question:
                raise serializers.ValidationError(f"No question exists with id: {question_id}")

            if question.question_type == QuestionType.CHECKBOX:
                if not isinstance(value,list):
                    raise serializers.ValidationError("The answer value should be in array format for Checkbox question type.")
                answer_data['value']=json.dumps(value)
            else:
                if not isinstance(value,str):
                    raise serializers.ValidationError('The answer value should be in string format for this question type.')

        return data

    @transaction.atomic
    def create(self,validated_data):
        form=self.context['form']
        request=self.context['request']
        respondant=request.user if request.user.is_authenticated else None

        response_instance=Response.objects.create(
            form=form, 
            respondant=respondant
            )

        answers_to_create=[]
        for answer_data in validated_data.get('answers'):
            question=Question.objects.get(question_id=answer_data['question_id'])
            answers_to_create.append(
                Answer(question=question,response=response_instance,value=answer_data['value'])
            )
        Answer.objects.bulk_create(answers_to_create)
        return response_instance


class AnswerResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model=Answer
        fields=['value']

    def to_representation(self, instance):
        ret= super().to_representation(instance)

        if instance.question.question_type==QuestionType.CHECKBOX:
            try:
                ret['value']=json.loads(ret['value'])
            except:
                ret['value']=[]

        return ret
    
class QuestionWithAnswersSerializer(serializers.ModelSerializer):
    options=OptionReadSerializer(many=True, required=False)
    answers=AnswerResponseSerializer(many=True, read_only=True)

    class Meta:
        model=Question
        fields=['question_id','question_type','text','description','is_required','order','options','answers']

class FormWithResponseSerializer(serializers.ModelSerializer):
    questions_with_answers=serializers.SerializerMethodField()

    class Meta:
        model=Form
        fields=['form_id','title','description','questions_with_answers']

    def get_questions_with_answers(self,instance):
        result=[]
        for question in instance.questions.all():
            question_data={
                "question_id":question.question_id,
                "text":question.text,
                "question_type":question.question_type,
                "is_required":question.is_required,
                "order":question.order,
                "options":OptionReadSerializer(question.options.all(),many=True).data,
                "answer":AnswerResponseSerializer(question.answers.all(),many=True).data
            }
            result.append(question_data)

        return result
    
class ResponseListSerializer(serializers.ModelSerializer):
    class Meta:
        model=Response
        fields=['id','respondant','submitted_at']