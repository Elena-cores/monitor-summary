from rest_framework import serializers
from .models import CTF, Micrograph, Config

# convert django objects into JSON and viceversa

# Serialize Micrograph
class MicrographSerializer(serializers.ModelSerializer):
    class Meta:
        model = Micrograph
        fields = '__all__'  # includes all fields of the model

# Serialize CTF 
class CTFSerializer(serializers.ModelSerializer):
    class Meta:
        model = CTF
        fields = '__all__'

class ConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = Config
        fields = '__all__'