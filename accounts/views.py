from rest_framework import permissions,status
from rest_framework.response import Response
from rest_framework.generics import GenericAPIView
from rest_framework.authtoken.models import Token

from .serializers import RegisterSerializer,UserSerializer,LoginSerializer

class RegisterView(GenericAPIView):
    serializer_class=RegisterSerializer
    permission_classes=[permissions.AllowAny]

    def post(self,request,*args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        token,created = Token.objects.get_or_create(user=user)

        return Response({
            'user':UserSerializer(user, context=self.get_serializer_context()).data,
            'token': token.key,
            'message': 'User registered successfully'
        },status=status.HTTP_201_CREATED)
    
class LoginView(GenericAPIView):
    serializer_class=LoginSerializer
    permission_classes=[permissions.AllowAny]

    def post(self,request,*args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']

        token,_=Token.objects.get_or_create(user=user)

        if user:
            return Response({
                'user': UserSerializer(user, context=self.get_serializer_context()).data,
                'token': token.key,
                'message': 'Logged in successfully'
            },status=status.HTTP_200_OK)