from django.test import TestCase
from cryoem_app.models import CTF, Micrograph
from django.urls import reverse     # reverse-routing (getting a url path from a name)
from django.core.files.uploadedfile import SimpleUploadedFile
from datetime import datetime
from django.test import override_settings   # provide seperate folder for uploaded files during testing 
import shutil

TEST_DIR = 'test_data'

# mcirograph unit testing 
class MicrographModelTest(TestCase):
    
    @override_settings(MEDIA_ROOT=(TEST_DIR + '/media'))
    # create object micrograph with valid data
    def test_create_valid_micrograph(self):
        micrograph = Micrograph.objects.create(
            filename=SimpleUploadedFile("test_image1.jpg", b"file_content"),
            sampling=1.2,
            dose=2.3,
            datetime_micro=datetime.now()
        )
        self.assertEqual(micrograph.sampling, 1.2)
        self.assertEqual(micrograph.dose, 2.3)

    def test_create_invalid_micrograph(self):
        # try creating micrograph with invalid data (sampling)
        with self.assertRaises(ValueError):
            Micrograph.objects.create(
                filename=SimpleUploadedFile("test_inavlid1.png", b"file_content"),
                sampling="invalid sampling",    # sampling is a float
                dose=2.3,
                datetime_micro=datetime.now()
            )
    
    def test_create_micrograph_missing_requiredfield(self):
        # create micrograph with missing required field
        with self.assertRaises(Exception):
            Micrograph.objects.create(
            filename=SimpleUploadedFile("test_invalid2.jpg", b"file_content"),
            sampling=1.2,
            # dose will be missing
            datetime_micro=datetime.now()
            )

# CTF unit testing
class CTFModelTest(TestCase):
    @override_settings(MEDIA_ROOT=(TEST_DIR + '/media'))
    def setUp(self):
        # create micrograph object to use it with ctf testing 
        self.micrograph = Micrograph.objects.create(
            filename=SimpleUploadedFile("test_image4.jpeg", b"file_content"),
            sampling=1.2,
            dose=2.3,
            datetime_micro=datetime.now()
        )
    
    @override_settings(MEDIA_ROOT=(TEST_DIR + '/media'))
    def test_create_ctf_with_valid_data(self):
        # Create ctf object with valid data
        ctf = CTF.objects.create(
            micrograph=self.micrograph,
            defocusu=1.2,
            defocusv=3.4,
            datetime_ctf=datetime.now(),
            resolution=5.6,
            psd=SimpleUploadedFile("test_psd1.png", b"file_content")
        )
        self.assertEqual(ctf.defocusu, 1.2)
        self.assertEqual(ctf.defocusv, 3.4)
    
    def test_create_invalid_ctf(self):
        # invalid ctf data
        with self.assertRaises(ValueError):
            ctf = CTF.objects.create(
                micrograph=self.micrograph,
                defocusu="something wrong",
                defocusv=SimpleUploadedFile("test_defocusInvalid1.png", b"file_content"),   
                datetime_ctf=datetime.now(),
                resolution=5.6,
                psd=SimpleUploadedFile("test_psdInvalid2.png", b"file_content")
                
            )
        
    def test_create_ctf_without_micrograph(self):
        # try create CTF object without micrograph 
        with self.assertRaises(Exception):
            CTF.objects.create(
                defocusu=1.2,
                defocusv=3.4,
                datetime_ctf=datetime.now(),
                resolution=5.6,
                psd=SimpleUploadedFile("test_invalidCTF_no_micro.jpg", b"file_content")
            )
            
    def test_delete_micrograph_cascades_to_ctf(self):
        # Create CTF object associated to micrograph
        ctf = CTF.objects.create(
            micrograph=self.micrograph,
            defocusu=1.2,
            defocusv=3.4,
            datetime_ctf=datetime.now(),
            resolution=5.6,
            psd=SimpleUploadedFile("test_delete_micro.jpg", b"file_content")
        )
        
        # Delete micrograph and confirm it deletes ctf too
        self.micrograph.delete()
        with self.assertRaises(CTF.DoesNotExist):
            CTF.objects.get(id=ctf.id)

    def tearDownModule():
        print("\nDeleting temporary files...\n")
        try:
            shutil.rmtree(TEST_DIR)
        except OSError:
            pass