# accounts/urls.py

from django.urls import path
from . import views

urlpatterns = [
    path('auth/signup', views.signup_view, name='signup'),
    path('auth/login', views.login_view, name='login'),
    path('predict/',views.disease_prediction, name="predict"),
    path('upload-pdf/',views.PDFUploadView.as_view(), name="upload-pdf"),
    path('nearby-doctors/',views.nearby_doctors, name="nearby-doctors"),
]