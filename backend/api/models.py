from django.db import models
from django.db.models.deletion import CASCADE
from django.contrib.auth.models import User


class VaccineCenterModel(models.Model):
    pincode = models.CharField(max_length=6)
    name = models.CharField(max_length=256)
    phoneNumber = models.CharField(max_length=10)
    address = models.TextField()
    capacity_per_slot = models.IntegerField()

    def __str__(self) -> str:
        return self.name


# Create your models here.
class NurseModel(models.Model):
    user = models.OneToOneField(User, on_delete=CASCADE, null=True, blank=True)
    GENDER_CHOICES = (("Male", "Male"), ("Female", "Female"), ("Others", "Others"))
    name = models.CharField(max_length=256)
    gender = models.CharField(choices=GENDER_CHOICES, max_length=10)
    phoneNumber = models.CharField(max_length=10)
    email = models.EmailField(max_length=256)
    password = models.CharField(max_length=64,blank=True,null=True)
    vaccineCenter = models.ForeignKey(
        VaccineCenterModel, on_delete=CASCADE, null=True, blank=True, default=None
    )

    def __str__(self) -> str:
        return self.name


class VaccineModel(models.Model):
    name = models.CharField(max_length=256)
    cost = models.FloatField()
    ingredients = models.TextField()

    def __str__(self) -> str:
        return self.name


class SlotModel(models.Model):
    duration = models.CharField(max_length=12)
    nurse = models.ManyToManyField(
        NurseModel, related_name="nurse_of_slot", blank=True, default=None
    )
    def nurses_assigned(self):
        return ",".join([str(n) for n in self.nurse.all()])

    def __str__(self) -> str:
        return self.duration



class UserModel(models.Model):
    user = models.OneToOneField(User, on_delete=CASCADE, null=True, blank=True)
    GENDER_CHOICES = (("Male", "Male"), ("Female", "Female"), ("Others", "Others"))
    fname = models.CharField(max_length=256)
    lname = models.CharField(max_length=256)
    pincode = models.CharField(max_length=6)
    phoneNumber = models.CharField(max_length=10)
    email = models.EmailField(max_length=256)
    password = models.CharField(max_length=64, null=True, blank=True)
    address = models.TextField()
    age = models.IntegerField()
    isVaccinated = models.BooleanField(default=False)
    gender = models.CharField(choices=GENDER_CHOICES, max_length=10)
    nurse = models.ForeignKey(
        NurseModel, on_delete=models.CASCADE, null=True, blank=True, default=None
    )
    vaccine = models.ForeignKey(
        VaccineModel, on_delete=CASCADE, null=True, blank=True, default=None
    )
    vaccineCenter = models.ForeignKey(
        VaccineCenterModel, on_delete=CASCADE, null=True, blank=True, default=None
    )
    slot = models.ForeignKey(
        SlotModel, on_delete=CASCADE, null=True, blank=True, default=None
    )

    def __str__(self) -> str:
        return self.fname + " " + self.lname
