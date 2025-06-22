from django.utils import timezone
from datetime import timedelta
from formly.settings import REFRESH_TOKEN_LIFETIME

def get_token_expiration_time():
  return timezone.now() + timedelta(days=REFRESH_TOKEN_LIFETIME)