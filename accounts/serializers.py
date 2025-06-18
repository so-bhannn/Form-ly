from rest_framework import serializers
from django.contrib.auth import get_user_model,authenticate
from .models import CustomUser

class RegisterSerializer(serializers.ModelSerializer):
    
    password = serializers.CharField(write_only=True,required=True)
    class Meta:
        model=CustomUser
        fields=('id','email','password','first_name','last_name','avatar')
        extra_kwargs={
            'id':{'read_only': True},
            'avatar':{'required':False}
        }
    
    def validate_email(self,email):
        if CustomUser.objects.filter(email=email).exists():
            raise serializers.ValidationError({"email":"A user with this email already exists."})
        return email

    def validate(self, data):
        error={}
        if not data.get('password'):
            error['password']='This field is required.'
        if not data.get('first_name'):
            error['first_name']='This field is required.'

        if error:
            raise serializers.ValidationError(error)
        
        return data
    
    def create(self, validated_data):
        password=validated_data.pop('password', None)
        user = self.Meta.model(**validated_data)

        user.set_password(password)
        user.save()

        return user
    

class LoginSerializer(serializers.Serializer):

    email= serializers.EmailField()
    password= serializers.CharField()

    def validate(self, data):
        error = {}

        if not data.get('password'):
            error['password']= "This field is required"
        if not data.get('email'):
            error['email']= "This field is required"

        if error:
            raise serializers.ValidationError(error)
        
        user = authenticate(email=data.get('email'), password=data.get('password'))
        if not user:
            raise serializers.ValidationError({"non_field_errors": "Invalid credentials"})
        data['user'] = user
        return data