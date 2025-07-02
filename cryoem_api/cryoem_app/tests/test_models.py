from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from django.core.exceptions import ValidationError
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from datetime import datetime

from cryoem_app.models import Micrograph, CTF, Config

# --------------------------------------------------
# Unit Tests for Micrograph model
# --------------------------------------------------
class MicrographModelTest(TestCase):
    def setUp(self):
        self.micrograph_data = {
            'filename': "test_image.jpg",
            'sampling': 1.2,
            'dose': 2.3,
            'datetime_micro': datetime.now()
        }

    # Test for creating a valid micrograph entry
    def test_create_micrograph(self):
        micrograph = Micrograph.objects.create(**self.micrograph_data)
        self.assertEqual(Micrograph.objects.count(), 1)
        self.assertEqual(micrograph.sampling, 1.2)

    # Test for handling invalid (negative) sampling value during micrograph creation
    def test_create_micrograph_negative_values(self):
        micrograph = Micrograph(
            filename="test.jpg",
            sampling=-1.0,  # invalid
            dose=2.0,
            datetime_micro=datetime.now()
        )
        with self.assertRaises(ValidationError):
            micrograph.full_clean()
            micrograph.save()

    # Test for deleting a micrograph entry
    def test_delete_micrograph(self):
        micrograph = Micrograph.objects.create(**self.micrograph_data)
        micrograph.delete()
        self.assertEqual(Micrograph.objects.count(), 0)

# --------------------------------------------------
# Unit Tests for CTF model
# --------------------------------------------------
class CTFModelTest(TestCase):
    def setUp(self):
        self.micrograph = Micrograph.objects.create(
            filename="test_image.jpg",
            sampling=1.2,
            dose=2.3,
            datetime_micro=datetime.now()
        )

        self.ctf_data = {
            'micrograph': self.micrograph,
            'defocusu': 1.0,
            'defocusv': 1.5,
            'phaseshift': 5.0,
            'resolution': 2.0,
            'datetime_ctf': datetime.now(),
            'psd': "psd1.png"
        }

    # Test for creating a valid CTF entry
    def test_ctf_creation(self):
        ctf = CTF.objects.create(**self.ctf_data)
        self.assertEqual(CTF.objects.count(), 1)
        self.assertEqual(ctf.micrograph, self.micrograph)

    # Test for validating phaseshift value in CTF model
    def test_phaseshift_validation(self):
        ctf = CTF.objects.create(**{**self.ctf_data, 'phaseshift': -10.0})
        self.assertEqual(ctf.phaseshift, -10.0)

    # Test for ensuring that deleting a Micrograph also deletes the associated CTF
    def test_delete_micrograph_cascades_to_ctf(self):
        ctf = CTF.objects.create(**self.ctf_data)
        self.micrograph.delete()
        self.assertEqual(CTF.objects.count(), 0)

# --------------------------------------------------
# API Tests for Config endpoint
# --------------------------------------------------
class ConfigAPITest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='Testpass123')
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

        self.default_config = Config.objects.create(
            maxres_min=0.0,
            maxres_max=10.0,
            maxres_interval=0.5,
            defocuscov_min=0.0,
            defocuscov_max=4.0,
            defocuscov_interval=0.5,
            color_resolution="#2CAFFE"
        )

    # Test for fetching the current configuration from the API
    def test_get_config(self):
        response = self.client.get("/api/config/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["maxres_min"], 0.0)
        self.assertEqual(response.data["color_resolution"], "#2CAFFE")

     # Test for fetching configuration when none exists in the database
    def test_get_config_when_none_exists(self):
        Config.objects.all().delete()
        response = self.client.get("/api/config/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(Config.objects.exists())

    # Test for updating the configuration with valid data
    def test_patch_config_valid(self):
        update_data = {"color_resolution": "#00FF00", "maxres_interval": 1.0}
        response = self.client.patch("/api/config/", update_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.default_config.refresh_from_db()
        self.assertEqual(self.default_config.color_resolution, "#00FF00")
        self.assertEqual(self.default_config.maxres_interval, 1.0)

    # Test for updating the configuration with invalid data
    def test_patch_config_invalid(self):
        update_data = {"maxres_interval": -0.5}
        response = self.client.patch("/api/config/", update_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        