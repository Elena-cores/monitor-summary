from rest_framework import viewsets, status, generics
from django.contrib.auth import authenticate, login
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
from .serializers import CTFSerializer, MicrographSerializer, ConfigSerializer, ParticleSerializer, Class2DSerializer, Coordinate2DSerializer, UserRegisterSerializer, UserLoginSerializer
from .models import CTF, Micrograph, Config, Particle, Class2D, Coordinate2D


# Create your views here.
# These views handle the API endpoints for the CryoEM application, allowing CRUD operations on the models.
class MicrographViewSet(viewsets.ModelViewSet):
    queryset = Micrograph.objects.all()
    serializer_class = MicrographSerializer 
    permission_classes = [IsAuthenticated]
    
class CTFViewSet(viewsets.ModelViewSet):
    queryset = CTF.objects.all()
    serializer_class = CTFSerializer
    permission_classes = [IsAuthenticated]
    

class Coordinate2DViewSet(viewsets.ModelViewSet):
    queryset = Coordinate2D.objects.all()
    serializer_class = Coordinate2DSerializer
    permission_classes = [IsAuthenticated]

class Class2DViewSet(viewsets.ModelViewSet):
    queryset = Class2D.objects.all()
    serializer_class = Class2DSerializer
    permission_classes = [IsAuthenticated]

# Optimizes db queries using select_related to fetch related fields 
# (coordinate2D, micrograph_fk, and class2d_fk) in a single query, preventing the N+1 query problem when accessing related objects for each particle.
class ParticleViewSet(viewsets.ModelViewSet):
    queryset = Particle.objects.all().select_related(   
        'coordinate2D', 
        'micrograph_fk', 
        'class2d_fk'
    )
    serializer_class = ParticleSerializer
    permission_classes = [IsAuthenticated]
    
class ConfigViewSet(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        try:
            # get config object
            config = Config.objects.first()
            if not config:
                config = Config.objects.create() # create default config if none exists
            serializer = ConfigSerializer(config)
            return Response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=500)
        
    def patch(self, request):
        # update config partially 
        config = Config.objects.first()
        if not config:
            config = Config.objects.create()  # Create default config if no config exists
        
        serializer = ConfigSerializer(config, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()    # Save the updated config data
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
# User registration and login views
class RegisterView(generics.CreateAPIView):
    serializer_class = UserRegisterSerializer
    permission_classes = []  # allow access without authentication

class LoginView(generics.GenericAPIView):
    serializer_class = UserLoginSerializer
    permission_classes = []
    
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)   # validate input data
        
        user = authenticate(
            username=serializer.validated_data['username'],
            password=serializer.validated_data['password']
        )
        
        if user:
            login(request, user)
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user_id': user.pk,
                'username': user.username
            })
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

# Endpoint to verify if the token is valid
class VerifyTokenView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({'status': 'Valid token'}, status=200)