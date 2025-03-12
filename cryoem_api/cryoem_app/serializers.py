from rest_framework import serializers
from .models import CTF


class CTFSerializer(serializers.ModelSerializer):
    class Meta:
        model = CTF
        # might serialize '__all__' 
        fields = ['id', 'defocusu', 'defocusv']