from django.test import TestCase    # for unit testing
from cryoem_app.models import CTF, Micrograph, Config
from datetime import datetime
from rest_framework.test import APITestCase # for API testing 
from rest_framework import status   # status codes for API responses 
from django.core.exceptions import ValidationError  # for validation errors
# from unittest.mock import patch # for mocking objects in tests

TEST_DIR = 'test_data'

# Mcirograph unit testing 
class MicrographModelTest(TestCase):
    # setUp method to create a test micrograph object
    def setUp(self):
        self.micrograph_data = {
            'filename': "test_image.jpg",
            'sampling': 1.2,
            'dose': 2.3,
            'datetime_micro': datetime.now()
        }
        
    # Test for creating a valid micrograph
    def test_create_micrograph(self):
        micrograph = Micrograph.objects.create(**self.micrograph_data)
        self.assertEqual(Micrograph.objects.count(), 1)
        self.assertEqual(micrograph.sampling, 1.2)

    # Test for creating a micrograph with invalid data
    def test_create_micrograph_negative_values(self):
        micrograph = Micrograph(
        filename="test.jpg",
        sampling=-1.0,  # Valor inválido
        dose=2.0,
        datetime_micro=datetime.now()
    )
        with self.assertRaises(ValidationError): 
            micrograph.full_clean()  # full_clean() validates the model instance
            micrograph.save()   # won't be executed if full_clean() fails

    # test for deleting a micrograph
    def test_delete_micrograph(self):
        micrograph = Micrograph.objects.create(**self.micrograph_data)
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
        
        # create a CTF object to test against
        self.ctf_data = {
            'micrograph': self.micrograph,
            'defocusu': 1.0,
            'defocusv': 1.5,
            'phaseshift': 5.0,
            'resolution': 2.0,
            'datetime_ctf': datetime.now(),
            'psd': "psd1.png"
        }
    
    # Test for creating a valid CTF
    def test_ctf_creation(self):
        ctf = CTF.objects.create(**self.ctf_data)
        self.assertEqual(CTF.objects.count(), 1)
        self.assertEqual(ctf.micrograph, self.micrograph)
        self.assertEqual(self.micrograph.ctfs.count(), 1)  # trying related_name 
    
    # Test for valid phaseshift. Since it's in degrees, it can be negative
    def test_phaseshift_validation(self):
        ctf = CTF.objects.create(**{**self.ctf_data, 'phaseshift': -10.0})
        self.assertEqual(ctf.phaseshift, -10.0)

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
    # setUp method to create a test config object
    def setUp(self):
        self.default_config = Config.objects.create(
            maxres_min=0.0,
            maxres_max=10.0,
            maxres_interval=0.5,
            defocuscov_min=0.0,
            defocuscov_max=4.0,
            defocuscov_interval=0.5,
            color_resolution="#2CAFFE"
        )

    # Test request to get the config
    def test_get_config(self):
        response = self.client.get("/api/config/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["maxres_min"], 0.0)
        self.assertEqual(response.data["color_resolution"], "#2CAFFE")

    # Test for getting config when none exists
    def test_get_config_when_none_exists(self):
        Config.objects.all().delete()  # delete all existing configs
        response = self.client.get("/api/config/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # check if the response contains default values
        self.assertTrue(Config.objects.exists())

    # Test for creating a new valid config
    def test_patch_config_valid(self):
        update_data = {"color_resolution": "#00FF00", "maxres_interval": 1.0}
        response = self.client.patch("/api/config/", update_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.default_config.refresh_from_db()
        self.assertEqual(self.default_config.color_resolution, "#00FF00")
        self.assertEqual(self.default_config.maxres_interval, 1.0)

     # Test with invalid data: negative interval
    def test_patch_config_invalid(self):
        update_data = {"maxres_interval": -0.5} 
        response = self.client.patch("/api/config/", update_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)