from django.test import TestCase
from ats.services import analyze_resume_ats

class ATSServiceTestCase(TestCase):
    def test_ats_analysis_calculation(self):
        sample_resume = """
        Alex Morgan
        Email: alex@example.com | Phone: 555-0192 | GitHub: github.com/alex
        Professional Summary:
        Experienced Full Stack Software Developer with expertise in building scalable web apps.
        Technical Skills:
        Python, Django, React, JavaScript, SQL, PostgreSQL, Git, REST API.
        Work Experience:
        Software Engineer at Acme Corp. Developed REST APIs and maintained frontend components.
        Education:
        B.S. in Computer Science.
        Projects:
        E-commerce backend service with PostgreSQL.
        """

        job_desc = """
        Looking for a Senior Python Developer with strong knowledge of Python, Django, SQL, PostgreSQL, and Git.
        Must have experience building robust REST APIs.
        """

        result = analyze_resume_ats(sample_resume, job_desc, "Python Developer")
        
        self.assertGreaterEqual(result['overall_score'], 50)
        self.assertIn('Python', result['matched_skills'])
        self.assertIn('Django', result['matched_skills'])
        self.assertTrue(result['section_analysis']['experience'])
        self.assertTrue(result['section_analysis']['skills'])
        self.assertIn('disclaimer', result)

