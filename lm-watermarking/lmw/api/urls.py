from django.urls import path
from .views import LmWatermarkingView

urlpatterns = [path('lm-watermarking/detect', LmWatermarkingView.as_view()),]
