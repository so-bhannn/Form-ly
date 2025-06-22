from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser, PermissionsMixin
from decouple import config
import uuid
from rest_framework.views import exception_handler

from formly.settings import REFRESH_TOKEN_LIFETIME
from .utils import get_token_expiration_time
# Create your models here.

AUTH_PROVIDER = (
    ('email','EMAIL'),
    ('google','GOOGLE')
)

class CustomUserManager(BaseUserManager):

    def create_user(self, email, auth_provider='email', password=None, *args, **kwargs):
        if auth_provider=='email':
            if not email:
                raise ValueError('Email is required.')
            
            email = self.normalize_email(email)
            kwargs['social_id']=email
            user = self.model(email=email, auth_provider=auth_provider, *args, **kwargs)

            if not password:
                raise ValueError("Password is required for email authentication.")
            
            user.set_password(password)

        elif auth_provider=='google':
            user= self.model(email=email, auth_provider=auth_provider, *args, **kwargs)

            user.set_unusable_password()

        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, auth_provider, password, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        user= self.create_user(email, auth_provider, password, **extra_fields)
        print(f"Superuser created {user.email}")

        return user

class CustomUser(AbstractBaseUser, PermissionsMixin):

    id = models.CharField(max_length=10, unique=True, primary_key=True, editable=False)
    social_id = models.CharField(max_length=230, unique=True, )

    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=25)
    last_name = models.CharField(max_length=25)
    avatar = models.URLField(default=config('USER_PFP'))

    auth_provider = models.CharField(max_length=20, choices= AUTH_PROVIDER, default= 'email')

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name','last_name']

    def save(self,*args, **kwargs):
        if not self.id:
            self.id= f'{uuid.uuid4().hex[:16].lower()}'
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f'{self.first_name} {self.last_name} ({self.email}) ({self.auth_provider})'
