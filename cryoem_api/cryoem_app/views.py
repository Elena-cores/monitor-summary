from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import CTFSerializer, MicrographSerializer, ConfigSerializer, ParticleSerializer, Class2DSerializer, Coordinate2DSerializer
from .models import CTF, Micrograph, Config, Particle, Class2D, Coordinate2D


# Create your views here.
# These views handle the API endpoints for the CryoEM application, allowing CRUD operations on the models.
class MicrographViewSet(viewsets.ModelViewSet):
    queryset = Micrograph.objects.all()
    serializer_class = MicrographSerializer 
    
class CTFViewSet(viewsets.ModelViewSet):
    queryset = CTF.objects.all()
    serializer_class = CTFSerializer 
    

class Coordinate2DViewSet(viewsets.ModelViewSet):
    queryset = Coordinate2D.objects.all()
    serializer_class = Coordinate2DSerializer

class Class2DViewSet(viewsets.ModelViewSet):
    queryset = Class2D.objects.all()
    serializer_class = Class2DSerializer

# Optimizes db queries using select_related to fetch related fields 
# (coordinate2D, micrograph_fk, and class2d_fk) in a single query, preventing the N+1 query problem when accessing related objects for each particle.
class ParticleViewSet(viewsets.ModelViewSet):
    queryset = Particle.objects.all().select_related(   
        'coordinate2D', 
        'micrograph_fk', 
        'class2d_fk'
    )
    serializer_class = ParticleSerializer
    
class ConfigViewSet(APIView):
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
        
        