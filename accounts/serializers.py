from rest_framework import serializers
from django.contrib.auth import get_user_model,authenticate

User= get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields=('username','email')
    
class RegisterSerializer(serializers.ModelSerializer):
    password=serializers.CharField(
        write_only=True,
        required=True,
    )
    
    password2=serializers.CharField(
        write_only=True,
        required=True,
    )

    email= serializers.EmailField(required=True)

    class Meta:
        model=User
        fields=('username','email','password','password2')

    def validate_email(self,email):
        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError("An account with the same email exists.")
        return email
    
    def validate(self, attrs):
        if attrs['password']!=attrs['password2']:
            raise serializers.ValidationError("Both the passwords must match.")
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password2')

        user=User.objects.create(**validated_data)
        return user
    
class LoginSerializer(serializers.Serializer):
    email= serializers.CharField(write_only=True)
    password= serializers.CharField(write_only=True)