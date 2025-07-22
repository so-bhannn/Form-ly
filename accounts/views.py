from django.contrib.auth import authenticate, get_user_model
from rest_framework import permissions,status, exceptions
from rest_framework.response import Response
from rest_framework.generics import GenericAPIView
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.exceptions import InvalidToken

from .serializers import UserSerializer, RegisterSerializer,LoginSerializer,GoogleOAuthSerializer
from .tokens import get_tokens_for_user
from formly import settings
class RegisterView(GenericAPIView):
    serializer_class=RegisterSerializer
    permission_classes=[permissions.AllowAny]
    http_method_names=['post']
    def post(self,request,*args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        refresh_token, access_token = get_tokens_for_user(user)

        response= Response({
            'user':UserSerializer(user).data,
            'access': access_token,
            'message': 'User Registered successfully.'
        },status=status.HTTP_200_OK)
        response.set_cookie(
            key='refresh',
            value=refresh_token,
            httponly=True,
            max_age=settings.REFRESH_TOKEN_MAX_AGE,
            secure=False,
            samesite='None',
            domain=None
        )
        return response

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

        response= Response({
            'user':UserSerializer(user).data,
            'access': access_token,
            'message': 'User logged in successfully.'
        },status=status.HTTP_200_OK)
        response.set_cookie(
            key='refresh',
            value=refresh_token,
            httponly=True,
            max_age=settings.REFRESH_TOKEN_MAX_AGE,
            secure=False,
            samesite='None',
            domain=None
        )
        return response

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

        response= Response({
            'user':UserSerializer(user).data,
            'access': access_token,
        },status=status.HTTP_200_OK)
        response.set_cookie(
            key='refresh',
            value=refresh_token,
            httponly=True,
            max_age=settings.REFRESH_TOKEN_MAX_AGE,
            secure=False,
            samesite='None',
            domain=None
        )
        return response

class CustomTokenRefreshView(TokenRefreshView):
    permission_classes=[permissions.AllowAny]
    def post(self, request, *args, **kwargs):
        refresh_token= request.COOKIES.get('refresh')

        if not refresh_token:
            return Response({
                'code':'empty_token',
                'message':'No Refresh Token was provided.',
            }, status=status.HTTP_401_UNAUTHORIZED)

        data = {'refresh': refresh_token}
        serializer = self.get_serializer(data=data)

        try:
            serializer.is_valid(raise_exception=True)
        except InvalidToken as e:
            return Response({
                'code': "token_not_valid",
                'message': str(e),
            }, status=status.HTTP_401_UNAUTHORIZED)

        validated_data = serializer.validated_data

        refresh_token_object = serializer.token_class(validated_data['refresh'])
        access = refresh_token_object.access_token

        user= get_user_model().objects.get(id=refresh_token_object.payload['user_id'])

        user_data=UserSerializer(user).data

        refresh_token=validated_data.get('refresh')
        response= Response({
            "user":user_data,
            "access":str(access)
        },status=status.HTTP_200_OK)

        response.set_cookie(
            key='refresh',
            value=refresh_token,
            httponly=True,
            max_age=settings.REFRESH_TOKEN_MAX_AGE,
            secure=False,
            samesite='None',
            domain=None
        )

        return response
    from rest_framework_simplejwt.serializers import TokenRefreshSerializer