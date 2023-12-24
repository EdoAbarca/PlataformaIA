from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from openai import OpenAI
import os
from dotenv import load_dotenv
load_dotenv()

class LLMView(APIView):
    def post(self, request):
        try:
            #print("Request: ", request)
            #print("Request.data: ", request.data)
            docs = request.data.get('documents', [])
            print("Request.data.documents: ", docs)
            #response_data = process_documents(docs)
            #return Response(response_data, status=status.HTTP_201_CREATED)
            return Response(status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class OpenAIView(APIView):
    def post(self, request):
        try:
            client = OpenAI(
                #api_key=os.environ.get("OPENAI_API_KEY"),
            )
            print(client)

            completion = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                {"role": "system", "content": "Tu eres un vendedor de Herbalife, y tienes que convencerme de comprar tu producto."},
                #{"role": "user", "content": "Compose a poem that explains the concept of recursion in programming."},
            ])

            print(completion)

            return Response(completion, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)