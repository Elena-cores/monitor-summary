from django.urls import path, include
from rest_framework.documentation import include_docs_urls
from rest_framework import routers 
from cryoem_app import views

# generate routes automatically
router = routers.DefaultRouter()
router.register(r'ctf', views.CTFViewSet)

# include all routes from router 
urlpatterns = [
    path('api/', include(router.urls)),
    path('docs/', include_docs_urls(title="Cyroem API"))    # automatic API documentation and associated routes
] 