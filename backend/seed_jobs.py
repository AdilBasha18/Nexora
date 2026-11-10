import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from accounts.models import User
from companies.models import Company
from jobs.models import Job

recruiter = User.objects.filter(role='RECRUITER').first()
if not recruiter:
    recruiter = User.objects.create_user(
        email='recruiter@nexora.io',
        password='Recruiter2026!',
        role='RECRUITER',
        full_name='Nexora Hiring Team'
    )

# Ensure verified companies
companies = {
    "CloudNova": Company.objects.get_or_create(
        name="CloudNova Technologies",
        defaults={
            "description": "Cloud native enterprise SaaS solutions and distributed data systems.",
            "website": "https://cloudnova.io",
            "industry": "Cloud Computing",
            "size": "201-500",
            "location": "San Francisco, CA",
            "is_verified": True
        }
    )[0],
    "Vertex": Company.objects.get_or_create(
        name="Vertex AI Labs",
        defaults={
            "description": "Next-generation generative AI, NLP foundations, and computer vision research.",
            "website": "https://vertexai.io",
            "industry": "Artificial Intelligence",
            "size": "51-200",
            "location": "Seattle, WA",
            "is_verified": True
        }
    )[0],
    "PulseHealth": Company.objects.get_or_create(
        name="PulseHealth Digital",
        defaults={
            "description": "HIPAA-compliant digital therapeutics and telemedicine platform.",
            "website": "https://pulsehealth.com",
            "industry": "Healthcare Technology",
            "size": "500-1000",
            "location": "Boston, MA",
            "is_verified": True
        }
    )[0],
    "ElevateFin": Company.objects.get_or_create(
        name="Elevate Financial Systems",
        defaults={
            "description": "High-throughput real-time payment reconciliation and wealth management APIs.",
            "website": "https://elevatefin.com",
            "industry": "FinTech",
            "size": "201-500",
            "location": "New York, NY",
            "is_verified": True
        }
    )[0],
    "OpenScale": Company.objects.get_or_create(
        name="OpenScale Cloud Infrastructure",
        defaults={
            "description": "Kubernetes automation, multi-cloud observability, and edge computing networks.",
            "website": "https://openscale.dev",
            "industry": "DevOps & Infrastructure",
            "size": "51-200",
            "location": "Austin, TX",
            "is_verified": True
        }
    )[0],
    "QuantumSec": Company.objects.get_or_create(
        name="Quantum Security Labs",
        defaults={
            "description": "Defensive cybersecurity, threat intelligence, and zero-trust identity management.",
            "website": "https://quantumsec.io",
            "industry": "Cybersecurity",
            "size": "51-200",
            "location": "Washington, DC",
            "is_verified": True
        }
    )[0],
}

# Ensure all companies are verified
for c in companies.values():
    if not c.is_verified:
        c.is_verified = True
        c.save()

