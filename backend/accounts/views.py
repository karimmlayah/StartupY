from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from .serializers import (
    UserRegistrationSerializer, 
    UserSerializer, 
    CustomTokenObtainPairSerializer,
    ChooseRoleSerializer
)
from .permissions import IsAdminUserRole

User = get_user_model()

class CustomLoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class RegisterView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = UserRegistrationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Generate tokens immediately upon registration
        refresh = RefreshToken.for_user(user)
        user_data = UserSerializer(user).data

        return Response({
            'user': user_data,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'message': 'Registration successful'
        }, status=status.HTTP_201_CREATED)

class CurrentUserView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

class ChooseRoleView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        # Role cannot be changed once assigned if not admin
        if user.role in ['startup', 'investor', 'admin'] and not request.data.get('force'):
            # Allow choice if role was default or unselected
            pass
        serializer = ChooseRoleSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user.role = serializer.validated_data['role']
        user.save(update_fields=['role'])
        return Response({
            'user': UserSerializer(user).data,
            'message': f"Role successfully updated to {user.role}"
        })

class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
        except Exception:
            # Token may not support blacklist or already invalid
            pass
        return Response({'message': 'Successfully logged out'}, status=status.HTTP_200_OK)

class AdminUserListView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAdminUserRole]
    queryset = User.objects.all().order_by('-date_joined')
