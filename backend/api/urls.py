from django.urls import path
from .views import *

urlpatterns = [
    path("register/user", UserRegistrationAPI.as_view()),
    path("register/nurse", NurseRegistrationAPI.as_view()),
    path("vaccinate", VaccinateUserAPI.as_view()),
    path("nurse/users", GetUsersToVaccinateAPI.as_view()),
    path("user/register-vaccination", RegisterUserForVaccinationAPI.as_view()),
    path("slots", GetAllSlotsAPI.as_view()),
    path("user/profile", GetUserProfileAPI.as_view()),
    path("nurse/profile", GetNurseProfileAPI.as_view()),
    path("vaccine-centers", GetAllVaccineCentersAPI.as_view()),
    path("raw",RawQueryAPI.as_view())
]
