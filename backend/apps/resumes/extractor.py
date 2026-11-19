import os
import re
from io import BytesIO

# Comprehensive Categorized Technical & Professional Skills Dictionary (250+ skills)
SKILL_TAXONOMY = {
    "Programming Languages": [
        "Python", "JavaScript", "TypeScript", "Java", "C++", "C#", "C", "Go", "Golang", "Rust", 
        "Ruby", "PHP", "Swift", "Kotlin", "Dart", "R", "Scala", "Shell", "Bash", "PowerShell", 
        "SQL", "Perl", "Haskell", "Lua", "MATLAB", "HTML", "HTML5", "CSS", "CSS3"
    ],
    "Frontend Frameworks & Web": [
        "React", "React.js", "Vue", "Vue.js", "Angular", "Next.js", "Nuxt.js", "Svelte", 
        "Tailwind CSS", "Bootstrap", "Sass", "SCSS", "Redux", "Zustand", "Webpack", "Vite", 
        "jQuery", "Material UI", "Shadcn", "Responsive Design", "WebSockets"
    ],
    "Backend & APIs": [
        "Django", "Django REST Framework", "DRF", "FastAPI", "Flask", "Node.js", "Express.js", 
        "Spring Boot", "Spring", "ASP.NET", ".NET", "Ruby on Rails", "Laravel", "NestJS", 
        "GraphQL", "REST API", "gRPC", "Microservices", "Celery", "Kafka", "RabbitMQ"
    ],
    "Databases & Caching": [
        "PostgreSQL", "Postgres", "MySQL", "SQLite", "MongoDB", "Redis", "Elasticsearch", 
        "Firebase", "Cassandra", "DynamoDB", "Oracle", "Supabase", "Prisma", "SQLAlchemy", 
        "Neo4j", "CouchDB", "MariaDB", "Snowflake", "BigQuery"
    ],
    "Cloud & DevOps": [
        "AWS", "Amazon Web Services", "Azure", "Microsoft Azure", "Google Cloud", "GCP", 
        "Docker", "Kubernetes", "K8s", "Git", "GitHub", "GitLab", "CI/CD", "Terraform", 
        "Linux", "Nginx", "Jenkins", "Ansible", "Helm", "Cloudflare", "Serverless", 
        "Prometheus", "Grafana", "Datadog"
    ],
    "Data Science, AI & ML": [
        "Machine Learning", "Deep Learning", "Artificial Intelligence", "TensorFlow", "PyTorch", 
        "Scikit-Learn", "NLP", "Natural Language Processing", "Computer Vision", "OpenCV", 
        "Pandas", "NumPy", "SciPy", "Matplotlib", "Seaborn", "Data Analysis", "LLM", 
        "Large Language Models", "RAG", "LangChain", "Hugging Face", "Tableau", "Power BI"
    ],
    "Testing & Quality Assurance": [
        "Unit Testing", "TDD", "Test Driven Development", "PyTest", "Jest", "Mocha", 
        "Cypress", "Selenium", "Postman", "JUnit", "Playwright", "Debugging"
    ],
    "Architecture, Methodology & Soft Skills": [
        "Agile", "Scrum", "System Design", "Object-Oriented Programming", "OOP", 
        "Design Patterns", "Problem Solving", "Collaboration", "Communication", 
        "Project Management", "Git Workflow", "Code Review"
    ]
}

# Flatten for quick lookup
TECH_SKILLS = sorted(list(set(skill for cat in SKILL_TAXONOMY.values() for skill in cat)))

# Standard section header regex patterns
SECTION_HEADER_PATTERNS = {
    "summary": [
        r'^\s*(?:professional\s+)?summary\b',
        r'^\s*(?:career\s+)?objective\b',
        r'^\s*about\s+me\b',
        r'^\s*profile\s*(?:summary)?\b',
        r'^\s*executive\s+summary\b'
    ],
    "skills": [
        r'^\s*(?:technical\s+|core\s+|key\s+)?skills\b',
        r'^\s*technologies\s*(?:&\s*tools)?\b',
        r'^\s*technical\s+proficiencies\b',
        r'^\s*tools\s*(?:&|\+)?\s*frameworks\b',
        r'^\s*competencies\b'
    ],
    "experience": [
        r'^\s*(?:professional\s+|work\s+)?experience\b',
        r'^\s*employment\s+history\b',
        r'^\s*work\s+history\b'
    ],
    "internships": [
        r'^\s*internships?\b',
        r'^\s*internship\s+experience\b'
    ],
    "projects": [
        r'^\s*(?:key\s+|technical\s+|personal\s+|academic\s+)?projects\b',
        r'^\s*portfolio\b',
        r'^\s*open\s+source\s+contributions?\b'
    ],
    "education": [
        r'^\s*education\b',
        r'^\s*academic\s+background\b',
        r'^\s*qualifications?\b',
        r'^\s*academic\s+history\b'
    ],
    "certifications": [
        r'^\s*certifications?\b',
        r'^\s*licenses?\s*(?:&|\+)?\s*certifications?\b',
        r'^\s*credentials\b'
    ],
    "achievements": [
        r'^\s*achievements?\b',
        r'^\s*awards?\s*(?:&|\+)?\s*(?:honors|achievements)?\b',
        r'^\s*extracurricular\s+activities\b',
        r'^\s*leadership\s*(?:&|\+)?\s*activities\b'
    ]
}

