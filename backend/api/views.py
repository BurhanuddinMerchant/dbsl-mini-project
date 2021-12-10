from django.db import connections
from rest_framework.permissions import IsAuthenticated

from .models import NurseModel, SlotModel, UserModel, VaccineCenterModel
from .serializers import CreateNurseProfileSerializer, CreateUserProfileSerializer
from rest_framework import generics
from .auth import BearerToken
from rest_framework.response import Response
from django.http import JsonResponse
from django.core import serializers
from rest_framework.authtoken.models import Token
import json
from django.core import serializers
# Create your views here.
class UserRegistrationAPI(generics.GenericAPIView):
    serializer_class = CreateUserProfileSerializer

    def post(self, request, *args, **kwargs):

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token = Token.objects.create(user=user.user)
        return Response({"user": "User", "data": {"token": token.key}})


class NurseRegistrationAPI(generics.GenericAPIView):
    serializer_class = CreateNurseProfileSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({"nurse": "Nurse"})


class VaccinateUserAPI(generics.GenericAPIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = (BearerToken,)

    def patch(self, request, *args, **kwargs):
        if (
            self.request.user.groups.filter(name__in=["admin", "nurse"]).exists()
            or request.user.is_superuser
        ):
            user = UserModel.objects.filter(id=int(request.data["userID"])).first()
            if user is not None:
                if user.isVaccinated:
                    return Response({"error": "Already Vaccinated"}, status=200)
                user.isVaccinated = True
                user.save()
                return Response({"message": "Success"}, status=200)
            return Response({"error": "User not found"})
        return Response({"error": "Not Authorized"}, status=404)


class GetUsersToVaccinateAPI(generics.GenericAPIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = (BearerToken,)

    def get(self, request, *args, **kwargs):
        print(int(request.query_params["slotID"]))
        slot = int(request.query_params["slotID"])
        nurse = NurseModel.objects.filter(user=request.user).first()
        print(nurse)
        users = UserModel.objects.filter(slot__id=slot, nurse=nurse).values()
        for i in range(len(users)):
            del users[i]["password"]

        # return Response(data=list(users))
        return JsonResponse(data=list(users), safe=False)


class RegisterUserForVaccinationAPI(generics.GenericAPIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = (BearerToken,)

    def patch(self, request, *args, **kwargs):
        if (
            self.request.user.groups.filter(
                name__in=["admin", "user_to_vaccinate"]
            ).exists()
            or request.user.is_superuser
        ):
            slotID = int(request.data["slotID"])
            vaccineCenterID = int(request.data["vaccineCenterID"])
            user = UserModel.objects.filter(user=request.user).first()
            if user.isVaccinated:
                return Response({"error": "Already Vaccinated"}, status=200)
            vaccineCenter = VaccineCenterModel.objects.filter(
                id=vaccineCenterID
            ).first()
            slot = SlotModel.objects.filter(id=slotID).filter().first()
            nurse = NurseModel.objects.filter(vaccineCenter=vaccineCenter).first()
            user.vaccineCenter = vaccineCenter
            user.nurse = nurse
            user.slot = slot
            user.save()
            return Response({"message": "Successfully registered"}, status=200)
        return Response({"error": "Not Authorized"}, status=400)


class GetAllSlotsAPI(generics.GenericAPIView):
    def get(self, request, *args, **kwargs):
        slots = SlotModel.objects.all().values()
        return Response({"data": slots})


class GetUserProfileAPI(generics.GenericAPIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = (BearerToken,)

    def get(self, request, *args, **kwargs):
        if (
            self.request.user.groups.filter(
                name__in=["admin", "user_to_vaccinate"]
            ).exists()
            or request.user.is_superuser
        ):

            user = UserModel.objects.filter(user=request.user).values()[0]
            return Response({"message": "Profile Retreived", "data": user}, status=200)
        return Response({"error": "Not Authorized"}, status=400)


class GetNurseProfileAPI(generics.GenericAPIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = (BearerToken,)

    def get(self, request, *args, **kwargs):
        if (
            self.request.user.groups.filter(name__in=["admin", "nurse"]).exists()
            or request.user.is_superuser
        ):

            user = NurseModel.objects.filter(user=request.user).values()[0]
            vaccine_center = NurseModel.objects.filter(user=request.user)[
                0
            ].vaccineCenter
            user["vaccineCenter"] = {
                "name": vaccine_center.name,
                "id": vaccine_center.id,
                "pincode": vaccine_center.pincode,
                "address": vaccine_center.address,
                "capacity_per_slot": vaccine_center.capacity_per_slot,
            }
            all_slots = SlotModel.objects.all().filter(nurse=user["id"]).values()
            user["slots"] = all_slots
            return Response({"message": "Profile Retreived", "data": user}, status=200)
        return Response({"error": "Not Authorized"}, status=400)


class GetAllVaccineCentersAPI(generics.GenericAPIView):
    def get(self, request, *args, **kwargs):
        vaccine_centers = VaccineCenterModel.objects.all().values()
        for i in range(len(vaccine_centers)):
            all_slots = (
                SlotModel.objects.all()
                .filter(nurse__vaccineCenter=vaccine_centers[i]["id"])
                .values()
            )
            vaccine_centers[i]["slots"] = all_slots

        return Response({"data": vaccine_centers})

class RawQueryAPI(generics.GenericAPIView):
    def get(self,request,*args,**kwargs):
        v = VaccineCenterModel.objects.raw("select * from api_vaccinecentermodel")
        data = serializers.serialize('json',v, fields=('name','address','capacity_per_slot','phoneNumber'))
        return Response({"data":json.loads(data)})