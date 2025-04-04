from rest_framework import serializers
from .models import Form, Question, Option, QuestionType
from django.db import transaction

class OptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = ['text']

class QuestionSerializer(serializers.ModelSerializer):
    
    options = OptionSerializer(many=True, required= False)
    question_type = serializers.ChoiceField(choices=QuestionType.choices)

    class Meta:
        model = Question
        fields = ['text', 'question_type', 'is_required', 'options' ]

    def validate(self, data):
        question_type = data.get('question_type')
        options = data.get('options')
        option_base_types=[
            QuestionType.CHECKBOX,
            QuestionType.MULTIPLE_CHOICE,
            QuestionType.DROPDOWN
        ]

        if question_type in option_base_types:
            if not options:
                raise serializers.ValidationError(f"Options are required for {QuestionType(question_type).label}")
        else:
            return data
        
class FormSerializer(serializers.ModelSerializer):

    questions= QuestionSerializer(many=True, required=True)

    class Meta:
        model = Form
        fields = ['title','owner','form_id', 'questions']

    def create(self, validated_data):
        questions_data=validated_data.pop('questions',[])

        try:
            with transaction.atomic():

                form=Form.objects.create(**validated_data)

                for index,question_data in enumerate(questions_data):
                    
                    options_data=questions_data.pop('options',[])

                    question=Question.objects.create(form= form, order=index,**question_data)

                    if options_data:

                        Option.objects.bulk_create([
                            Option(question=question, **option_data) for option_data in options_data
                        ])
            return form
    
        except Exception as e:
            raise e