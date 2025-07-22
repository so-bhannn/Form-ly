from rest_framework import serializers
from .models import Form, Question, Option, QuestionType
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
            serializers.ValidationError(f'Options are required for: {QuestionType(question_type).label} Questions.')
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
        existing_options={opt.id:opt for opt in question_instance.options.all()}
        incoming_options=set()
        options_to_create=[]
        options_to_update=[]

        for option_data in options_data:
            option_id=option_data.get('id')
            incoming_options.add(option_id)

            if option_id in existing_options:
                option_instance=existing_options[option_id]
                option_update_fields=[]

                new_text=option_data.get('text',option_instance.text)
                if option_instance.text!=new_text:
                    option_instance.text=new_text
                    option_update_fields.append('text')

                new_order=option_data.get('order',option_instance.order)
                if option_instance.order!=new_order:
                    option_instance.order=new_order
                    option_update_fields.append('order')

                if option_update_fields:
                    options_to_update.append(option_instance)

            else:
                options_to_create.append(Option(question=question_instance, **option_data))

        if options_to_create:
            Option.objects.bulk_create(options_to_create)

        if options_to_update:
            Option.objects.bulk_update(options_to_update,option_update_fields)

        option_ids_to_delete=set(existing_options.keys())-incoming_options
        if option_ids_to_delete:
            Option.objects.filter(id__in=option_ids_to_delete).delete()