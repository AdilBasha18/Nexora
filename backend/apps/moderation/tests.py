from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from rest_framework.authtoken.models import Token
from accounts.models import User
from companies.models import Company, RecruiterProfile
from jobs.models import Job

class AdminAndRBACWorkflowTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Create Admin
        self.admin = User.objects.create_user(
            username='admin@nexora.io',
            email='admin@nexora.io',
            full_name='System Admin',
            password='AdminPassword123!',
            role=User.Role.ADMIN
        )
        self.admin_token, _ = Token.objects.get_or_create(user=self.admin)

        # Create Candidate
        self.candidate = User.objects.create_user(
            username='candidate@test.com',
            email='candidate@test.com',
            full_name='Alice Candidate',
            password='CandidatePass123!',
            role=User.Role.CANDIDATE
        )
        self.candidate_token, _ = Token.objects.get_or_create(user=self.candidate)

        # Create Company & Recruiter
        self.company = Company.objects.create(name='TechCorp Inc', website='https://techcorp.com')
        self.recruiter = User.objects.create_user(
            username='recruiter@techcorp.com',
            email='recruiter@techcorp.com',
            full_name='Bob Recruiter',
            password='RecruiterPass123!',
            role=User.Role.RECRUITER,
            recruiter_status=User.RecruiterStatus.PENDING
        )
        self.recruiter_profile = RecruiterProfile.objects.create(
            user=self.recruiter,
            company=self.company,
            job_title='Technical Recruiter'
        )
        self.recruiter_token, _ = Token.objects.get_or_create(user=self.recruiter)

    def test_unapproved_recruiter_cannot_post_job(self):
        # Recruiter is PENDING
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.recruiter_token.key}')
        payload = {
            "title": "Software Engineer",
            "description": "Develop high-scale backend services in Python.",
            "status": "PUBLISHED"
        }
        response = self.client.post(reverse('recruiter-job-list-create'), payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertIn("pending", response.data['error'].lower())

    def test_admin_approves_recruiter(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.admin_token.key}')
        url = reverse('admin-recruiter-action', kwargs={'pk': self.recruiter.id})
        response = self.client.post(url, {"action": "APPROVE"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.recruiter.refresh_from_db()
        self.assertEqual(self.recruiter.recruiter_status, User.RecruiterStatus.APPROVED)
        self.assertTrue(self.recruiter.is_verified_recruiter)

    def test_approved_recruiter_posts_job_enters_pending_review(self):
        # First approve recruiter
        self.recruiter.recruiter_status = User.RecruiterStatus.APPROVED
        self.recruiter.save()

        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.recruiter_token.key}')
        payload = {
            "title": "Senior Python Developer",
            "description": "Design and build Django APIs and microservices.",
            "required_skills": ["Python", "Django", "PostgreSQL"],
            "status": "PUBLISHED"
        }
        response = self.client.post(reverse('recruiter-job-list-create'), payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        job_id = response.data['id']

        # Enforces PENDING_REVIEW status
        job = Job.objects.get(id=job_id)
        self.assertEqual(job.status, Job.Status.PENDING_REVIEW)

        # Confirm job is NOT visible on public job board
        self.client.credentials()  # Unauthenticated public
        public_resp = self.client.get(reverse('job-list'))
        self.assertEqual(public_resp.status_code, status.HTTP_200_OK)
        job_ids = [j['id'] for j in public_resp.data.get('results', [])]
        self.assertNotIn(job_id, job_ids)

        # Candidate cannot view unapproved job detail directly
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.candidate_token.key}')
        detail_resp = self.client.get(reverse('job-detail', kwargs={'id': job_id}))
        self.assertEqual(detail_resp.status_code, status.HTTP_404_NOT_FOUND)

        # Admin approves job
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.admin_token.key}')
        act_url = reverse('admin-job-action', kwargs={'pk': job_id})
        approve_resp = self.client.post(act_url, {"action": "APPROVE"})
        self.assertEqual(approve_resp.status_code, status.HTTP_200_OK)

        job.refresh_from_db()
        self.assertEqual(job.status, Job.Status.APPROVED)

        # Now job is visible on public board
        self.client.credentials()
        public_resp2 = self.client.get(reverse('job-list'))
        job_ids2 = [j['id'] for j in public_resp2.data.get('results', [])]
        self.assertIn(job_id, job_ids2)

    def test_company_ownership_idor_protection(self):
        # Create another company
        other_company = Company.objects.create(name='OtherCorp', website='https://othercorp.com')

        # Recruiter attempts to modify another company
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.recruiter_token.key}')
        url = reverse('company-detail', kwargs={'id': other_company.id})
        response = self.client.patch(url, {"description": "Hacked description"})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_candidate_cannot_access_admin_portal_api(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.candidate_token.key}')
        response = self.client.get(reverse('admin-stats'))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_rejects_recruiter_with_reason(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.admin_token.key}')
        url = reverse('admin-recruiter-action', kwargs={'pk': self.recruiter.id})
        response = self.client.post(url, {
            "action": "REJECT",
            "reason": "Business registration could not be verified in official registry."
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.recruiter.refresh_from_db()
        self.assertEqual(self.recruiter.recruiter_status, User.RecruiterStatus.REJECTED)
        self.assertIn("official registry", self.recruiter.recruiter_rejection_reason)

    def test_suspended_user_cannot_login(self):
        self.candidate.is_suspended = True
        self.candidate.save()

        login_resp = self.client.post(reverse('login'), {
            "email": "candidate@test.com",
            "password": "CandidatePass123!"
        })
        self.assertEqual(login_resp.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("suspended", str(login_resp.data).lower())

    def test_recruiter_cannot_view_or_edit_another_recruiters_applications(self):
        # Create second recruiter and job
        comp2 = Company.objects.create(name='OtherTech')
        recruiter2 = User.objects.create_user(
            username='rec2@othertech.com', email='rec2@othertech.com',
            full_name='Other Recruiter', password='Pass123!',
            role=User.Role.RECRUITER, recruiter_status=User.RecruiterStatus.APPROVED
        )
        RecruiterProfile.objects.create(user=recruiter2, company=comp2)
        job2 = Job.objects.create(
            recruiter=recruiter2, company=comp2,
            title='DevOps Engineer', status=Job.Status.APPROVED
        )

        from applications.models import JobApplication
        app2 = JobApplication.objects.create(
            job=job2, candidate=self.candidate, status=JobApplication.Status.SUBMITTED
        )

        # First recruiter tries to PATCH second recruiter's application
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.recruiter_token.key}')
        patch_url = reverse('recruiter-application-update', kwargs={'pk': app2.id})
        resp = self.client.patch(patch_url, {"status": "SHORTLISTED"})
        self.assertEqual(resp.status_code, status.HTTP_404_NOT_FOUND)

    def test_job_significant_edit_triggers_reapproval(self):
        self.recruiter.recruiter_status = User.RecruiterStatus.APPROVED
        self.recruiter.save()

        job = Job.objects.create(
            recruiter=self.recruiter, company=self.company,
            title='Frontend Engineer', description='Original description',
            status=Job.Status.APPROVED
        )

        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.recruiter_token.key}')
        edit_url = reverse('recruiter-job-detail', kwargs={'id': job.id})
        resp = self.client.patch(edit_url, {
            "description": "Completely new description requiring moderation review."
        })
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

        job.refresh_from_db()
        self.assertEqual(job.status, Job.Status.PENDING_REVIEW)


