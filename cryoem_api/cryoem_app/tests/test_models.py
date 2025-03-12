from django.test import TestCase
from cryoem_app.models import CTF

class CTFModelTest(TestCase):
    def test_create_ctf(self):
        
        # create ctf object
        ctf = CTF.objects.create(defocusu=1.2, defocusv=3.4)

        # verify it was created 
        self.assertEqual(ctf.defocusu, 1.2)
        self.assertEqual(ctf.defocusv, 3.4)