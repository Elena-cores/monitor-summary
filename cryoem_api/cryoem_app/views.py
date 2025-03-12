from rest_framework import viewsets
from .serializers import CTFSerializer
from .models import CTF


# Create your views here.
class CTFViewSet(viewsets.ModelViewSet):
    queryset = CTF.objects.all()
    serializer_class = CTFSerializer 