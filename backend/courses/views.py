from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Course, Section
from .serializers import CourseSerializer, SectionSerializer


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save()

    @action(detail=False, methods=['get'])
    def by_semester(self, request):
        """Obtiene cursos por semestre"""
        semestre = request.query_params.get('semestre')
        year = request.query_params.get('year')
        
        sections = Section.objects.filter(semestre=semestre, year=year)
        courses = Course.objects.filter(sections__in=sections).distinct()
        serializer = self.get_serializer(courses, many=True)
        return Response(serializer.data)


class SectionViewSet(viewsets.ModelViewSet):
    queryset = Section.objects.all()
    serializer_class = SectionSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def by_course(self, request):
        """Obtiene secciones por curso"""
        course_id = request.query_params.get('course_id')
        sections = Section.objects.filter(course_id=course_id)
        serializer = self.get_serializer(sections, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def available(self, request):
        """Obtiene secciones disponibles para postulación"""
        sections = Section.objects.all()
        serializer = self.get_serializer(sections, many=True)
        return Response(serializer.data)
