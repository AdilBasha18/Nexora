from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from accounts.models import User
from companies.models import Company, RecruiterProfile
from jobs.models import Job
from candidates.models import CandidateProfile
from matching.services import compute_job_match

class JobsAndMatchingTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.company = Company.objects.create(
            name="Quantum Systems",
            industry="Technology",
            is_verified=True
        )
        self.recruiter_user = User.objects.create_user(
            username="recruiter@quantum.com",
            email="recruiter@quantum.com",
            full_name="Sarah Recruiter",
            password="Password123!",
            role=User.Role.RECRUITER,
            is_verified_recruiter=True
        )
        RecruiterProfile.objects.create(
            user=self.recruiter_user,
            company=self.company,
            job_title="Lead Talent Partner"
        )
        self.candidate_user = User.objects.create_user(
            username="dev@example.com",
            email="dev@example.com",
            full_name="Jordan Developer",
            password="Password123!",
            role=User.Role.CANDIDATE
        )
        self.profile = CandidateProfile.objects.create(
            user=self.candidate_user,
            skills=["Python", "Django", "SQL", "React"],
            experience_years=3.0,
            preferred_work_mode="REMOTE"
        )
        self.job = Job.objects.create(
            recruiter=self.recruiter_user,
            company=self.company,
            title="Senior Python Engineer",
            description="Scale our Python backend APIs.",
            required_skills=["Python", "Django", "SQL"],
            preferred_skills=["Docker", "Redis"],
            min_experience_years=2.0,
            work_mode="REMOTE",
            status="PUBLISHED"
        )

    def test_job_listing_public_api(self):
        response = self.client.get(reverse('job-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data.get('results', response.data)
        self.assertGreaterEqual(len(results), 1)

    def test_job_match_calculation(self):
        match_data = compute_job_match(self.profile, None, self.job)
        self.assertGreaterEqual(match_data['match_score'], 70)
        self.assertIn("Python", match_data['matched_skills'])
        self.assertIn("Django", match_data['matched_skills'])
        self.assertTrue(len(match_data['reasons']) > 0)

