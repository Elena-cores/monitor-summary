from django.urls import path, include
from rest_framework.documentation import include_docs_urls
from rest_framework import routers 
from cryoem_app import views
from .views import ConfigViewSet

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
    path('api/config/', ConfigViewSet.as_view(), name='config'), # manual route for config
    path('docs/', include_docs_urls(title="Cyroem API")),    # automatic API documentation and find routes: http://127.0.0.1:8000/docs/
]