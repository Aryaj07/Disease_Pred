# accounts/urls.py

from django.urls import path
from . import views

urlpatterns = [
    path('auth/signup', views.signup_view, name='signup'),
    path('auth/login', views.login_view, name='login'),
]