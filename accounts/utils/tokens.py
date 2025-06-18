from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import AuthenticationFailed

def get_tokens_for_user(user):
    
    if not user.is_active:
        raise AuthenticationFailed("user is not active")
    
    refresh = RefreshToken.for_user(user=user)

    return str(refresh), str(refresh.access_token)