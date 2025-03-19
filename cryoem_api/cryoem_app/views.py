from rest_framework import viewsets
from .serializers import CTFSerializer, MicrographSerializer
from .models import CTF, Micrograph


# Create your views here.
class MicrographViewSet(viewsets.ModelViewSet):
    queryset = Micrograph.objects.all()
    serializer_class = MicrographSerializer 
    
class CTFViewSet(viewsets.ModelViewSet):
    queryset = CTF.objects.all()
    serializer_class = CTFSerializer 