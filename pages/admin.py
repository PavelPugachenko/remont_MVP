from django.contrib import admin
from .models import RepairRequest

@admin.register(RepairRequest)
class RepairRequestAdmin(admin.ModelAdmin):
    list_display = ('name', 'phone', 'package', 'created_at')
    list_filter = ('package', 'created_at')
    search_fields = ('name', 'phone')