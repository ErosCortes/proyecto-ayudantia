from django.db.models import Q
from rest_framework import status
from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from users.permissions import EsAdminOSoloLectura, EsAdmin, EsAlumno, EsProfesor
from .models import Course, Section
from .serializers import CourseSerializer, SectionSerializer
from external_services.services import get_cursos, sync_profesor
from applications.models import Postulation


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def listar_cursos_ucn(request):
    """Obtiene cursos desde la API de la universidad"""
    cursos = get_cursos()
    return Response(cursos)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def sync_cursos_ucn(request):
    """Sincroniza cursos desde la API"""
    cursos = get_cursos()
    
    creados = 0
    actualizados = 0
    
    for curso in cursos:
        _, created = Course.objects.update_or_create(
            codigo_curso=curso['codigo'],
            defaults={'nombre': curso['nombre']}
        )
        if created:
            creados += 1
        else:
            actualizados += 1
    
    return Response({
        'creados': creados,
        'actualizados': actualizados
    })

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [EsAdminOSoloLectura]

    def get_permissions(self):
        if self.action == 'available_for_student':
            return [EsAlumno()]
        if self.action == 'my_courses':
            return [EsProfesor()]
        if self.action == 'add_section':
            return [EsAdmin()]
        return [EsAdminOSoloLectura()]

    @action(detail=False, methods=['get'])
    def by_semester(self, request):
        semestre = request.query_params.get('semestre')
        year = request.query_params.get('year')
        sections = Section.objects.filter(semestre=semestre, year=year)
        courses = Course.objects.filter(sections__in=sections).distinct()
        serializer = self.get_serializer(courses, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def available_for_student(self, request):
        user = request.user
        perfil = getattr(user, 'alumno_profile', None)
        if not perfil:
            return Response({'error': 'Perfil de alumno no encontrado'}, status=400)

        courses = Course.objects.filter(
            ayudantia_activa=True
        ).exclude(
            postulaciones__id_alumno=user
        )

        resultado = []
        for course in courses:
            aprobo = perfil.asignaturas_aprobadas.filter(codigo=course.codigo_curso).exists()
            if not aprobo:
                continue
            resultado.append(course)

        serializer = self.get_serializer(resultado, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def my_courses(self, request):
        user = request.user
        courses = Course.objects.filter(
            Q(sections__profesor=user, metodo_seleccion='INDIVIDUAL') |
            Q(coordinador=user, metodo_seleccion='COORDINADOR')
        ).distinct()
        serializer = self.get_serializer(courses, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def add_section(self, request, pk=None):
        try:
            course = self.get_object()
        except Course.DoesNotExist:
            return Response({'error': 'Curso no encontrado'}, status=404)

        nrc = request.data.get('nrc')
        if not nrc:
            return Response({'error': 'NRC es requerido'}, status=400)

        if Section.objects.filter(nrc=nrc).exists():
            return Response({'error': f'El NRC {nrc} ya existe'}, status=400)

        section = Section.objects.create(
            course=course,
            nrc=nrc,
            profesor_id=request.data.get('profesor'),
            semestre=request.data.get('semestre', ''),
            year=request.data.get('year', 2026),
        )
        serializer = SectionSerializer(section)
        return Response(serializer.data, status=201)


class SectionViewSet(viewsets.ModelViewSet):
    queryset = Section.objects.all()
    serializer_class = SectionSerializer
    permission_classes = [EsAdminOSoloLectura]

    @action(detail=False, methods=['get'])
    def by_course(self, request):
        course_id = request.query_params.get('course_id')
        sections = Section.objects.filter(course_id=course_id)
        serializer = self.get_serializer(sections, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def available(self, request):
        sections = Section.objects.filter(course__ayudantia_activa=True)
        serializer = self.get_serializer(sections, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def my_sections(self, request):
        sections = Section.objects.filter(profesor=request.user)
        serializer = self.get_serializer(sections, many=True)
        return Response(serializer.data)
    

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def sync_profesor_ucn(request):
    """Sincroniza las secciones de un profesor desde la API UCN"""
    rut_raw = request.data.get('rut', '')
    rut_clean = rut_raw.replace('.', '').replace('-', '')
    periodo = request.data.get('periodo', '202520')
    
    if not rut_raw:
        return Response({'error': 'RUT requerido'}, status=status.HTTP_400_BAD_REQUEST)
    
    data = sync_profesor(rut_clean, periodo)
    
    if data is None:
        return Response({'error': 'Profesor no encontrado o sin asignaturas'}, status=status.HTTP_404_NOT_FOUND)
    
    return Response({
        'mensaje': 'Secciones sincronizadas',
        'profesor': data.get('nombre', ''),
        'courses_summary': data.get('courses_summary', []),
    })