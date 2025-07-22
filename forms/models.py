from django.db import models
from django.contrib.auth.models import BaseUserManager
from django.conf import settings
import uuid

# Create your models here.

class Form(models.Model):
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='forms')
    
    title = models.CharField(max_length=100, blank=False)
    description = models.TextField(blank=True)
    form_id = models.UUIDField(unique=True, default=uuid.uuid4, editable=False, primary_key=True)
    created_at = models.DateTimeField( auto_now_add=True)
    updated_at= models.DateTimeField(auto_now=True)

class QuestionType(models.TextChoices):
    SHORT_ANSWER= 'SA', 'Short Answer'
    PARAGRAPH= 'PA', 'Paragraph'
    MULTIPLE_CHOICE= 'MC', 'Multiple Choice'
    DROPDOWN= 'DD', 'Dropdown'
    CHECKBOX= 'CB', 'Checkbox'

class Question(models.Model):
    form = models.ForeignKey(
        Form,
        on_delete=models.CASCADE,
        related_name='questions'
    )
    question_id= models.CharField(max_length=100,blank=False)
    text = models.CharField( max_length=200)
    question_type= models.CharField(
        max_length=2,
        choices=QuestionType.choices,
        default=QuestionType.SHORT_ANSWER
    )
    is_required= models.BooleanField(default=False)
    order = models.PositiveIntegerField()

    class Meta:
        unique_together=(('form','order'))
        ordering = ['order']

class Option(models.Model):
    question = models.ForeignKey(
        Question,
        on_delete=models.CASCADE,
        related_name='options'
    )
    option_id= models.CharField(max_length=100,blank=False)
    text = models.CharField(max_length=30)
    order= models.PositiveIntegerField()

    class Meta:
        unique_together=(('question','order'))
        ordering=['order']

class Response(models.Model):
    form = models.ForeignKey(
        Form,
        on_delete=models.CASCADE,
        related_name='responses'
    )

    submitted_at = models.DateTimeField(auto_now_add=True, editable=False)

class Answer(models.Model):
    question = models.ForeignKey(
        Question,
        on_delete=models.CASCADE,
        related_name='answers'
    )
    response = models.ForeignKey(
        Response,
        on_delete=models.CASCADE,
        related_name='answers'
    )

    value = models.JSONField()