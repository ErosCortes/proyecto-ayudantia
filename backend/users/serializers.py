from rest_framework import serializers

from .models import (
    Profile,
    Tutorship,
    Application
)

from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):

    class Meta:

        model = User

        fields = [
            'id',
            'username',
            'email'
        ]


class ProfileSerializer(serializers.ModelSerializer):

    user = UserSerializer()

    class Meta:

        model = Profile

        fields = '__all__'


class TutorshipSerializer(
    serializers.ModelSerializer
):

    professor = UserSerializer()

    class Meta:

        model = Tutorship

        fields = '__all__'


class ApplicationSerializer(
    serializers.ModelSerializer
):

    student = UserSerializer()

    tutorship = TutorshipSerializer()

    class Meta:

        model = Application

        fields = '__all__'