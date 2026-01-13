from django.db import models

class RepairRequest(models.Model):
    PACKAGE_CHOICES = [
        ('econom', 'Эконом'),
        ('comfort', 'Комфорт'),
        ('premium', 'Премиум'),
    ]

    name = models.CharField("Имя", max_length=100)
    phone = models.CharField("Телефон", max_length=20)
    package = models.CharField("Пакет", max_length=20, choices=PACKAGE_CHOICES)
    created_at = models.DateTimeField("Дата", auto_now_add=True)

    def __str__(self):
        return f"{self.name} — {self.package}"

    class Meta:
        verbose_name = "Заявка на ремонт"
        verbose_name_plural = "Заявки на ремонт"