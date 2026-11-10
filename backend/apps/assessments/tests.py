from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from accounts.models import User
from assessments.models import AssessmentCategory, Assessment, Question

class AssessmentSubmissionTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="tester@example.com",
            email="tester@example.com",
            full_name="Quiz Tester",
            password="Password123!",
            role=User.Role.CANDIDATE
        )
        self.client.force_authenticate(user=self.user)
        self.category = AssessmentCategory.objects.create(name="Python")
        self.assessment = Assessment.objects.create(
            category=self.category,
            title="Python Basic Test",
            duration_minutes=10,
            passing_score=50
        )
        self.q1 = Question.objects.create(
            assessment=self.assessment,
            question_text="What is 2 + 2?",
            options=["3", "4", "5", "6"],
            correct_option_index=1,
            explanation="2 + 2 equals 4.",
            order=1
        )
        self.q2 = Question.objects.create(
            assessment=self.assessment,
            question_text="Is Python dynamic?",
            options=["Yes", "No"],
            correct_option_index=0,
            explanation="Python is dynamically typed.",
            order=2
        )

    def test_assessment_submission_and_scoring(self):
        payload = {
            "assessment_id": self.assessment.id,
            "answers": {
                str(self.q1.id): 1, # correct
                str(self.q2.id): 0  # correct
            }
        }
        response = self.client.post(reverse('assessment-submit'), payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['percentage'], 100)
        self.assertTrue(response.data['passed'])
        self.assertEqual(response.data['correct_answers'], 2)

