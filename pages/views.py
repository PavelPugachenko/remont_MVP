from django.shortcuts import render
from django.http import JsonResponse
from .models import RepairRequest
import json

def home(request):
    return render(request, 'pages/index.html')

def submit_form(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            name = data.get("name")
            phone = data.get("phone")
            package = data.get("package")

            RepairRequest.objects.create(
                name=name,
                phone=phone,
                package=package
            )

            print(f"[✅ ЗАЯВКА СОХРАНЕНА] {name} | {phone} | {package}")
            return JsonResponse({"status": "ok"})
        except Exception as e:
            print("Ошибка при сохранении:", e)
            return JsonResponse({"status": "error"}, status=400)
    return JsonResponse({"status": "error"}, status=405)