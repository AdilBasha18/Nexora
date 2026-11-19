import os
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token
from companies.models import Company, RecruiterProfile, CompanyVerification
from candidates.models import CandidateProfile
from jobs.models import Job, SavedJob
from assessments.models import AssessmentCategory, Assessment, Question, AssessmentAttempt
from career.models import TargetRole, CareerResource
from assistant.models import KnowledgeDocument, KnowledgeChunk
from assistant.rag_engine import chunk_text, tokenize
from notifications.models import Notification
from moderation.models import JobReport, AuditLog

User = get_user_model()

class Command(BaseCommand):
    help = "Seeds the Nexora database with realistic demo data, accounts, assessments, and RAG knowledge base."

    def handle(self, *args, **options):
        self.stdout.write("--- Starting Nexora Seed Data Population ---")

        # 1. Administrator Account
        admin_user, created = User.objects.get_or_create(
            email='admin@nexora.io',
            defaults={
                'username': 'admin@nexora.io',
                'full_name': 'Nexora Administrator',
                'role': User.Role.ADMIN,
                'is_staff': True,
                'is_superuser': True
            }
        )
        if created:
            admin_user.set_password('NexoraAdmin2026!')
            admin_user.save()
            Token.objects.get_or_create(user=admin_user)
            self.stdout.write(self.style.SUCCESS("Created Admin: admin@nexora.io / NexoraAdmin2026!"))

        # 2. Companies
        company_data = [
            {
                'name': 'CloudNova Technologies',
                'website': 'https://cloudnova.example.com',
                'industry': 'Cloud Infrastructure & Enterprise SaaS',
                'company_size': '201-500 employees',
                'location': 'San Francisco, CA (Remote Friendly)',
                'description': 'Building next-generation distributed cloud orchestration tools and developer platforms.',
                'is_verified': True
            },
            {
                'name': 'Vertex AI Labs',
                'website': 'https://vertexailabs.example.com',
                'industry': 'Artificial Intelligence & Machine Learning',
                'company_size': '51-200 employees',
                'location': 'New York, NY (Hybrid)',
                'description': 'Pioneering safe, specialized retrieval-augmented models and NLP enterprise applications.',
                'is_verified': True
            },
            {
                'name': 'Apex Data Systems',
                'website': 'https://apexdatasys.example.com',
                'industry': 'Fintech & High-Volume Data Analytics',
                'company_size': '500+ employees',
                'location': 'Austin, TX (Onsite/Hybrid)',
                'description': 'Modern real-time analytics for global institutional financial intelligence.',
                'is_verified': False
            },
            {
                'name': 'PulseHealth Digital',
                'website': 'https://pulsehealth.example.com',
                'industry': 'HealthTech & Telemedicine',
                'company_size': '11-50 employees',
                'location': 'Boston, MA (Remote)',
                'description': 'HIPAA-compliant patient engagement and tele-diagnostics software solutions.',
                'is_verified': True
            }
        ]

        companies = {}
        for c in company_data:
            comp, _ = Company.objects.get_or_create(name=c['name'], defaults=c)
            companies[c['name']] = comp

        # 3. Recruiters
        recruiter_user, created = User.objects.get_or_create(
            email='recruiter@cloudnova.io',
            defaults={
                'username': 'recruiter@cloudnova.io',
                'full_name': 'Sarah Jenkins',
                'role': User.Role.RECRUITER,
                'is_verified_recruiter': True
            }
        )
        if created:
            recruiter_user.set_password('Recruiter2026!')
            recruiter_user.save()
            Token.objects.get_or_create(user=recruiter_user)
            RecruiterProfile.objects.create(
                user=recruiter_user,
                company=companies['CloudNova Technologies'],
                job_title='Principal Technical Recruiter'
            )
            self.stdout.write(self.style.SUCCESS("Created Verified Recruiter: recruiter@cloudnova.io / Recruiter2026!"))

        # Recruiter 2 (Unverified pending review)
        unverified_recruiter, created = User.objects.get_or_create(
            email='hiring@apexsystems.com',
            defaults={
                'username': 'hiring@apexsystems.com',
                'full_name': 'Marcus Vance',
                'role': User.Role.RECRUITER,
                'is_verified_recruiter': False
            }
        )
        if created:
            unverified_recruiter.set_password('Recruiter2026!')
            unverified_recruiter.save()
            Token.objects.get_or_create(user=unverified_recruiter)
            RecruiterProfile.objects.create(
                user=unverified_recruiter,
                company=companies['Apex Data Systems'],
                job_title='Talent Acquisition Lead'
            )
            CompanyVerification.objects.get_or_create(
                company=companies['Apex Data Systems'],
                submitted_by=unverified_recruiter,
                defaults={
                    'business_reg_number': 'TAX-TX-88291039',
                    'official_domain_email': 'hiring@apexsystems.com',
                    'notes': 'Requested verification for corporate employer posting rights.'
                }
            )

        # 4. Candidates
        cand1, created = User.objects.get_or_create(
            email='alex.morgan@example.com',
            defaults={
                'username': 'alex.morgan@example.com',
                'full_name': 'Alex Morgan',
                'role': User.Role.CANDIDATE
            }
        )
        if created:
            cand1.set_password('Candidate2026!')
            cand1.save()
            Token.objects.get_or_create(user=cand1)
            CandidateProfile.objects.create(
                user=cand1,
                headline='Full Stack Engineer | Python, React, PostgreSQL & Cloud',
                phone='+1 (555) 234-5678',
                location='Seattle, WA (Open to Remote)',
                bio='Passionate software developer with 2.5 years experience building performant web platforms, REST APIs, and responsive frontends with React.',
                experience_years=2.5,
                experience_level='MID',
                target_role='Full Stack Software Engineer',
                preferred_work_mode='REMOTE',
                skills=['Python', 'Django', 'React', 'JavaScript', 'SQL', 'PostgreSQL', 'Git', 'REST API', 'Docker'],
                education=[{
                    'degree': 'B.S. in Computer Science',
                    'institution': 'University of Washington',
                    'year': '2023',
                    'score': '3.8 GPA'
                }],
                work_experience=[{
                    'title': 'Junior Software Engineer',
                    'company': 'Cascade Tech Labs',
                    'start': '2023-07',
                    'end': 'Present',
                    'description': 'Developed RESTful endpoints in Django and created dynamic dashboard modules with React & Tailwind.'
                }],
                projects=[{
                    'title': 'E-Commerce Microservice API',
                    'description': 'Built async payment & catalog service handling 5k req/min with PostgreSQL and Redis caching.',
                    'technologies': 'Python, Django, Redis, PostgreSQL',
                    'link': 'https://github.com/example/ecommerce-api'
                }],
                github_url='https://github.com/alexmorgan-dev',
                linkedin_url='https://linkedin.com/in/alexmorgan-dev'
            )
            self.stdout.write(self.style.SUCCESS("Created Demo Candidate: alex.morgan@example.com / Candidate2026!"))

        # 5. Realistic Job Postings
        jobs_seed = [
            {
                'title': 'Senior Full Stack Software Engineer',
                'company': companies['CloudNova Technologies'],
                'recruiter': recruiter_user,
                'description': 'We are looking for a skilled Senior Full Stack Engineer to scale our distributed cloud dashboard and internal orchestration APIs. You will collaborate closely with product and architecture teams.',
                'responsibilities': 'Architect and maintain high-throughput REST APIs in Python/Django.\nBuild intuitive, modular user interfaces using modern React and TypeScript.\nImplement robust unit and integration testing pipelines with GitHub Actions.\nOptimize database queries in PostgreSQL.',
                'required_skills': ['Python', 'Django', 'React', 'TypeScript', 'PostgreSQL', 'Git'],
                'preferred_skills': ['Docker', 'AWS', 'Redis', 'CI/CD'],
                'experience_level': Job.ExperienceLevel.SENIOR,
                'min_experience_years': 4.0,
                'employment_type': Job.EmploymentType.FULL_TIME,
                'work_mode': Job.WorkMode.REMOTE,
                'location': 'Remote (Global)',
                'salary_min': 10625000,
                'salary_max': 14025000,
                'salary_currency': 'INR',
                'is_verified': True,
                'status': Job.Status.PUBLISHED
            },
            {
                'title': 'Python Backend Developer',
                'company': companies['Vertex AI Labs'],
                'recruiter': recruiter_user,
                'description': 'Join our AI infrastructure team building microservices and data pipelines for large-scale retrieval systems. You will work on real-time vector embeddings, caching, and grounded knowledge retrieval.',
                'responsibilities': 'Design clean, well-tested Python backend services with Django and FastAPI.\nIntegrate vector databases and semantic indexing pipelines.\nParticipate in code reviews and mentor junior teammates.',
                'required_skills': ['Python', 'FastAPI', 'Django', 'SQL', 'REST API'],
                'preferred_skills': ['Docker', 'Redis', 'Machine Learning', 'RAG'],
                'experience_level': Job.ExperienceLevel.MID,
                'min_experience_years': 2.0,
                'employment_type': Job.EmploymentType.FULL_TIME,
                'work_mode': Job.WorkMode.HYBRID,
                'location': 'New York, NY',
                'salary_min': 8925000,
                'salary_max': 11900000,
                'salary_currency': 'INR',
                'is_verified': True,
                'status': Job.Status.PUBLISHED
            },
            {
                'title': 'Frontend Engineer (React / Tailwind)',
                'company': companies['PulseHealth Digital'],
                'recruiter': recruiter_user,
                'description': 'Help us build empathetic, accessible patient-facing web applications. You will craft responsive designs, accessible forms, and rich data visualizations.',
                'responsibilities': 'Build modern, accessible UI components in React and Tailwind CSS.\nIntegrate backend REST endpoints with reliable error handling and loading skeletons.\nEnsure compliance with WCAG 2.1 AA accessibility guidelines.',
                'required_skills': ['React', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind CSS'],
                'preferred_skills': ['TypeScript', 'Vite', 'Unit Testing', 'Figma'],
                'experience_level': Job.ExperienceLevel.ENTRY,
                'min_experience_years': 1.0,
                'employment_type': Job.EmploymentType.FULL_TIME,
                'work_mode': Job.WorkMode.REMOTE,
                'location': 'Remote',
                'salary_min': 6800000,
                'salary_max': 8925000,
                'salary_currency': 'INR',
                'is_verified': True,
                'status': Job.Status.PUBLISHED
            },
            {
                'title': 'Junior Data Analyst',
                'company': companies['Apex Data Systems'],
                'recruiter': unverified_recruiter,
                'description': 'Analyze customer journey data, generate SQL performance dashboards, and translate business requirements into actionable metrics.',
                'responsibilities': 'Write complex SQL queries across relational databases.\nPrepare data visualizations and weekly reporting packs using Python (Pandas).\nCollaborate with product managers on exploratory data queries.',
                'required_skills': ['SQL', 'Python', 'Pandas', 'Data Analysis'],
                'preferred_skills': ['NumPy', 'PostgreSQL', 'Communication', 'Excel'],
                'experience_level': Job.ExperienceLevel.ENTRY,
                'min_experience_years': 0.5,
                'employment_type': Job.EmploymentType.FULL_TIME,
                'work_mode': Job.WorkMode.ONSITE,
                'location': 'Austin, TX',
                'salary_min': 5780000,
                'salary_max': 7480000,
                'salary_currency': 'INR',
                'is_verified': False,
                'status': Job.Status.PUBLISHED
            },
            {
                'title': 'Cloud & DevOps Engineer',
                'company': companies['CloudNova Technologies'],
                'recruiter': recruiter_user,
                'description': 'Automate our multi-region Kubernetes clusters, build CI/CD deployment pipelines, and maintain high platform uptime.',
                'responsibilities': 'Manage AWS cloud infrastructure using Terraform and Infrastructure as Code.\nMaintain automated deployment pipelines with Docker and GitHub Actions.\nImplement telemetry, logging, and proactive security monitoring.',
                'required_skills': ['Docker', 'AWS', 'Linux', 'Git', 'CI/CD'],
                'preferred_skills': ['Kubernetes', 'Terraform', 'Python', 'Nginx'],
                'experience_level': Job.ExperienceLevel.MID,
                'min_experience_years': 2.5,
                'employment_type': Job.EmploymentType.FULL_TIME,
                'work_mode': Job.WorkMode.REMOTE,
                'location': 'Remote (Global)',
                'salary_min': 9775000,
                'salary_max': 12750000,
                'salary_currency': 'INR',
                'is_verified': True,
                'status': Job.Status.PUBLISHED
            },
            # Scam test listing to demonstrate Scam Shield warnings
            {
                'title': 'Data Entry Operator (Immediate $5000/week guaranteed)',
                'company': companies['Apex Data Systems'],
                'recruiter': unverified_recruiter,
                'description': 'Earn $5000 daily with no experience required! Work from home 1 hour a day. Please send your registration fee via crypto or telegram only for training equipment deposit.',
                'responsibilities': 'Copy paste data. Chat on telegram only for onboarding.',
                'required_skills': ['Communication'],
                'preferred_skills': [],
                'experience_level': Job.ExperienceLevel.ENTRY,
                'min_experience_years': 0.0,
                'employment_type': Job.EmploymentType.PART_TIME,
                'work_mode': Job.WorkMode.REMOTE,
                'location': 'Anywhere',
                'salary_min': 21250000,
                'salary_max': 25500000,
                'salary_currency': 'INR',
                'is_verified': False,
                'has_scam_warning': True,
                'scam_warning_reason': 'Job Scam Shield Notice: Mentions upfront application or training fees. Requests payment via cryptocurrency, gift cards, or wire transfers. Only allows unofficial messaging channels.',
                'status': Job.Status.PUBLISHED
            }
        ]

        for jd in jobs_seed:
            Job.objects.get_or_create(
                title=jd['title'],
                company=jd['company'],
                defaults=jd
            )

        # 6. Skill Assessments & Questions
        categories_data = [
            {'name': 'Python Fundamentals', 'icon_name': 'Code', 'description': 'Syntax, data structures, OOP, generators, and standard library.'},
            {'name': 'SQL & Databases', 'icon_name': 'Database', 'description': 'Relational queries, joins, indexes, aggregation, and schema normalization.'},
            {'name': 'Web Development (React & JavaScript)', 'icon_name': 'Globe', 'description': 'ES6+, DOM, React state/hooks, component lifecycle, and REST APIs.'},
            {'name': 'Logical Aptitude & Problem Solving', 'icon_name': 'Cpu', 'description': 'Data patterns, algorithmic logic, time complexity, and analytical reasoning.'},
            {'name': 'Data Analysis (Pandas & Statistics)', 'icon_name': 'BarChart3', 'description': 'DataFrames, group-by operations, missing data handling, and descriptive statistics.'}
        ]

        categories = {}
        for cat in categories_data:
            c, _ = AssessmentCategory.objects.get_or_create(name=cat['name'], defaults=cat)
            categories[cat['name']] = c

        assessments_data = [
            {
                'category': categories['Python Fundamentals'],
                'title': 'Python Core & OOP Proficiency',
                'description': 'Assess your knowledge of Python memory model, object-oriented principles, list comprehensions, and error handling.',
                'duration_minutes': 15,
                'passing_score': 70,
                'difficulty': Assessment.Difficulty.INTERMEDIATE,
                'questions': [
                    {
                        'question_text': 'What is the key difference between a Python list and a tuple?',
                        'options': ['Lists are immutable while tuples are mutable', 'Lists are mutable while tuples are immutable', 'Tuples can only store numbers', 'Lists have constant time search for arbitrary values'],
                        'correct_option_index': 1,
                        'explanation': 'Lists in Python are mutable sequences that can be modified in place. Tuples are immutable and cannot be altered once created.'
                    },
                    {
                        'question_text': 'What does the `__init__` method represent in Python classes?',
                        'options': ['The class constructor that allocates heap memory', 'The instance initializer method called after object creation', 'A static method used to register class properties', 'A destructor that runs during garbage collection'],
                        'correct_option_index': 1,
                        'explanation': '`__init__` acts as an initializer for newly created instance attributes and receives `self` as its first parameter.'
                    },
                    {
                        'question_text': 'What is the output of `[x**2 for x in range(4) if x % 2 == 0]`?',
                        'options': ['[0, 1, 4, 9]', '[0, 4]', '[1, 9]', '[0, 2, 4]'],
                        'correct_option_index': 1,
                        'explanation': 'range(4) produces 0, 1, 2, 3. The even numbers are 0 and 2. Squaring them yields 0 and 4.'
                    },
                    {
                        'question_text': 'What is a Python generator and how does it yield values?',
                        'options': ['A function that creates threads simultaneously', 'A function using `yield` that returns an iterator producing values lazily on demand', 'A compile-time decorator that optimizes bytecode', 'A built-in data type similar to a dictionary'],
                        'correct_option_index': 1,
                        'explanation': 'Generators produce sequence values on demand using `yield` without keeping the entire dataset in memory.'
                    },
                    {
                        'question_text': 'In Python, what is the Global Interpreter Lock (GIL)?',
                        'options': ['A security module preventing unauthorized socket access', 'A mutex that prevents multiple native threads from executing Python bytecodes simultaneously in CPython', 'A file locking mechanism for SQLite databases', 'A compiler flag for JIT execution'],
                        'correct_option_index': 1,
                        'explanation': 'In standard CPython, the GIL allows only one thread to hold control of the Python interpreter at a time.'
                    }
                ]
            },
            {
                'category': categories['SQL & Databases'],
                'title': 'SQL Querying & Relational Architecture',
                'description': 'Test your expertise in JOIN operations, GROUP BY clauses, subqueries, and indexing principles.',
                'duration_minutes': 15,
                'passing_score': 70,
                'difficulty': Assessment.Difficulty.INTERMEDIATE,
                'questions': [
                    {
                        'question_text': 'Which SQL JOIN returns all rows from the left table and matching rows from the right table?',
                        'options': ['INNER JOIN', 'FULL OUTER JOIN', 'LEFT JOIN (LEFT OUTER JOIN)', 'CROSS JOIN'],
                        'correct_option_index': 2,
                        'explanation': 'A LEFT JOIN returns all rows from the left table; unmatched rows on the right table return NULL.'
                    },
                    {
                        'question_text': 'What is the primary function of a database Index (e.g. B-tree index)?',
                        'options': ['To encrypt confidential table columns', 'To speed up data retrieval operations at the cost of additional storage and write overhead', 'To enforce foreign key cascade deletes', 'To automatically backup the database transaction log'],
                        'correct_option_index': 1,
                        'explanation': 'Indexes provide fast lookup paths for SELECT queries, with trade-offs in write performance and disk usage.'
                    },
                    {
                        'question_text': 'When using `GROUP BY`, which clause is used to filter aggregated group results?',
                        'options': ['WHERE', 'HAVING', 'FILTER BY', 'ORDER BY'],
                        'correct_option_index': 1,
                        'explanation': '`WHERE` filters individual rows before grouping, while `HAVING` filters aggregated grouped results (e.g., HAVING COUNT(*) > 5).'
                    },
                    {
                        'question_text': 'What is an ACID property in relational database transactions?',
                        'options': ['Asynchronous, Concurrent, Isolated, Distributed', 'Atomicity, Consistency, Isolation, Durability', 'Active, Cached, Indexed, Dynamic', 'Automatic, Continuous, Integrated, Deterministic'],
                        'correct_option_index': 1,
                        'explanation': 'ACID guarantees transaction reliability: Atomicity (all or nothing), Consistency, Isolation, and Durability.'
                    },
                    {
                        'question_text': 'What does `UNION ALL` do compared to `UNION`?',
                        'options': ['It sorts the results automatically', 'It combines result sets without removing duplicate rows, making it faster', 'It removes duplicates while UNION keeps them', 'It performs a Cartesian cross join'],
                        'correct_option_index': 1,
                        'explanation': '`UNION ALL` includes duplicates and avoids the costly sorting/deduplication step that `UNION` requires.'
                    }
                ]
            },
            {
                'category': categories['Web Development (React & JavaScript)'],
                'title': 'Modern React & JavaScript Fundamentals',
                'description': 'Assess modern ES6+, React Hooks (useState, useEffect, useMemo), virtual DOM, and component composition.',
                'duration_minutes': 15,
                'passing_score': 70,
                'difficulty': Assessment.Difficulty.INTERMEDIATE,
                'questions': [
                    {
                        'question_text': 'What is the purpose of the dependency array in `useEffect(callback, deps)`?',
                        'options': ['To list the CSS stylesheets the component needs', 'To specify which variable changes should trigger the effect to re-run', 'To import React npm packages dynamically', 'To dictate the render order among sibling components'],
                        'correct_option_index': 1,
                        'explanation': 'The dependency array tells React to skip running the effect if values in the array have not changed between renders.'
                    },
                    {
                        'question_text': 'Why is the `key` prop essential when rendering lists of elements in React?',
                        'options': ['It sets the CSS z-index of list items', 'It helps React identify which items have changed, been added, or removed during reconciliation', 'It encrypts element states in local storage', 'It binds keyboard navigation shortcuts to elements'],
                        'correct_option_index': 1,
                        'explanation': 'Keys provide a stable identity for virtual DOM nodes across renders, optimizing list reconciliation.'
                    },
                    {
                        'question_text': 'What is the output of `console.log(typeof NaN)` in JavaScript?',
                        'options': ['"undefined"', '"nan"', '"number"', '"object"'],
                        'correct_option_index': 2,
                        'explanation': 'In JavaScript IEEE-754 floating point standard, `NaN` stands for "Not-a-Number", but its data type is officially "number".'
                    },
                    {
                        'question_text': 'What does `React.memo` do for a functional component?',
                        'options': ['It automatically memoizes all internal component state', 'It prevents re-rendering if its props have not shallowly changed', 'It runs asynchronous API calls in background web workers', 'It caches the component HTML in browser service workers'],
                        'correct_option_index': 1,
                        'explanation': '`React.memo` is a higher order component that skips re-rendering if previous and next props are shallowly equal.'
                    },
                    {
                        'question_text': 'What is the purpose of the JavaScript Promise `Promise.all`?',
                        'options': ['It executes promises in sequential order one after another', 'It takes an iterable of promises and resolves when all have resolved, or rejects if any single promise rejects', 'It races promises and returns only the fastest one', 'It cancels pending network requests'],
                        'correct_option_index': 1,
                        'explanation': '`Promise.all` runs multiple asynchronous operations in parallel and resolves with an array of results when all succeed.'
                    }
                ]
            }
        ]

        for asm in assessments_data:
            assessment_obj, _ = Assessment.objects.get_or_create(
                category=asm['category'],
                title=asm['title'],
                defaults={
                    'description': asm['description'],
                    'duration_minutes': asm['duration_minutes'],
                    'passing_score': asm['passing_score'],
                    'difficulty': asm['difficulty']
                }
            )
            for idx, q_data in enumerate(asm['questions'], start=1):
                Question.objects.get_or_create(
                    assessment=assessment_obj,
                    question_text=q_data['question_text'],
                    defaults={
                        'options': q_data['options'],
                        'correct_option_index': q_data['correct_option_index'],
                        'explanation': q_data['explanation'],
                        'order': idx
                    }
                )

        # 7. Target Roles & Career Roadmaps
        roles_data = [
            {
                'title': 'Full Stack Software Engineer',
                'description': 'Builds end-to-end web applications combining scalable backend APIs with modern responsive user interfaces.',
                'market_demand': 'Very High',
                'average_salary': '₹12,00,000 - ₹24,00,000 per annum',
                'required_skills': ['Python', 'Django', 'React', 'JavaScript', 'SQL', 'Git', 'REST API'],
                'preferred_skills': ['Docker', 'PostgreSQL', 'TypeScript', 'Tailwind CSS', 'AWS']
            },
            {
                'title': 'Python Backend Developer',
                'description': 'Specializes in high-performance server architectures, database optimization, caching, and secure API gateways.',
                'market_demand': 'High',
                'average_salary': '₹14,00,000 - ₹26,00,000 per annum',
                'required_skills': ['Python', 'Django', 'FastAPI', 'SQL', 'REST API', 'Git'],
                'preferred_skills': ['PostgreSQL', 'Docker', 'Redis', 'Microservices', 'Linux']
            },
            {
                'title': 'Frontend Web Engineer',
                'description': 'Focuses on responsive client experiences, web performance, component architecture, and UI/UX accessibility.',
                'market_demand': 'High',
                'average_salary': '₹10,00,000 - ₹20,00,000 per annum',
                'required_skills': ['React', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind CSS', 'Git'],
                'preferred_skills': ['TypeScript', 'Next.js', 'Vite', 'Redux', 'Unit Testing']
            },
            {
                'title': 'Data Analyst',
                'description': 'Extracts insights from structured datasets, creates dashboard metrics, and supports data-informed product decisions.',
                'market_demand': 'Steady',
                'average_salary': '₹6,00,000 - ₹12,00,000 per annum',
                'required_skills': ['SQL', 'Python', 'Pandas', 'Data Analysis', 'Problem Solving'],
                'preferred_skills': ['NumPy', 'Data Visualization', 'PostgreSQL', 'Statistics']
            }
        ]

        for rd in roles_data:
            TargetRole.objects.get_or_create(title=rd['title'], defaults=rd)

        # 8. Career Resources
        resources_data = [
            {
                'title': 'Mastering the ATS: How Modern Candidate Parsing Works',
                'category': CareerResource.Category.RESUME,
                'description': 'Learn how applicant tracking systems read section headings, parse skill keywords, and avoid formatting traps.',
                'url': 'https://nexora.io/guides/ats-optimization',
                'reading_time': '6 min read',
                'is_free': True
            },
            {
                'title': 'The STAR Method for Behavioral Software Interviews',
                'category': CareerResource.Category.INTERVIEW,
                'description': 'How to structure answers about teamwork, conflict, technical failures, and deadlines using Situation, Task, Action, Result.',
                'url': 'https://nexora.io/guides/star-interview-method',
                'reading_time': '5 min read',
                'is_free': True
            },
            {
                'title': 'System Design Fundamentals: Caching, Load Balancing & Sharding',
                'category': CareerResource.Category.SKILLS,
                'description': 'Core architectural principles for scaling applications from 1,000 to 1,000,000 concurrent users.',
                'url': 'https://nexora.io/guides/system-design-basics',
                'reading_time': '10 min read',
                'is_free': True
            },
            {
                'title': 'Junior to Mid-Level Software Engineer Career Roadmap',
                'category': CareerResource.Category.CAREER_PATH,
                'description': 'Practical milestones to transition from guided contributor to autonomous developer delivering production systems.',
                'url': 'https://nexora.io/guides/engineering-ladder',
                'reading_time': '7 min read',
                'is_free': True
            }
        ]

        for res in resources_data:
            CareerResource.objects.get_or_create(title=res['title'], defaults=res)

        # 9. RAG Knowledge Documents & Automated Chunking
        knowledge_docs = [
            {
                'title': 'ATS Resume Optimization Principles',
                'category': KnowledgeDocument.Category.RESUME,
                'source': 'Nexora Career Engineering Standards (2026)',
                'content': (
                    "Applicant Tracking Systems (ATS) are software applications that organize and filter job applications. "
                    "To optimize your resume for ATS parsers: First, maintain a clean single-column or standard layout. Avoid complex tables, "
                    "text boxes, and icons inside headers or footers, as older parsers cannot extract them.\n\n"
                    "Second, use recognized section headings: 'Professional Summary', 'Work Experience', 'Education', 'Technical Skills', "
                    "and 'Projects'. Parsers scan specifically for these labels.\n\n"
                    "Third, reflect exact keywords from the job description naturally in your bullet points. If a job listing specifically asks for 'Django REST Framework', "
                    "writing only 'Python backend' may reduce your automated keyword match percentage.\n\n"
                    "Fourth, describe accomplishments with quantifiable impact: include metrics such as 'reduced query response latency by 35%' "
                    "or 'built automated testing suite increasing coverage to 85%'."
                )
            },
            {
                'title': 'Technical Coding & Architecture Interview Strategy',
                'category': KnowledgeDocument.Category.INTERVIEW,
                'source': 'Nexora Engineering Interview Playbook',
                'content': (
                    "When solving coding problems during technical interviews, follow a structured problem-solving approach:\n\n"
                    "1. Clarify constraints: Always ask about input sizes, edge cases (empty arrays, negative numbers, duplicates), "
                    "and expected time or space complexity constraints before writing any code.\n\n"
                    "2. Communicate thought process aloud: Interviewers evaluate your reasoning and how you navigate trade-offs, "
                    "not just immediate memorized syntax.\n\n"
                    "3. Start with a working brute-force solution: State the brute force complexity (e.g. O(N^2) with nested loops), "
                    "then identify bottlenecks and propose an optimized approach (e.g. O(N) using a hash map or two-pointer technique).\n\n"
                    "4. Test your solution: Walk through an example test case line by line before telling the interviewer you are finished."
                )
            },
            {
                'title': 'Full-Stack Web Architecture & Performance Best Practices',
                'category': KnowledgeDocument.Category.SYSTEM_DESIGN,
                'source': 'Nexora Distributed Architecture Handbook',
                'content': (
                    "Modern full-stack web applications separate presentation from domain services using REST or GraphQL APIs. "
                    "Key best practices include:\n\n"
                    "Database Optimization: Avoid the N+1 query problem by using ORM prefetching (such as select_related and prefetch_related in Django). "
                    "Always create database indexes on foreign keys and columns frequently used in WHERE filters.\n\n"
                    "Frontend Performance: Implement code-splitting and lazy-loading for non-critical route bundles. "
                    "Keep state close to where it is used to avoid unnecessary virtual DOM re-renders.\n\n"
                    "Security & Authentication: Never store sensitive credentials in client-side code. Use token or session-based authentication "
                    "with CSRF tokens and sanitized input validation to prevent SQL injection and cross-site scripting."
                )
            },
            {
                'title': 'Salary Negotiation and Offer Evaluation Framework',
                'category': KnowledgeDocument.Category.GENERAL,
                'source': 'Nexora Professional Development Council',
                'content': (
                    "When evaluating a job offer, assess Total Compensation (TC) rather than base salary alone. "
                    "Total compensation consists of: Base Salary, Annual Performance Bonus, Equity or Stock Grants, "
                    "Health and Retirement Benefits (401k match), and Paid Time Off.\n\n"
                    "During initial recruiter screenings, aim to provide an informed salary range based on verified market data "
                    "rather than locking in a single fixed number. Emphasize that your priority is mutual fit and overall compensation package value.\n\n"
                    "When negotiating an offer: Always express gratitude and genuine excitement for the team. "
                    "Request 24-48 hours to review the complete offer in writing before accepting, and counter with clear market data and demonstrated skills."
                )
            }
        ]

        for doc_data in knowledge_docs:
            doc, _ = KnowledgeDocument.objects.get_or_create(
                title=doc_data['title'],
                defaults={
                    'category': doc_data['category'],
                    'source': doc_data['source'],
                    'content': doc_data['content']
                }
            )
            # Generate chunks
            chunks = chunk_text(doc.content, chunk_size=350, overlap=50)
            for i, chunk_str in enumerate(chunks):
                KnowledgeChunk.objects.get_or_create(
                    document=doc,
                    chunk_index=i,
                    defaults={
                        'chunk_text': chunk_str,
                        'keywords': tokenize(chunk_str)[:15]
                    }
                )

        # 10. Audit Log Initial Entry
        AuditLog.objects.create(
            actor=admin_user,
            action='DATABASE_SEEDED',
            target_type='System',
            details='Initial sample companies, jobs, assessments, and RAG documents seeded successfully.'
        )

        self.stdout.write(self.style.SUCCESS("--- Nexora Seed Data Successfully Created ---"))

