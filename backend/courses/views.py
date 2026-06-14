from rest_framework import status
from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from users.permissions import EsAdminOSoloLectura
from .models import Course, Section
from .serializers import CourseSerializer, SectionSerializer
from external_services.services import get_cursos, sync_profesor

from rest_framework.decorators import action


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

    @action(detail=False, methods=['get'])
    def by_semester(self, request):
        semestre = request.query_params.get('semestre')
        year = request.query_params.get('year')
        sections = Section.objects.filter(semestre=semestre, year=year)
        courses = Course.objects.filter(sections__in=sections).distinct()
        serializer = self.get_serializer(courses, many=True)
        return Response(serializer.data)


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
        sections = Section.objects.all()
        serializer = self.get_serializer(sections, many=True)
        return Response(serializer.data)
    

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def sync_profesor_ucn(request):
    """Sincroniza las secciones de un profesor desde la API UCN"""
    rut = request.data.get('rut')
    periodo = request.data.get('periodo', '202520')
    
    if not rut:
        return Response({'error': 'RUT requerido'}, status=status.HTTP_400_BAD_REQUEST)
    
    data = sync_profesor(rut, periodo)
    
    if data is None:
        return Response({'error': 'Profesor no encontrado o sin asignaturas'}, status=status.HTTP_404_NOT_FOUND)
    
    return Response({'mensaje': 'Secciones sincronizadas', 'profesor': data['nombre']})