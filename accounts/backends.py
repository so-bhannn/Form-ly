from django.contrib.auth.backends import ModelBackend,BaseBackend
from django.contrib.auth import get_user_model
from google.oauth2 import id_token
from google.auth.transport import requests as google_req
from decouple import config

User=get_user_model()

class EmailBackend(ModelBackend):
    def authenticate(self, request, **kwargs):
        email= kwargs.get('email')
        password= kwargs.get('password')
        try:
            user=User.objects.get(email=email)
        except User.DoesNotExist:
            return None
        
        if user.check_password(password):
            return user
        return None
    
class GoogleOAuthBackend(BaseBackend):
    def authenticate(self, request, **kwargs):
        id_token_str= kwargs.get('id_token')
        if not id_token_str:
            return None
        
        try:
            user_info = id_token.verify_oauth2_token(
            id_token_str,
            google_req.Request(),
            audience = config('GOOGLE_CLIENT_ID')
        )
            google_sub_id=user_info['sub']
            email=user_info['email']
            first_name=user_info['given_name']
            last_name=user_info['family_name']
            avatar=user_info['picture']

        except:
            return None

        try:
            user = User.objects.filter(social_id=google_sub_id).first()

            update_fields=[]
            if first_name!=user.first_name:
                user.first_name=first_name
                update_fields.append('first_name')
            if last_name!=user.last_name:
                user.last_name=last_name
                update_fields.append('last_name')
            if avatar!=user.avatar:
                user.avatar=avatar
                update_fields.append('avatar')

            if update_fields:
                user.save(update_fields=update_fields)

            return user
        
        except User.DoesNotExist:
            user= User.objects.create_user(
                social_id=google_sub_id,
                email=email,
                first_name=first_name,
                last_name=last_name,
                auth_provider='google',
                avatar=avatar
            )

            return user
        
    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None