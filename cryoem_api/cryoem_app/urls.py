from django.urls import path, include
from rest_framework.documentation import include_docs_urls
from rest_framework import routers 
from rest_framework.authtoken import views as auth_views
from rest_framework.permissions import AllowAny
from cryoem_app import views
from .views import ConfigViewSet, RegisterView, LoginView, VerifyTokenView


# generate routes automatically (using ModelViewSet, which provides CRUD operations)
# routes for CTF, Micrograph, Coordinate2D, Class2D, and Particle models
router = routers.DefaultRouter()
router.register(r'ctf', views.CTFViewSet)  
router.register(r'micrograph', views.MicrographViewSet) 
router.register(r'coordinate', views.Coordinate2DViewSet)  
router.register(r'class2d', views.Class2DViewSet)
router.register(r'particle', views.ParticleViewSet)   

# include all routes from router 
urlpatterns = [
    path('api/', include(router.urls)),
    path('api/auth/', include([
        path('token/', auth_views.obtain_auth_token),
        path('register/', RegisterView.as_view(), name='register'),
        path('login/', LoginView.as_view(), name='login'),
        ])),
    path('api/config/', ConfigViewSet.as_view(), name='config'), # manual route for config
    path('api/auth/verify-token/', VerifyTokenView.as_view(), name='verify-token'),
    path('docs/', include_docs_urls(title="Cyroem API", permission_classes=[AllowAny])),    # automatic API documentation and find routes: http://127.0.0.1:8000/docs/
]