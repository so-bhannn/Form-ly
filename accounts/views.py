from rest_framework import permissions,status
from rest_framework.response import Response
from rest_framework.generics import GenericAPIView
from rest_framework import exceptions

from .models import RefreshToken
from .serializers import UserSerializer, RegisterSerializer,LoginSerializer,GoogleSignInSerializer
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
        user = authenticate(serializer.validated_data)

        if not user:
            raise AuthenticationFailed("User does not exists")

        refresh_token, access_token = get_tokens_for_user(user)

        return Response({
            'user':UserSerializer(user).data,
            'refresh': refresh_token,
            'access': access_token,
            'message': 'User Logged in successfully'
        },status=status.HTTP_200_OK)

class GoogleSignInView(GenericAPIView):

    serializer_class=GoogleSignInSerializer
    permission_classes=[permissions.AllowAny]

    def post(self, request,*args, **kwargs):
        serializer=self.get_serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        user, msg = authenticate(serializer.validated_data)

        if not user:
            raise exceptions.AuthenticationFailed(msg)
        
        refresh_token, acces_token = get_tokens_for_user(user)

        return Response({
            'user':UserSerializer(user).data,
            'refresh': refresh_token,
            'access': acces_token,
            'message': msg
        })