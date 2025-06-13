from rest_framework import serializers
from .models import CTF, Micrograph, Config, Particle, Class2D, Coordinate2D
from django.contrib.auth.models import User     # User model from Django's auth system

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

# Serialize Coordinate2D
class Coordinate2DSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coordinate2D
        fields = '__all__'

# Serialize Class2D
class Class2DSerializer(serializers.ModelSerializer):
    class Meta:
        model = Class2D
        fields = '__all__'

# Serialize Particle
class ParticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Particle
        fields = '__all__'

# Serialize Config
class ConfigSerializer(serializers.ModelSerializer):
    # avoid 0 or negative values
    maxres_interval = serializers.FloatField(min_value=0.01)  
    defocuscov_interval = serializers.FloatField(min_value=0.01)    
    class Meta:
        model = Config
        fields = '__all__'
        
        
# Serializers for User registration and login
# # UserRegisterSerializer is used to create a new user with username, password, and email.
class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'password', 'email']
    
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            email=validated_data.get('email', '')
        )
        return user
# UserLoginSerializer to authenticate a user with username and password.
class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)