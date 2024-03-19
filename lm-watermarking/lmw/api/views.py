from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import subprocess
import json
import os
import torch

# Create your views here.

class LmWatermarkingView(APIView):
  def post(self, request):
    try:
      input_text = request.data.get('text', None)
      print("[views.py] texto: ", input_text)
      filepath = os.path.join(os.path.dirname(__file__), 'demo_watermark.py')
      print("[views.py] ruta: ", filepath)
      #filepath = repr(filepath)
      #print(filepath)
      parameters = ["python3", filepath, "--default_prompt", input_text]
      print("[views.py] Se inicia ejecución de demo_watermark.py")
      result = subprocess.run(parameters, capture_output=True, text=True)
      print("[views.py] Se finaliza ejecución de demo_watermark.py")
      print("[views.py] Res code: ", result.returncode)
      print("[views.py] Stdout: ", result.stdout)
      print("[views.py] Stderr: ", result.stderr)
      if result.returncode == 0:
        # Split the stdout into lines
        output_lines = result.stdout.strip().split('\n')

        # Extract the last line
        last_line = output_lines[-1]

        # Assuming the last line contains a JSON string, parse it
        output_dict = json.loads(last_line)

        # Now you can use output_dict as a regular Python dictionary
        print("Output from infer.py:", output_dict)
        return Response(output_dict,status=status.HTTP_200_OK)

      else:
        #print("Error running infer.py. Return code:", result.returncode)
        return Response({"Stderr": "Error running infer.py. Error: "+result.stderr, "Stdout":result.stdout, "Code":result.returncode},status=status.HTTP_400_BAD_REQUEST)

      
    except Exception as e:
      return Response("Exception: "+str(e),status=status.HTTP_400_BAD_REQUEST)

  def get(self, request):
    try:
      data_response = {
        "cuda_available": torch.cuda.is_available(),
        "cuda_device_count": torch.cuda.device_count(),
        "cuda_current_device": torch.cuda.current_device(),
        "cuda_device_name": torch.cuda.get_device_name(0)
      }
      return Response(data_response,status=status.HTTP_200_OK)
    except Exception as e:
      return Response(str(e),status=status.HTTP_400_BAD_REQUEST)