# Comprehensive real fresher, internship, and entry-level positions
new_jobs = [
    {
        "company": companies["CloudNova"],
        "title": "Graduate Python Backend Developer (Fresher 2026)",
        "description": "We are seeking enthusiastic 2025/2026 graduates to join our backend engineering team. You will build REST APIs with Python, Django, and FastAPI, integrate PostgreSQL databases, and write automated tests.",
        "responsibilities": "- Develop scalable REST endpoints for cloud platform services\n- Write clean, PEP8-compliant Python code with unit and integration tests\n- Optimize PostgreSQL queries and assist in schema migrations\n- Participate in agile sprints and collaborative code reviews",
        "required_skills": ["Python", "Django", "SQL", "Git", "REST APIs"],
        "preferred_skills": ["Docker", "PostgreSQL", "FastAPI"],
        "experience_level": Job.ExperienceLevel.ENTRY,
        "min_experience_years": 0.0,
        "employment_type": Job.EmploymentType.FULL_TIME,
        "work_mode": Job.WorkMode.REMOTE,
        "location": "Remote (US / Global)",
        "salary_min": 75000,
        "salary_max": 95000,
        "is_verified": True,
        "status": Job.Status.PUBLISHED
    },
    {
        "company": companies["CloudNova"],
        "title": "Junior Full Stack Engineer",
        "description": "Join our product squad building customer-facing dashboard features. Work across modern React frontends and Python/Node backend microservices.",
        "responsibilities": "- Implement responsive UI components using React and Tailwind CSS\n- Connect frontend state to RESTful microservices\n- Debug end-to-end issues across browser and server layers",
        "required_skills": ["React", "JavaScript", "TypeScript", "Python", "HTML/CSS"],
        "preferred_skills": ["Tailwind CSS", "Next.js", "Docker"],
        "experience_level": Job.ExperienceLevel.ENTRY,
        "min_experience_years": 0.5,
        "employment_type": Job.EmploymentType.FULL_TIME,
        "work_mode": Job.WorkMode.HYBRID,
        "location": "San Francisco, CA",
        "salary_min": 85000,
        "salary_max": 110000,
        "is_verified": True,
        "status": Job.Status.PUBLISHED
    },
    {
        "company": companies["Vertex"],
        "title": "AI & Machine Learning Engineering Intern (Summer / Fall)",
        "description": "Vertex AI Labs is hiring interns passionate about deep learning, RAG pipelines, and transformer models. Work side-by-side with research engineers deploying foundation models.",
        "responsibilities": "- Benchmark retrieval accuracy across vector databases (ChromaDB / Pinecone)\n- Implement PyTorch evaluation routines for text generation\n- Build demo interfaces using React and FastAPI for model exploration",
        "required_skills": ["Python", "PyTorch", "Machine Learning", "Data Structures"],
        "preferred_skills": ["Hugging Face", "LangChain", "Vector Databases", "Docker"],
        "experience_level": Job.ExperienceLevel.ENTRY,
        "min_experience_years": 0.0,
        "employment_type": Job.EmploymentType.INTERNSHIP,
        "work_mode": Job.WorkMode.REMOTE,
        "location": "Remote",
        "salary_min": 50000,
        "salary_max": 70000,
        "is_verified": True,
        "status": Job.Status.PUBLISHED
    },
    {
        "company": companies["Vertex"],
        "title": "Entry-Level Machine Learning Engineer",
        "description": "Translate prototype ML algorithms into production-ready inference endpoints. Work on dataset curation, feature engineering, and model deployment.",
        "responsibilities": "- Train and tune predictive models using Scikit-Learn and XGBoost\n- Containerize inference services with Docker and FastAPI\n- Monitor model drift and latency in production pipelines",
        "required_skills": ["Python", "Machine Learning", "Scikit-Learn", "Docker", "SQL"],
        "preferred_skills": ["MLflow", "FastAPI", "Pandas", "Kubernetes"],
        "experience_level": Job.ExperienceLevel.ENTRY,
        "min_experience_years": 0.0,
        "employment_type": Job.EmploymentType.FULL_TIME,
        "work_mode": Job.WorkMode.HYBRID,
        "location": "Seattle, WA",
        "salary_min": 95000,
        "salary_max": 125000,
        "is_verified": True,
        "status": Job.Status.PUBLISHED
    },
    {
        "company": companies["ElevateFin"],
        "title": "Associate Data Analyst (Entry Level / Freshers Welcome)",
        "description": "Elevate Financial is looking for a data-driven analyst to turn raw transactional data into actionable operational insights, KPIs, and executive reporting dashboards.",
        "responsibilities": "- Write complex SQL queries, window functions, and CTEs to extract cohort metrics\n- Design and maintain interactive dashboards in Power BI and Tableau\n- Clean and manipulate large data sets with Python Pandas\n- Present monthly metrics reports to product and finance leaders",
        "required_skills": ["SQL", "Excel", "Data Analysis", "Power BI"],
        "preferred_skills": ["Python", "Pandas", "Tableau", "Statistics"],
        "experience_level": Job.ExperienceLevel.ENTRY,
        "min_experience_years": 0.0,
        "employment_type": Job.EmploymentType.FULL_TIME,
        "work_mode": Job.WorkMode.HYBRID,
        "location": "New York, NY",
        "salary_min": 72000,
        "salary_max": 90000,
        "is_verified": True,
        "status": Job.Status.PUBLISHED
    },
    {
        "company": companies["ElevateFin"],
        "title": "Junior Java & Spring Boot Software Engineer",
        "description": "Join our core payments processing team. Learn and contribute to distributed Java microservices handling tens of thousands of transactions per second.",
        "responsibilities": "- Write robust Java 21 code using Spring Boot and Spring Data JPA\n- Design relational tables and optimize Hibernate queries on PostgreSQL\n- Write comprehensive JUnit and Mockito unit tests\n- Assist in Kafka event streaming producer and consumer development",
        "required_skills": ["Java", "Spring Boot", "SQL", "OOP", "Git"],
        "preferred_skills": ["PostgreSQL", "Kafka", "Docker", "REST APIs"],
        "experience_level": Job.ExperienceLevel.ENTRY,
        "min_experience_years": 0.0,
        "employment_type": Job.EmploymentType.FULL_TIME,
        "work_mode": Job.WorkMode.ONSITE,
        "location": "New York, NY",
        "salary_min": 85000,
        "salary_max": 110000,
        "is_verified": True,
        "status": Job.Status.PUBLISHED
    },
    {
        "company": companies["OpenScale"],
        "title": "Cloud Operations & Junior DevOps Engineer",
        "description": "Are you passionate about Linux, CI/CD automation, and cloud infrastructure? OpenScale is hiring an entry-level DevOps engineer to maintain deployment automation and infrastructure as code.",
        "responsibilities": "- Maintain GitHub Actions continuous integration and continuous delivery workflows\n- Write Terraform manifests for AWS resources (VPC, S3, IAM, ECS)\n- Monitor system health and latency using Prometheus and Grafana\n- Assist engineering teams with Docker containerization best practices",
        "required_skills": ["Linux", "Docker", "Git", "CI/CD", "AWS"],
        "preferred_skills": ["Terraform", "Kubernetes", "Bash", "Python"],
        "experience_level": Job.ExperienceLevel.ENTRY,
        "min_experience_years": 0.0,
        "employment_type": Job.EmploymentType.FULL_TIME,
        "work_mode": Job.WorkMode.REMOTE,
        "location": "Austin, TX / Remote",
        "salary_min": 80000,
        "salary_max": 105000,
        "is_verified": True,
        "status": Job.Status.PUBLISHED
    },
    {
        "company": companies["PulseHealth"],
        "title": "Associate QA & Test Automation Engineer (Fresher)",
        "description": "PulseHealth is looking for a detail-oriented associate QA engineer to ensure the highest reliability and security of healthcare software. Learn modern automation with Playwright and Python.",
        "responsibilities": "- Author detailed test scenarios, test cases, and bug reports in Jira\n- Build and maintain automated web tests with Playwright and PyTest\n- Perform manual exploratory testing on newly developed healthcare workflows\n- Execute REST API regression test suites using Postman and Newman",
        "required_skills": ["Manual Testing", "Test Cases", "Python", "SQL", "Git"],
        "preferred_skills": ["Selenium", "Playwright", "API Testing", "Postman"],
        "experience_level": Job.ExperienceLevel.ENTRY,
        "min_experience_years": 0.0,
        "employment_type": Job.EmploymentType.FULL_TIME,
        "work_mode": Job.WorkMode.HYBRID,
        "location": "Boston, MA",
        "salary_min": 68000,
        "salary_max": 85000,
        "is_verified": True,
        "status": Job.Status.PUBLISHED
    },
    {
        "company": companies["QuantumSec"],
        "title": "Junior Cybersecurity Analyst / SOC Tier 1",
        "description": "Protect critical infrastructure as a frontline security operations analyst. Analyze telemetry, investigate alerts, and assist with vulnerability remediation.",
        "responsibilities": "- Monitor SIEM alerts and triage suspicious security events\n- Perform vulnerability scans using Nmap, Nessus, and OpenVAS\n- Assist with phishing simulation analysis and user security awareness\n- Document incident reports and collaborate with senior IR engineers",
        "required_skills": ["Cybersecurity", "Networking", "Linux", "OWASP"],
        "preferred_skills": ["SIEM", "Splunk", "Python", "Wireshark"],
        "experience_level": Job.ExperienceLevel.ENTRY,
        "min_experience_years": 0.0,
        "employment_type": Job.EmploymentType.FULL_TIME,
        "work_mode": Job.WorkMode.REMOTE,
        "location": "Washington, DC / Remote",
        "salary_min": 78000,
        "salary_max": 96000,
        "is_verified": True,
        "status": Job.Status.PUBLISHED
    },
    {
        "company": companies["PulseHealth"],
        "title": "Junior Frontend Web Developer (React / JavaScript)",
        "description": "Join our patient experience design team. Develop responsive, accessible, pixel-perfect web interfaces that patients and clinicians love using daily.",
        "responsibilities": "- Build modular React components with TypeScript and Tailwind CSS\n- Ensure WCAG 2.1 AA accessibility compliance across mobile and desktop\n- Integrate frontend forms with REST APIs and handle error boundaries gracefully\n- Write Jest and React Testing Library unit tests for UI components",
        "required_skills": ["JavaScript", "React", "HTML/CSS", "Git"],
        "preferred_skills": ["TypeScript", "Tailwind CSS", "Next.js", "Jest"],
        "experience_level": Job.ExperienceLevel.ENTRY,
        "min_experience_years": 0.0,
        "employment_type": Job.EmploymentType.FULL_TIME,
        "work_mode": Job.WorkMode.REMOTE,
        "location": "Remote",
        "salary_min": 75000,
        "salary_max": 92000,
        "is_verified": True,
        "status": Job.Status.PUBLISHED
    },
    {
        "company": companies["CloudNova"],
        "title": "Software Engineering Intern - Data Pipelines (Fall 2026)",
        "description": "Exciting internship opportunity for university students and bootcamp grads. Assist our data platform team building real-time data ingestion pipelines with Python and SQL.",
        "responsibilities": "- Write Python ETL scripts to ingest JSON feeds into data warehouse staging tables\n- Validate data quality and generate automated pipeline alerts\n- Participate in weekly engineering design reviews and mentorship sessions",
        "required_skills": ["Python", "SQL", "Problem Solving", "Git"],
        "preferred_skills": ["Pandas", "Apache Spark", "Docker", "PostgreSQL"],
        "experience_level": Job.ExperienceLevel.ENTRY,
        "min_experience_years": 0.0,
        "employment_type": Job.EmploymentType.INTERNSHIP,
        "work_mode": Job.WorkMode.REMOTE,
        "location": "Remote",
        "salary_min": 48000,
        "salary_max": 65000,
        "is_verified": True,
        "status": Job.Status.PUBLISHED
    },
    {
        "company": companies["OpenScale"],
        "title": "Junior Mobile Developer (React Native / Flutter)",
        "description": "Build cross-platform mobile apps for iOS and Android. Work with state management, offline sync, and native device feature integrations.",
        "responsibilities": "- Develop cross-platform mobile screens using React Native / Flutter\n- Integrate mobile push notifications and authentication flows\n- Collaborate with UI/UX designers to implement intuitive gesture interactions",
        "required_skills": ["React Native", "JavaScript", "Mobile Development", "Git"],
        "preferred_skills": ["Flutter", "TypeScript", "iOS", "Android"],
        "experience_level": Job.ExperienceLevel.ENTRY,
        "min_experience_years": 0.0,
        "employment_type": Job.EmploymentType.FULL_TIME,
        "work_mode": Job.WorkMode.HYBRID,
        "location": "Austin, TX",
        "salary_min": 78000,
        "salary_max": 98000,
        "is_verified": True,
        "status": Job.Status.PUBLISHED
    }
]

created_count = 0
for job_info in new_jobs:
    existing = Job.objects.filter(title=job_info["title"], company=job_info["company"]).first()
    if not existing:
        Job.objects.create(
            recruiter=recruiter,
            company=job_info["company"],
            title=job_info["title"],
            description=job_info["description"],
            responsibilities=job_info.get("responsibilities", ""),
            required_skills=job_info["required_skills"],
            preferred_skills=job_info.get("preferred_skills", []),
            experience_level=job_info["experience_level"],
            min_experience_years=job_info["min_experience_years"],
            employment_type=job_info["employment_type"],
            work_mode=job_info["work_mode"],
            location=job_info["location"],
            salary_min=job_info["salary_min"],
            salary_max=job_info["salary_max"],
            is_verified=job_info["is_verified"],
            status=job_info["status"]
        )
        created_count += 1

print(f"Successfully created {created_count} new verified fresher/internship jobs.")
print(f"Total jobs in system: {Job.objects.count()}")
