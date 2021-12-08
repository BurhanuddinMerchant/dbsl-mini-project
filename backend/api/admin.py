from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register(NurseModel)
admin.site.register(UserModel)
admin.site.register(VaccineModel)
admin.site.register(VaccineCenterModel)
admin.site.register(SlotModel)
