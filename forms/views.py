from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from .models import Form
from .serializers import FormSerializer


class CreateFormView(ModelViewSet):
    queryset=Form.objects.all()
    serializer_class=FormSerializer
    permission_classes=[IsAuthenticated]