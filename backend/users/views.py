from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.shortcuts import redirect
from django.contrib.auth.decorators import login_required
from rest_framework import status
from .models import Application
from .serializers import ApplicationSerializer


@api_view(['GET', 'POST'])
def applications(request):

    if request.method == 'GET':
        apps = Application.objects.all()
        serializer = ApplicationSerializer(apps, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        serializer = ApplicationSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from .models import (
    Tutorship,
    Application
)

from .serializers import (
    TutorshipSerializer,
    ApplicationSerializer
)

@login_required
def oauth_success(request):

    email = request.user.email.lower()
    print(email)
    # PROFESOR
    if email == "profesorucntest@gmail.com":
        return redirect("http://localhost:3000/teacher")

    # ESTUDIANTE
    if email.endswith("@alumnos.ucn.cl"):
        return redirect("http://localhost:3000/student")

    #cualquier otro correo
    return redirect("http://localhost:3000/student")


@api_view(['GET'])
def get_tutorships(request):

    tutorships = Tutorship.objects.all()

    serializer = TutorshipSerializer(
        tutorships,
        many=True
    )

    return Response(serializer.data)


@api_view(['GET', 'POST'])
def get_applications(request):

    if request.method == 'GET':
        apps = Application.objects.all()
        serializer = ApplicationSerializer(apps, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        serializer = ApplicationSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)