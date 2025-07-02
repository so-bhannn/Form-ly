from django.contrib.auth import authenticate
from rest_framework import permissions,status, exceptions
from rest_framework.response import Response
from rest_framework.generics import GenericAPIView
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.exceptions import InvalidToken

from .models import RefreshToken
from .serializers import UserSerializer, RegisterSerializer,LoginSerializer,GoogleOAuthSerializer
from .tokens import get_tokens_for_user
class RegisterView(GenericAPIView):
    serializer_class=RegisterSerializer
    permission_classes=[permissions.AllowAny]
    http_method_names=['post']

    def post(self,request,*args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        refresh_token, access_token = get_tokens_for_user(user)

        RefreshToken.objects.create(user=user, token= refresh_token, )

        return Response({
            'user': UserSerializer(user).data,
            'refresh': refresh_token,
            'access': access_token,
            'message': 'User registered successfully'
        },status=status.HTTP_201_CREATED)

class LoginView(GenericAPIView):
    serializer_class=LoginSerializer
    permission_classes=[permissions.AllowAny]

    def post(self,request,*args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = authenticate(request, **serializer.validated_data)

        if not user:
            raise exceptions.AuthenticationFailed("User does not exists")

        refresh_token, access_token = get_tokens_for_user(user)

        return Response({
            'user':UserSerializer(user).data,
            'refresh': refresh_token,
            'access': access_token,
            'message': 'User Logged in successfully'
        },status=status.HTTP_200_OK)

class GoogleSignInView(GenericAPIView):

    serializer_class=GoogleOAuthSerializer
    permission_classes=[permissions.AllowAny]

    def post(self, request,*args, **kwargs):
        serializer=self.get_serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = authenticate(request, **serializer.validated_data)

        if not user:
            raise exceptions.AuthenticationFailed
        
        refresh_token, access_token = get_tokens_for_user(user)

        return Response({
            'user':UserSerializer(user).data,
            'refresh': refresh_token,
            'access': access_token,
            'message': msg
        },status=status.HTTP_200_OK)
    
class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializeer.is_valid(raise_exception=True)
        except InvalidToken as e:
            return Response({
                'code': "token_not_valid",
                'message': str(e),
            }, status=status.HTTP_401_UNAUTHORIZED)

        validated_data = serializer.validated_data
        refresh_token_object = serializer.token_class(request.data['refresh'])

        user= refresh_token_object.user

        user_data=UserSerializer(user).data

        return Response({
            **validated_data,
            "user":user_data
        },status=status.HTTP_200_OK)