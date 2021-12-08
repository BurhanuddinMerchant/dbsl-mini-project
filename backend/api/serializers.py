from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.models import Group
from .models import NurseModel, UserModel


class CreateUserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel

        fields = (
            "id",
            "email",
            "password",
            "fname",
            "lname",
            "pincode",
            "phoneNumber",
            "address",
            "age",
            "gender",
        )
        extra_kwargs = {
            "password": {"write_only": True},
        }

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data["fname"] + " " + validated_data["lname"],
            first_name=validated_data["fname"],
            last_name=validated_data["lname"],
            email=validated_data["email"],
        )
        user.set_password(validated_data["password"])
        user.save()
        user_profile = UserModel(
            user=user,
            fname=validated_data["fname"],
            lname=validated_data["lname"],
            pincode=validated_data["pincode"],
            phoneNumber=validated_data["phoneNumber"],
            email=validated_data["email"],
            address=validated_data["address"],
            age=validated_data["age"],
            gender=validated_data["gender"],
        )
        user_profile.save()
        user_to_vaccinate_group = Group.objects.get(name="user_to_vaccinate")
        user_to_vaccinate_group.user_set.add(user)
        return user_profile


class CreateNurseProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = NurseModel

        fields = (
            "id",
            "email",
            "password",
            "name",
            "phoneNumber",
            "gender",
        )
        extra_kwargs = {
            "password": {"write_only": True},
        }

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data["name"],
            first_name=validated_data["name"],
            email=validated_data["email"],
        )
        user.set_password(validated_data["password"])
        user.save()
        nurse_profile = NurseModel(
            user=user,
            name=validated_data["name"],
            phoneNumber=validated_data["phoneNumber"],
            email=validated_data["email"],
            gender=validated_data["gender"],
        )
        nurse_profile.save()
        nurse_group = Group.objects.get(name="nurse")
        print(nurse_group)
        nurse_group.user_set.add(user)
        return nurse_profile
