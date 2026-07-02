from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.exceptions import PermissionDenied
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate

from .models import User, StudentProfile, TeacherProfile, AdminProfile
from .serializers import (
    UserSerializer, StudentProfileSerializer, TeacherProfileSerializer,
    AdminProfileSerializer, RegisterSerializer, LoginSerializer,
    ChangePasswordSerializer
)
from .permissions import EsAdmin
from external_services.services import get_alumnos, sync_profesor
from courses.models import Section
from courses.serializers import SectionSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def change_password(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = request.user
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        return Response({'message': 'Contraseña cambiada exitosamente'})
    @action(detail=False, methods=['get'])
    def profile_type(self, request):
        user = request.user
        profile_type = None
        profile_data = None

        if hasattr(user, 'profesor_profile'):
            profile_type = 'teacher'
            profile_data = TeacherProfileSerializer(user.profesor_profile).data
        elif hasattr(user, 'alumno_profile') and user.alumno_profile.alumno_activo:
            profile_type = 'student'
            profile_data = StudentProfileSerializer(user.alumno_profile).data
        elif hasattr(user, 'admin_profile') or user.is_staff:
            profile_type = 'admin'
            profile_data = AdminProfileSerializer(user.admin_profile).data if hasattr(user, 'admin_profile') else {}

        return Response({
            'profile_type': profile_type,
            'user': UserSerializer(user).data,
            'profile': profile_data
        })
    @action(detail=False, methods=['post'], permission_classes=[EsAdmin])
    def create_teacher(self, request):
        rut_raw = request.data.get('rut', '').strip()
        rut_clean = rut_raw.replace('.', '').replace('-', '')
        nombre = request.data.get('nombre_completo', '')
        password = request.data.get('password', 'profe1234')

        if not rut_raw:
            return Response({'error': 'RUT es requerido'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(rut=rut_raw).exists():
            return Response({'error': 'El RUT ya está registrado'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(
            username=rut_raw,
            rut=rut_raw,
            password=password,
            nombre_completo=nombre or f'Profesor {rut_raw}',
            correo_institucional=request.data.get('correo_institucional', ''),
            telefono=request.data.get('telefono', ''),
            direccion=request.data.get('direccion', ''),
        )
        TeacherProfile.objects.create(user=user)

        secciones_creadas = 0
        error_sync = None
        try:
            data = sync_profesor(rut_raw)
            if data and data.get('asignaturas'):
                secciones_creadas = len(data['asignaturas'])
        except Exception as e:
            error_sync = str(e)
            print(f"[create_teacher] Error sync profesor: {e}")

        sections = Section.objects.filter(profesor=user)
        return Response({
            'user': UserSerializer(user).data,
            'profile': TeacherProfileSerializer(user.profesor_profile).data,
            'sections': SectionSerializer(sections, many=True).data,
            'password': password,
            'sync_secciones': secciones_creadas,
            'error_sync': error_sync,
        }, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['post'], permission_classes=[EsAdmin])

    def promote_to_teacher(self, request):
        user_id = request.data.get('user_id')
        if not user_id:
            return Response({'error': 'user_id es requerido'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        if hasattr(user, 'profesor_profile'):
            return Response({'error': 'Este usuario ya tiene perfil de profesor'}, status=status.HTTP_400_BAD_REQUEST)
        
        #Para pasarlo de alumno a profe
        if hasattr(user, 'alumno_profile'):
            user.alumno_profile.activo = False
            user.alumno_profile.save()

        if not user.rut:
            return Response(
                {'error': 'El usuario no tiene RUT registrado, no se puede sincronizar con la UCN'},
                status=status.HTTP_400_BAD_REQUEST
            )

        TeacherProfile.objects.create(user=user, rut=user.rut)

        secciones_creadas = 0
        error_sync = None
        try:
            data = sync_profesor(user.rut)
            if data and data.get('asignaturas'):
                secciones_creadas = len(data['asignaturas'])
        except Exception as e:
            error_sync = str(e)
            print(f"[promote_to_teacher] Error sync profesor: {e}")

        sections = Section.objects.filter(profesor=user)
        return Response({
            'user': UserSerializer(user).data,
            'profile': TeacherProfileSerializer(user.profesor_profile).data,
            'sections': SectionSerializer(sections, many=True).data,
            'sync_secciones': secciones_creadas,
            'error_sync': error_sync,
            'sigue_siendo_alumno': hasattr(user, 'alumno_profile'),
        }, status=status.HTTP_201_CREATED)


class StudentProfileViewSet(viewsets.ModelViewSet):
    queryset = StudentProfile.objects.all()
    serializer_class = StudentProfileSerializer
    permission_classes = [IsAuthenticated]


class TeacherProfileViewSet(viewsets.ModelViewSet):
    queryset = TeacherProfile.objects.all()
    serializer_class = TeacherProfileSerializer
    permission_classes = [IsAuthenticated]


class AdminProfileViewSet(viewsets.ModelViewSet):
    queryset = AdminProfile.objects.all()
    serializer_class = AdminProfileSerializer
    permission_classes = [IsAuthenticated]


class RegisterView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        rut = serializer.validated_data['rut']
        password = serializer.validated_data['password']

        alumnos = get_alumnos()
        print(f"[DEBUG] Alumnos recibidos: {len(alumnos)}")
        alumno_data = None
        for a in alumnos:
            print(f"[DEBUG] Comparando: '{a.get('rut')}' == '{rut}'")
            if a.get('rut') == rut:
                alumno_data = a
                break

        if not alumno_data:
            raise PermissionDenied(
                "Acceso denegado debido a que no perteneces a la Universidad"
            )

        user = User.objects.create_user(
            username=rut,
            rut=rut,
            password=password,
            nombre_completo=alumno_data.get('nombre', ''),
            correo_institucional=alumno_data.get('correo', ''),
            telefono=alumno_data.get('telefono', ''),
            direccion=alumno_data.get('direccion', ''),
        )

        carrera = alumno_data.get('carrera', {})
        StudentProfile.objects.create(
            user=user,
            ppa=alumno_data.get('ppa'),
            alerta_academica=alumno_data.get('alertaAcademica', False),
            carrera_codigo=carrera.get('codigo', ''),
            carrera_nombre=carrera.get('nombre', ''),
        )

        refresh = RefreshToken.for_user(user)

        return Response({
            'user': UserSerializer(user).data,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }, status=status.HTTP_201_CREATED)


class LoginView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        rut = serializer.validated_data['rut']
        password = serializer.validated_data['password']

        user = authenticate(username=rut, password=password)

        if user is None:
            try:
                user = User.objects.get(rut=rut)
            except User.DoesNotExist:
                return Response(
                    {'error': 'RUT o contraseña incorrectos'},
                    status=status.HTTP_401_UNAUTHORIZED
                )
            if not user.check_password(password):
                return Response(
                    {'error': 'RUT o contraseña incorrectos'},
                    status=status.HTTP_401_UNAUTHORIZED
                )

        refresh = RefreshToken.for_user(user)

        return Response({
            'user': UserSerializer(user).data,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        })
