from django.db import models,IntegrityError
from django.conf import settings
from django.contrib.auth import get_user_model
import uuid

# Create your models here.

User=get_user_model()

class UniqueIDMOdel(models.Model):
    uuid= models.UUIDField(unique=True, default=uuid.uuid4, editable=False, primary_key=True)

    def save(self, *args, **kwargs):
        while self._state.adding:
            try:
                super().save(*args, **kwargs)
            except IntegrityError:
                self.uuid=uuid.uuid4()
        else:
            super().save(*args, **kwargs)

    class Meta:
        abstract=True

class Form(UniqueIDMOdel):
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='forms')
    
    title = models.CharField(max_length=100, blank=False)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField( auto_now_add=True)
    updated_at= models.DateTimeField(auto_now=True)

class QuestionType(models.TextChoices):
    SHORT_ANSWER= 'SA', 'Short Answer'
    PARAGRAPH= 'PA', 'Paragraph'
    MULTIPLE_CHOICE= 'MC', 'Multiple Choice'
    DROPDOWN= 'DD', 'Dropdown'
    CHECKBOX= 'CB', 'Checkbox'

class Question(UniqueIDMOdel):
    form = models.ForeignKey(
        Form,
        on_delete=models.CASCADE,
        related_name='questions'
    )
    text = models.CharField(max_length=200)
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

class Option(UniqueIDMOdel):
    question = models.ForeignKey(
        Question,
        on_delete=models.CASCADE,
        related_name='options'
    )
    text = models.CharField(max_length=30)
    order= models.PositiveIntegerField()

    class Meta:
        unique_together=(('question','order'))
        ordering=['order']

class Response(UniqueIDMOdel):
    form = models.ForeignKey(
        Form,
        on_delete=models.CASCADE,
        related_name='responses'
    )
    respondant=models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
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
        related_name='answers_in_response'
    )

    value = models.TextField(blank=True)