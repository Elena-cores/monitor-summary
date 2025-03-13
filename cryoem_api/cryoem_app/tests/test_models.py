from django.test import TestCase
from cryoem_app.models import CTF
from django.urls import reverse     # reverse-routing (getting a url path from a name)


class CTFModelTest(TestCase):
    def test_read_ctf(self):
        # create ctf object
        ctf = CTF.objects.create(defocusu=1.2, defocusv=3.4)
        ctf = CTF.objects.create(defocusu=5.2, defocusv=0.123)
        
        # get urls reverse
        url = reverse(('ctf-detail'), args=[ctf.id])
        response = self.client.get(url, format='json')
        
        # verify it was read
        self.assertEqual(response.status_code, 200)
        
    def test_create_ctf(self):
        
        ctf = CTF.objects.create(defocusu=1.2345, defocusv=3.4111)

        # verify it was created 
        self.assertEqual(ctf.defocusu, 1.2345)
        self.assertEqual(ctf.defocusv, 3.4111)
        
    def test_delete_ctf(self):
        # create ctf object
        ctf = CTF.objects.create(defocusu=1.2, defocusv=3.4)
        
        # get url reverse
        url = reverse(('ctf-detail'), args=[ctf.id])
        response = self.client.delete(url, format='json')
        
        # verify it was deleted (204)
        self.assertEqual(response.status_code, 204) 
        
    def test_update_ctf(self):
        # create ctf object to try
        ctf = CTF.objects.create(defocusu=4.55, defocusv=7.2)
    
        # get urls reverse
        url = reverse('ctf-detail', args=[ctf.id])
        
        data = {
            'defocusu': 2.31,
            'defocusv': 12.2
        }   
        
        # update with new data
        response = self.client.put(url, data, format='json', content_type='application/json')
        
        self.assertEqual(response.status_code, 200)
         
        ctf.refresh_from_db()
        
        # verify updated data
        self.assertEqual(ctf.defocusu, 2.31)
        self.assertEqual(ctf.defocusv, 12.2)
        
        