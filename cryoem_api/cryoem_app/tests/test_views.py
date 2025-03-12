from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from cryoem_app.models import CTF

class testViews(APITestCase):
    def test_create_ctf(self):
        
        # try to create new CTF object
        url = reverse('ctf-list')  # use route name
        data = {'defocusu': 4.55333, 'defocusv': 7.2}
        response = self.client.post(url, data, format='json')
        
        #   verify response with status code 200 (OK)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # verify in database
        self.assertEqual(CTF.objects.get().defocusu, 4.55333)
    