def extract_text_from_file(file_obj, filename: str) -> dict:
    """
    Extract raw text from PDF or DOCX file safely and inspect extraction health.
    Returns dict with extracted text, page count, and layout alerts.
    """
    ext = os.path.splitext(filename)[1].lower()
    text = ""
    page_count = 1
    is_scanned = False
    alerts = []

    try:
        if ext == '.pdf':
            import pypdf
            reader = pypdf.PdfReader(file_obj)
            page_count = len(reader.pages)
            raw_pages = []
            for idx, page in enumerate(reader.pages):
                page_text = page.extract_text() or ""
                raw_pages.append(page_text)
                text += page_text + "\n"

            # Scanned PDF detection
            total_chars = len(text.strip())
            avg_chars_per_page = total_chars / max(1, page_count)
            if total_chars < 60 or avg_chars_per_page < 30:
                is_scanned = True
                alerts.append(
                    "Scanned / Image-Only PDF Detected: Minimal machine-readable text was extracted. "
                    "ATS parsers will reject image-only resumes. Please export as searchable text PDF or DOCX."
                )

        elif ext in ['.docx', '.doc']:
            import docx
            doc = docx.Document(file_obj)
            for para in doc.paragraphs:
                if para.text.strip():
                    text += para.text + "\n"
            for table in doc.tables:
                for row in table.rows:
                    row_texts = [cell.text.strip() for cell in row.cells if cell.text.strip()]
                    if row_texts:
                        text += " | ".join(row_texts) + "\n"
                text += "\n"
        else:
            content = file_obj.read()
            if isinstance(content, bytes):
                text = content.decode('utf-8', errors='ignore')
            else:
                text = str(content)
    except Exception as e:
        alerts.append(f"Document parsing error: {str(e)}")
        text = ""

    # Detect multi-column or complex layout markers
    lines = [l.strip() for l in text.split('\n') if l.strip()]
    short_line_count = sum(1 for l in lines if len(l) < 15 and not l.isupper())
    if len(lines) > 20 and (short_line_count / len(lines)) > 0.45:
        alerts.append(
            "Multi-Column or Complex Layout Detected: Multiple short fragmented lines suggest side-by-side columns, "
            "which some ATS systems read out of order. Consider a single-column layout."
        )

    # Clean redundant whitespace
    text = re.sub(r'[ \t]+', ' ', text)
    text = re.sub(r'\n{3,}', '\n\n', text).strip()

    return {
        "text": text,
        "page_count": page_count,
        "is_scanned": is_scanned,
        "alerts": alerts
    }

def extract_skills_from_text(text: str) -> list:
    """
    Identify skills present in text using case-insensitive word-boundary matching.
    """
    if not text:
        return []

    found_skills = set()
    text_lower = f" {text.lower()} "

    for skill in TECH_SKILLS:
        escaped_skill = re.escape(skill.lower())
        pattern = rf'(?:^|[\s,;:(/|\-])({escaped_skill})(?:[\s,;:)/|\-]|$)'
        if re.search(pattern, text_lower):
            found_skills.add(skill)

    return sorted(list(found_skills))

def extract_contact_info(text: str, user=None) -> dict:
    """
    Extract candidate contact details: email, phone, links, and candidate name.
    """
    email_match = re.search(r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+', text)
    phone_match = re.search(r'(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', text)
    linkedin_match = re.search(r'linkedin\.com/in/[a-zA-Z0-9_-]+', text, re.IGNORECASE)
    github_match = re.search(r'github\.com/[a-zA-Z0-9_-]+', text, re.IGNORECASE)

    # Name extraction: first non-empty line of resume, or user profile name
    candidate_name = ""
    lines = [l.strip() for l in text.split('\n') if l.strip()]
    if lines:
        first_line = lines[0]
        # If first line looks like a name (not an email, not a URL, < 50 chars)
        if len(first_line) < 50 and not '@' and not 'http' in first_line.lower():
            # Strip trailing pipes or labels
            candidate_name = re.split(r'[|•,\-–]', first_line)[0].strip()

    if not candidate_name and user and hasattr(user, 'full_name') and user.full_name:
        candidate_name = user.full_name

    return {
        "name": candidate_name or "Candidate",
        "email": email_match.group(0) if email_match else "",
        "phone": phone_match.group(0) if phone_match else "",
        "linkedin": linkedin_match.group(0) if linkedin_match else "",
        "github": github_match.group(0) if github_match else ""
    }

def segment_resume_sections(text: str) -> dict:
    """
    Segment raw resume text into distinct structured sections:
    summary, skills, experience, internships, projects, education, certifications, achievements.
    """
    lines = text.split('\n')
    sections = {
        "summary": [],
        "skills": [],
        "experience": [],
        "internships": [],
        "projects": [],
        "education": [],
        "certifications": [],
        "achievements": [],
        "other": []
    }

    current_section = "other"

    for line in lines:
        stripped = line.strip()
        if not stripped:
            continue

        # Check if line matches a known section header
        header_matched = None
        lower_line = stripped.lower()
        if len(stripped) < 45:
            for sec_key, patterns in SECTION_HEADER_PATTERNS.items():
                for pat in patterns:
                    if re.search(pat, lower_line):
                        header_matched = sec_key
                        break
                if header_matched:
                    break

        if header_matched:
            current_section = header_matched
        else:
            sections[current_section].append(stripped)

    # Convert line arrays to joined text strings
    return {k: "\n".join(v).strip() for k, v in sections.items()}
