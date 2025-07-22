from rest_framework.routers import DefaultRouter
from .views import FormViewSet
from django.urls import path,include

router = DefaultRouter()

router.register(r'',FormViewSet,basename='form')

urlpatterns = [
    path('',include(router.urls))
]