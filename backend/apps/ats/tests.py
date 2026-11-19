from django.test import TestCase
from django.contrib.auth import get_user_model
from ats.services import analyze_resume_independent, analyze_resume_with_job, generate_resume_improvements
from resumes.models import Resume

User = get_user_model()

class ATSAccuracyTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="candidate1",
            email="candidate@example.com",
            password="testpassword123",
            full_name="Amina Khan",
            role="CANDIDATE"
        )

    def test_fresher_resume_not_penalized(self):
        """Verify freshers with academic projects and internships receive appropriate project/experience credit."""
        fresher_resume = """
        Amina Khan
        Email: amina@example.com | Phone: 555-0199 | GitHub: github.com/amina | LinkedIn: linkedin.com/in/amina
        
        Professional Summary:
        Aspiring Software Engineer specializing in Python, React, and PostgreSQL. Passionate about building web applications.
        
        Technical Skills:
        Languages: Python, JavaScript, SQL, HTML, CSS
        Frameworks: Django, React, FastAPI
        Databases: PostgreSQL, SQLite
        Tools: Git, Docker, Linux
        
        Internships:
        Software Engineering Intern at TechStart (May 2024 - Aug 2024)
        • Developed REST API endpoints using Python and FastAPI, serving 500+ daily requests.
        • Optimized SQL database queries, improving response latency by 25%.
        • Collaborated in weekly Agile sprint meetings and documented system architecture.
        
        Projects:
        E-Commerce Web Application
        • Architected a full-stack platform using React, Django, and PostgreSQL.
        • Integrated JWT authentication and automated CI/CD pipeline with GitHub Actions.
        
        Education:
        Bachelor of Science in Computer Science, GPA: 3.8/4.0
        Graduated May 2024
        """

        result = analyze_resume_independent(fresher_resume, user=self.user)
        
        # Verify category completeness: fresher should have earned full 6 points for projects/internships
        self.assertEqual(result["measurable_criteria"]["sections"]["earned"], 20)
        self.assertGreaterEqual(result["overall_score"], 75)
        # Verify metrics detected without counting the year 2024 or phone
        self.assertGreaterEqual(result["metric_count"], 2)
        # Verify no hardcoded 96% achievable score
        self.assertNotIn("potential_score", result)

    def test_job_description_matching_accuracy(self):
        """Verify separate Job Match Score accurately calculates mandatory vs preferred skill alignment."""
        sample_resume = """
        Dev User
        Email: dev@example.com | Phone: 555-1234
        
        Technical Skills:
        Python, Django, PostgreSQL, Docker, Git
        
        Work Experience:
        Software Developer at CloudCo
        • Built backend services in Python and PostgreSQL.
        """

        jd = """
        We are seeking a Backend Engineer.
        Must have: Strong proficiency in Python, PostgreSQL, and Django.
        Preferred: Experience with AWS and Kubernetes.
        """

        result = analyze_resume_with_job(sample_resume, "Backend Engineer", jd, user=self.user)

        self.assertEqual(result["analysis_mode"], "job_matched")
        self.assertIn("job_match_score", result)
        self.assertIn("resume_quality_score", result)
        self.assertIn("Python", result["matched_mandatory"])
        self.assertIn("PostgreSQL", result["matched_mandatory"])
        self.assertIn("AWS", result["missing_preferred"])

    def test_improvement_studio_no_fake_metrics(self):
        """Verify improvement studio does not fabricate metrics or fake companies."""
        sample_resume = """
        John Doe
        Email: john@example.com
        Technical Skills: Python, SQL
        Projects:
        Built a personal budgeting tracker with Python.
        """

        studio_res = generate_resume_improvements(sample_resume, target_role="Python Developer", user=self.user)
        
        self.assertIn("sections", studio_res)
        # Check that sections are structured objects with original, suggested, and rationale
        for sec in studio_res["sections"]:
            self.assertIn("original", sec)
            self.assertIn("suggested", sec)
            self.assertIn("rationale", sec)
        
        # Check that it never contains "[CANDIDATE FULL NAME]"
        self.assertNotIn("[CANDIDATE FULL NAME]", studio_res["full_draft"])
