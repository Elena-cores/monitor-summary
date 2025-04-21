from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import CTFSerializer, MicrographSerializer, ConfigSerializer
from .models import CTF, Micrograph, Config


# Create your views here.
class MicrographViewSet(viewsets.ModelViewSet):
    queryset = Micrograph.objects.all()
    serializer_class = MicrographSerializer 
    
class CTFViewSet(viewsets.ModelViewSet):
    queryset = CTF.objects.all()
    serializer_class = CTFSerializer 

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
            config = Config.objects.create()  
        
        serializer = ConfigSerializer(config, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        