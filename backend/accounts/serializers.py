from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'email'

    def validate(self, attrs):
        # Allow case-insensitive email match
        if 'email' in attrs:
            attrs['email'] = attrs['email'].strip().lower()
        data = super().validate(attrs)
        data['user'] = UserSerializer(self.user).data
        return data

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ('id', 'email', 'password', 'first_name', 'last_name', 'role')
        extra_kwargs = {
            'role': {'required': False},
            'first_name': {'required': False},
            'last_name': {'required': False},
        }

    def validate_email(self, value):
        norm = value.strip().lower()
        if User.objects.filter(email__iexact=norm).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return norm

    def validate_role(self, value):
        if value not in ['admin', 'investor', 'startup']:
            return 'startup'
        return value

    def create(self, validated_data):
        password = validated_data.pop('password')
        role = validated_data.get('role', 'startup')
        user = User.objects.create_user(
            password=password,
            **validated_data
        )
        return user

class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()

    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'full_name', 'role', 'is_active', 'is_staff', 'date_joined')
        read_only_fields = ('id', 'is_active', 'is_staff', 'date_joined')

class ChooseRoleSerializer(serializers.Serializer):
    role = serializers.ChoiceField(choices=['startup', 'investor'])

    def validate_role(self, value):
        if value not in ['startup', 'investor']:
            raise serializers.ValidationError("Role must be 'startup' or 'investor'.")
        return value
