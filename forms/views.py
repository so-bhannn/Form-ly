from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet
from .models import Form
from .serializers import FormReadSerializer,FormWriteSerializer

class FormViewSet(ModelViewSet):
    permission_classes=[IsAuthenticated]
    
    def get_queryset(self):
        return Form.objects.filter(owner=self.request.user).prefetch_related('questions__options')
    
    def get_serializer_class(self):
        if self.action in ['create','update','partial_update']:
            return FormWriteSerializer
        return FormReadSerializer

    def get_serializer_context(self):
        return {'request': self.request}