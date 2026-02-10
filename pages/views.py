from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from .models import RepairRequest
import json

def home(request):
    return render(request, 'index.html')

@require_POST
def submit_form(request):
    try:
        if request.content_type == "application/json":
            data = json.loads(request.body or "{}")
            name = (data.get("name") or "").strip()
            phone = (data.get("phone") or "").strip()
            package = (data.get("package") or "").strip()
        else:
            name = (request.POST.get("name") or "").strip()
            phone = (request.POST.get("phone") or "").strip()
            package = (request.POST.get("package") or "").strip()
    except json.JSONDecodeError:
        return JsonResponse({"status": "error", "error": "invalid_json"}, status=400)

    if not name or not phone or not package:
        return JsonResponse({"status": "error", "error": "missing_fields"}, status=400)

    valid_packages = {value for value, _label in RepairRequest.PACKAGE_CHOICES}
    if package not in valid_packages:
        return JsonResponse({"status": "error", "error": "invalid_package"}, status=400)

    RepairRequest.objects.create(
        name=name,
        phone=phone,
        package=package
    )

    return JsonResponse({"status": "ok"})
