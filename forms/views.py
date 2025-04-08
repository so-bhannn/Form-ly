from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from .models import Form
from .serializers import FormSerializer


class FormViewSet(ModelViewSet):
    serializer_class=FormSerializer
    permission_classes=[IsAuthenticated]

    def get_queryset(self):
        user=self.request.user
        if user.is_authenticated:
            queryset=Form.objects.filter(owner=user)
            return queryset
    
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)