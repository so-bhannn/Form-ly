from rest_framework import permissions,status
from rest_framework.response import Response
from rest_framework.generics import GenericAPIView
from rest_framework.authtoken.models import Token

from .serializers import RegisterSerializer,UserSerializer,LoginSerializer
from rest_framework_simplejwt.tokens import RefreshToken

class RegisterView(GenericAPIView):
    serializer_class=RegisterSerializer
    permission_classes=[permissions.AllowAny]

    def post(self,request,*args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        return Response({
            'user':UserSerializer(user, context=self.get_serializer_context()).data,
            'refresh': refresh_token,
            'access': access_token,
            'message': 'User registered successfully'
        },status=status.HTTP_201_CREATED)
    
class LoginView(GenericAPIView):
    serializer_class=LoginSerializer
    permission_classes=[permissions.AllowAny]

    def post(self,request,*args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        if user:
            return Response({
                'user': UserSerializer(user, context=self.get_serializer_context()).data,
                'refresh': refresh_token,
                'access': access_token,
                'message': 'Logged in successfully'
            },status=status.HTTP_200_OK)