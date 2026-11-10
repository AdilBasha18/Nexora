import os
import re
from io import BytesIO

# Curated comprehensive tech & professional skills dictionary
TECH_SKILLS = [
    # Programming Languages
    "Python", "JavaScript", "TypeScript", "Java", "C++", "C#", "C", "Go", "Golang", "Rust", 
    "Ruby", "PHP", "Swift", "Kotlin", "Dart", "R", "Scala", "Shell", "Bash", "PowerShell", "SQL",
    # Frontend
    "React", "React.js", "Vue", "Vue.js", "Angular", "Next.js", "Nuxt.js", "HTML", "HTML5", 
    "CSS", "CSS3", "Tailwind CSS", "Bootstrap", "Sass", "Redux", "Webpack", "Vite",
    # Backend & Frameworks
    "Django", "Django REST Framework", "DRF", "FastAPI", "Flask", "Node.js", "Express.js", 
    "Spring Boot", "ASP.NET", ".NET", "Ruby on Rails", "Laravel", "NestJS", "GraphQL", "REST API",
    # Databases & Caching
    "PostgreSQL", "MySQL", "SQLite", "MongoDB", "Redis", "Elasticsearch", "Firebase", 
    "Cassandra", "DynamoDB", "Oracle", "Supabase", "Prisma",
    # Cloud, DevOps & Tools
    "AWS", "Amazon Web Services", "Azure", "Google Cloud", "GCP", "Docker", "Kubernetes", 
    "Git", "GitHub", "GitLab", "CI/CD", "Terraform", "Linux", "Nginx", "Jenkins", "Ansible",
    # AI & Data
    "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "Scikit-Learn", "NLP", 
    "Computer Vision", "Pandas", "NumPy", "OpenCV", "Data Analysis", "LLM", "RAG", "LangChain",
    # Methodologies & Soft Skills
    "Agile", "Scrum", "TDD", "Unit Testing", "System Design", "Microservices", "Problem Solving",
    "Communication", "Leadership", "Project Management"
]

def extract_text_from_file(file_obj, filename: str) -> str:
    """
    Extract raw text from PDF or DOCX file safely.
    """
    ext = os.path.splitext(filename)[1].lower()
    text = ""
    
    try:
        if ext == '.pdf':
            import pypdf
            reader = pypdf.PdfReader(file_obj)
            for page in reader.pages:
                extracted = page.extract_text()
                if extracted:
                    text += extracted + "\n"
        elif ext in ['.docx', '.doc']:
            import docx
            doc = docx.Document(file_obj)
            for para in doc.paragraphs:
                text += para.text + "\n"
            for table in doc.tables:
                for row in table.rows:
                    for cell in row.cells:
                        text += cell.text + " "
                    text += "\n"
        else:
            # Fallback to UTF-8 plain text read if possible
            content = file_obj.read()
            if isinstance(content, bytes):
                text = content.decode('utf-8', errors='ignore')
            else:
                text = str(content)
    except Exception as e:
        text = f"Error extracting text: {str(e)}"
    
    # Clean whitespace
    text = re.sub(r'[ \t]+', ' ', text)
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()

def extract_skills_from_text(text: str) -> list:
    """
    Identify skills present in text using case-insensitive word-boundary matching.
    """
    if not text:
        return []
        
    found_skills = set()
    text_lower = f" {text.lower()} "

    for skill in TECH_SKILLS:
        # Escape special chars like C++, C#, .NET
        escaped_skill = re.escape(skill.lower())
        pattern = rf'(?:^|[\s,;:(/])({escaped_skill})(?:[\s,;:)/]|$)'
        if re.search(pattern, text_lower):
            found_skills.add(skill)

    return sorted(list(found_skills))

