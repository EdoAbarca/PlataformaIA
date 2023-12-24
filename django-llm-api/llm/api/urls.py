from django.urls import path
#from api import views
from api.views import *
#from dotenv import load_dotenv
#from os import environ
#load_dotenv()

urlpatterns=[
    path('predict/', LLMView.as_view()),
    path('openai/', OpenAIView.as_view()),
]