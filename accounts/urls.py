from django.urls import path, include
from .views import RegisterView,LoginView,GoogleSignInView, CustomTokenRefreshView

urlpatterns = [
    path('register', RegisterView.as_view(), name='register'),
    path('login', LoginView.as_view(), name='login'),
    path('login/google', GoogleSignInView.as_view(), name='google-login'),
    path('token/refresh', CustomTokenRefreshView.as_view(), name= 'token-refresh')
]