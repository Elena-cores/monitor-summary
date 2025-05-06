from django.test import TestCase    # for unit testing
from cryoem_app.models import CTF, Micrograph, Config
from datetime import datetime
from rest_framework.test import APITestCase # for API testing 
from rest_framework import status   # status codes for API responses 
# from unittest.mock import patch # for mocking objects in tests

TEST_DIR = 'test_data'

# Mcirograph unit testing 
class MicrographModelTest(TestCase):
    def test_create_micrograph(self):
        micrograph = Micrograph.objects.create(
            filename="test_image.jpg",
            sampling=1.2,
            dose=2.3,
            datetime_micro=datetime.now()
        )
        self.assertEqual(Micrograph.objects.count(), 1)
        self.assertEqual(micrograph.sampling, 1.2)

    def test_delete_micrograph(self):
        micrograph = Micrograph.objects.create(
            filename="test_image.jpg",
            sampling=1.2,
            dose=2.3,
            datetime_micro=datetime.now()
        )
        micrograph.delete()
        self.assertEqual(Micrograph.objects.count(), 0)

# CTF unit testing
class CTFModelTest(TestCase):
    def setUp(self):
        # create a micrograph to associate with the CTFs    
        self.micrograph = Micrograph.objects.create(
            filename="test_image.jpg",
            sampling=1.2,
            dose=2.3,
            datetime_micro=datetime.now()
        )

    def test_create_ctf(self):
        ctf = CTF.objects.create(
            micrograph=self.micrograph,
            defocusu=1.0,
            defocusv=1.5,
            phaseshift=5.0,
            resolution=2.0,
            datetime_ctf=datetime.now(),
            psd="psd1.png"
        )
        self.assertEqual(CTF.objects.count(), 1)
        self.assertEqual(ctf.micrograph, self.micrograph)

    def test_delete_micrograph_cascades_to_ctf(self):
        ctf = CTF.objects.create(
            micrograph=self.micrograph,
            defocusu=1.0,
            defocusv=1.5,
            phaseshift=5.0,
            resolution=2.0,
            datetime_ctf=datetime.now(),
            psd="psd1.png"
        )
        self.micrograph.delete()
        self.assertEqual(CTF.objects.count(), 0)  # Delete micrograph should delete related CTFs
        
# Config unit testing 
class ConfigAPITest(APITestCase):
    def setUp(self):
        # create a Config object for testing
        self.config = Config.objects.create(interval=0.5, color_resolution="#FF0000")

    def test_get_config(self):
        response = self.client.get("/api/config/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("min_range", response.data)
        self.assertIn("max_range", response.data)

    def test_patch_config(self):
        response = self.client.patch("/api/config/", {"color_resolution": "#00FF00"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["color_resolution"], "#00FF00")