from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from accounts.models import User

class AccountsAuthTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_candidate_registration(self):
        payload = {
            "full_name": "Jordan Smith",
            "email": "jordan.smith@example.com",
            "password": "Password123!",
            "confirm_password": "Password123!"
        }
        response = self.client.post(reverse('register-candidate'), payload)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('token', response.data)
        self.assertEqual(response.data['user']['role'], 'CANDIDATE')
        self.assertTrue(User.objects.filter(email='jordan.smith@example.com').exists())

    def test_recruiter_registration(self):
        payload = {
            "full_name": "Taylor Reed",
            "email": "taylor@nova.com",
            "password": "Password123!",
            "confirm_password": "Password123!",
            "company_name": "Nova Systems",
            "job_title": "HR Lead"
        }
        response = self.client.post(reverse('register-recruiter'), payload)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('token', response.data)
        user = User.objects.get(email='taylor@nova.com')
        self.assertEqual(user.role, 'RECRUITER')
        self.assertFalse(user.is_verified_recruiter)

    def test_login(self):
        User.objects.create_user(
            username='sam@example.com',
            email='sam@example.com',
            full_name='Sam Test',
            password='ValidPassword123!',
            role=User.Role.CANDIDATE
        )
        response = self.client.post(reverse('login'), {
            "email": "sam@example.com",
            "password": "ValidPassword123!"
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('token', response.data)

