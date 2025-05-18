from rest_framework import serializers
from .models import CTF, Micrograph, Config

# convert django objects into JSON and viceversa


# Custom validator to ensure positive values
class PositiveFieldValidator:
    def __call__(self, value):
        if value <= 0:
            raise serializers.ValidationError("This field must be a positive number.")


# Serialize Micrograph
class MicrographSerializer(serializers.ModelSerializer):
    sampling = serializers.FloatField(validators=[PositiveFieldValidator()])
    dose = serializers.FloatField(validators=[PositiveFieldValidator()])
    
    class Meta:
        model = Micrograph
        fields = '__all__'  # includes all fields of the model

# Serialize CTF 
class CTFSerializer(serializers.ModelSerializer):
    defocusu = serializers.FloatField(validators=[PositiveFieldValidator()])
    defocusv = serializers.FloatField(validators=[PositiveFieldValidator()])
    resolution = serializers.FloatField(validators=[PositiveFieldValidator()])
    
    class Meta:
        model = CTF
        fields = '__all__'

class ConfigSerializer(serializers.ModelSerializer):
    # avoid 0 or negative values
    maxres_interval = serializers.FloatField(min_value=0.01)  
    defocuscov_interval = serializers.FloatField(min_value=0.01)    
    class Meta:
        model = Config
        fields = '__all__'