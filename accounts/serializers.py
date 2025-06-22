from rest_framework import serializers
from django.contrib.auth import get_user_model

User =get_user_model()



class RegisterSerializer(serializers.ModelSerializer):
    
    password = serializers.CharField(write_only=True,required=True)
    class Meta:
        model=User
        fields=('id','email','social_id','first_name','last_name','avatar')
        extra_kwargs={
            'social_id':{'required':False},
            'avatar':{'required':False}
        }
    
    def validate_email(self,email):
        email = email.lower()
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError({"email":"A user with this email already exists."})
        return email

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)

    def validate_email(self, email):
        email=email.lower()
        return email

