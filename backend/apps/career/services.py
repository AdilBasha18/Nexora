from .models import TargetRole, CareerRoadmap, RoadmapStep
from assessments.models import AssessmentAttempt
from resumes.models import Resume
from ats.models import ATSAnalysis

# Curated free learning resources mapping for standard skills
SKILL_RESOURCES = {
    "python": ("Python Official Tutorial & Docs", "https://docs.python.org/3/tutorial/"),
    "django": ("Django for Beginners & Official Tutorial", "https://docs.djangoproject.com/en/stable/intro/tutorial01/"),
    "react": ("React Documentation & Quick Start", "https://react.dev/learn"),
    "javascript": ("MDN Web Docs: JavaScript Guide", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide"),
    "typescript": ("TypeScript Handbook", "https://www.typescriptlang.org/docs/handbook/intro.html"),
    "sql": ("PostgreSQL Tutorial & SQL Exercises", "https://www.postgresqltutorial.com/"),
    "docker": ("Docker Curriculum & Getting Started", "https://docker-curriculum.com/"),
    "git": ("Pro Git Book & Free Interactive Git Course", "https://git-scm.com/book/en/v2"),
    "rest api": ("RESTful API Design Best Practices", "https://restfulapi.net/"),
    "fastapi": ("FastAPI Official Tutorial", "https://fastapi.tiangolo.com/tutorial/"),
    "data analysis": ("Pandas & NumPy Official User Guide", "https://pandas.pydata.org/docs/user_guide/index.html"),
    "aws": ("AWS Free Tier & Cloud Practitioner Whitepapers", "https://aws.amazon.com/free/"),
    "problem solving": ("Algorithm & Problem Solving Patterns", "https://neetcode.io/roadmap"),
    "pytorch": ("PyTorch Deep Learning Zero to Mastery", "https://pytorch.org/tutorials/"),
    "transformers": ("Hugging Face Transformers & NLP Course", "https://huggingface.co/learn/nlp-course/"),
    "langchain": ("LangChain & LLM Application Quickstart", "https://python.langchain.com/docs/get_started/introduction"),
    "rag": ("Retrieval-Augmented Generation Architecture Guide", "https://www.promptingguide.ai/techniques/rag"),
    "kubernetes": ("Kubernetes Basics & Minikube Hands-on", "https://kubernetes.io/docs/tutorials/kubernetes-basics/"),
    "terraform": ("HashiCorp Terraform Associate Guide", "https://developer.hashicorp.com/terraform/tutorials"),
    "linux": ("Linux Command Line & Bash Scripting", "https://linuxjourney.com/"),
    "ci/cd": ("GitHub Actions & Continuous Integration", "https://docs.github.com/en/actions"),
    "flutter": ("Flutter Official Documentation & Codelabs", "https://docs.flutter.dev/get-started/codelab"),
    "react native": ("React Native Getting Started", "https://reactnative.dev/docs/getting-started"),
    "dart": ("Dart Language Tour & Asynchronous Programming", "https://dart.dev/guides/language/language-tour"),
    "go": ("A Tour of Go & Concurrency Patterns", "https://go.dev/tour/"),
    "microservices": ("Microservices Architecture Patterns", "https://microservices.io/patterns/microservices.html"),
    "solidity": ("CryptoZombies Interactive Solidity Tutorial", "https://cryptozombies.io/"),
    "smart contracts": ("Ethereum Smart Contract Development Guide", "https://ethereum.org/en/developers/docs/smart-contracts/"),
    "web3.js": ("Web3.js Official Ethereum Library Guide", "https://web3js.readthedocs.io/"),
    "rust": ("The Rust Programming Language Book", "https://doc.rust-lang.org/book/"),
    "apache spark": ("Apache Spark Quickstart & DataFrame Guide", "https://spark.apache.org/docs/latest/quick-start.html"),
    "kafka": ("Apache Kafka Fundamentals by Confluent", "https://developer.confluent.io/learn/kafka-foundations/"),
    "airflow": ("Apache Airflow Workflow Orchestration", "https://airflow.apache.org/docs/apache-airflow/stable/tutorial/index.html"),
    "snowflake": ("Snowflake Architecture & Essentials", "https://quickstarts.snowflake.com/"),
    "java": ("Oracle Java Tutorials & Modern Java Features", "https://docs.oracle.com/javase/tutorial/"),
    "spring boot": ("Spring Boot Official Guides & Rest API", "https://spring.io/guides/gs/rest-service/"),
    "selenium": ("Selenium WebDriver Automation Guide", "https://www.selenium.dev/documentation/"),
    "cypress": ("Cypress End-to-End Testing Documentation", "https://docs.cypress.io/guides/overview/why-cypress"),
    "figma": ("Figma Learn & UI Design Systems", "https://help.figma.com/hc/en-us/categories/360002042553-Figma-Design"),
    "agile": ("Agile Manifesto & Scrum Guide", "https://www.scrumguides.org/"),
    "cybersecurity": ("TryHackMe & OWASP Top 10 Security Guide", "https://owasp.org/www-project-top-ten/"),
    "network security": ("CompTIA Network+ & Security Principles", "https://www.professormesser.com/network-plus/n10-008/n10-008-training-course/"),
    "penetration testing": ("Offensive Security & PenTest Fundamentals", "https://www.hackthebox.com/"),
    "machine learning": ("Scikit-Learn Machine Learning in Python", "https://scikit-learn.org/stable/tutorial/basic/tutorial.html"),
    "pandas": ("Pandas Data Analysis Tutorial", "https://pandas.pydata.org/docs/getting_started/index.html"),
    "scikit-learn": ("Scikit-Learn Machine Learning in Python", "https://scikit-learn.org/stable/tutorial/basic/tutorial.html"),
    "cryptography": ("Practical Cryptography for Developers", "https://cryptobook.nakov.com/"),
    "siem": ("SIEM Architecture & Threat Monitoring", "https://www.cisa.gov/resources-tools"),
    "power bi": ("Microsoft Power BI Guided Learning", "https://learn.microsoft.com/en-us/power-bi/guided-learning/"),
    "tableau": ("Tableau Free Training Videos", "https://www.tableau.com/learn/training"),
    "data modeling": ("Database Star Relational Modeling Guide", "https://www.databasestar.com/database-normalization/"),
    "graphql": ("GraphQL Official Tutorial", "https://graphql.org/learn/"),
    "tailwind": ("Tailwind CSS Documentation", "https://tailwindcss.com/docs"),
    "next.js": ("Next.js Official Interactive Course", "https://nextjs.org/learn")
}

# Rich, curated role templates with beginner, intermediate, advanced stages, role-specific projects, and interview checklists
ROLE_BLUEPRINTS = {
    "python": {
        "beginner": [
            ("Python Core & Data Structures", "Master OOP, generators, decorators, file I/O, list comprehensions, and memory model.", "Python", "Python Official Tutorial", "https://docs.python.org/3/tutorial/", "2-3 weeks"),
            ("Git, Virtual Environments & Packaging", "Learn poetry, venv, git branching, semantic versioning, and package structure.", "Git", "Pro Git Book", "https://git-scm.com/book/en/v2", "1 week"),
            ("Relational Databases & SQL with Python", "Write complex queries, joins, aggregations, indexing, and SQLite/PostgreSQL connectors.", "SQL", "PostgreSQL Tutorial", "https://www.postgresqltutorial.com/", "2 weeks"),
        ],
        "intermediate": [
            ("Django & FastAPI Web Architecture", "Build async REST APIs, dependency injection, middleware, Pydantic schemas, and authentication.", "FastAPI", "FastAPI Official Tutorial", "https://fastapi.tiangolo.com/tutorial/", "3 weeks"),
            ("ORM Optimization & Celery Task Queues", "Solve N+1 query bottlenecks, database transactions, Redis caching, and asynchronous workers.", "Django", "Django Performance Guide", "https://docs.djangoproject.com/en/stable/topics/performance/", "2-3 weeks"),
            ("Automated Testing with PyTest", "Write unit, integration, and mocking tests with pytest fixtures and coverage thresholds.", "PyTest", "PyTest Documentation", "https://docs.pytest.org/en/stable/", "1-2 weeks"),
        ],
        "advanced": [
            ("Microservices & Docker Containerization", "Multi-stage Docker builds, docker-compose orchestration, gRPC, and service health checks.", "Docker", "Docker Curriculum", "https://docker-curriculum.com/", "2-3 weeks"),
            ("Cloud Deployment & CI/CD Pipelines", "Automated linting, testing, and deployment to AWS ECS / Heroku via GitHub Actions.", "CI/CD", "GitHub Actions Guide", "https://docs.github.com/en/actions", "2 weeks"),
        ],
        "projects": [
            ("Real-Time E-Commerce Inventory & Order API", "Architect a high-concurrency order processing engine with FastAPI, Redis distributed locks, Celery background notification workers, and PostgreSQL. Expected Outcome: Handles 500 req/sec with zero double-spending.", "FastAPI, PostgreSQL, Redis, Celery, Docker", "https://github.com", "3-4 weeks"),
            ("Multi-Tenant Analytics Dashboard Service", "Build a multitenant SaaS backend with Django REST framework, JWT authentication, schema-based tenant isolation, and automated reporting.", "Django, PostgreSQL, DRF, PyTest", "https://github.com", "3 weeks"),
        ],
        "interview_prep": [
            ("Python Core & Concurrency Deep-Dive", "Prepare GIL mechanics, asyncio event loops, multiprocessing vs multithreading, and memory management.", "Python", "Nexora Interview Guide", "/assessments", "1-2 weeks"),
            ("System Design for Backend Developers", "Design URL shortener, rate limiter, message queue, and notification systems.", "System Design", "System Design Primer", "https://github.com/donnemartin/system-design-primer", "2 weeks"),
        ]
    },
    "full stack": {
        "beginner": [
            ("Modern JavaScript (ES2024) & TypeScript", "Master closures, event loops, promises, async/await, and strong TypeScript types.", "TypeScript", "TypeScript Handbook", "https://www.typescriptlang.org/docs/handbook/intro.html", "2-3 weeks"),
            ("Responsive Web Design & Tailwind CSS", "Build mobile-first, accessible (a11y) interfaces using Flexbox, CSS Grid, and Tailwind utility classes.", "HTML/CSS", "MDN CSS Layout", "https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout", "2 weeks"),
            ("SQL & Relational Schema Design", "Design normalized schemas, foreign keys, cascade rules, and query optimization.", "SQL", "PostgreSQL Tutorial", "https://www.postgresqltutorial.com/", "2 weeks"),
        ],
        "intermediate": [
            ("React 18 & State Management", "Component lifecycle, hooks (useMemo, useCallback, custom hooks), React Query, and Zustand.", "React", "React.dev Learn", "https://react.dev/learn", "3 weeks"),
            ("Node.js / Express or Django Backend", "RESTful API standards, JWT/OAuth2 authentication, input sanitization, and CORS handling.", "REST API", "RESTful Best Practices", "https://restfulapi.net/", "3 weeks"),
            ("Full-Stack Integration & Client Caching", "Optimistic UI updates, server-side rendering with Next.js, and error boundary handling.", "Next.js", "Next.js Learn", "https://nextjs.org/learn", "2 weeks"),
        ],
        "advanced": [
            ("Full Stack DevOps & Docker Deployments", "Containerize frontend and backend with Nginx reverse proxy, SSL/TLS, and automated CI/CD.", "Docker", "Docker Curriculum", "https://docker-curriculum.com/", "2-3 weeks"),
            ("Performance Tuning & Web Vitals", "Lighthouse scoring 90+, bundle splitting, lazy loading, and database index tuning.", "Web Performance", "web.dev Performance", "https://web.dev/explore/fast", "1-2 weeks"),
        ],
        "projects": [
            ("Collaborative Kanban Project Management Platform", "Real-time task boards with drag-and-drop (React Beautiful DnD), WebSockets for live peer updates, user roles, and team workspace management. Tech Stack: React, Node.js/FastAPI, WebSockets, PostgreSQL.", "React, WebSockets, Node.js/Python, PostgreSQL", "https://github.com", "4 weeks"),
            ("Full-Stack AI-Powered Job Board & Tracker", "Searchable job board with candidate applicant tracking, recruiter review panels, resume upload parsing, and email alerts.", "React, Tailwind, REST API, SQLite/PostgreSQL", "https://github.com", "3-4 weeks"),
        ],
        "interview_prep": [
            ("Frontend & Backend System Design", "Design Twitter newsfeed, WhatsApp messenger, and scalable web apps.", "System Design", "Frontend System Design", "https://www.greatfrontend.com/", "2 weeks"),
            ("Data Structures & Full-Stack Coding", "Practice NeetCode 75 problem solving patterns and live coding interview drills.", "Problem Solving", "NeetCode 75 Roadmap", "https://neetcode.io/roadmap", "2 weeks"),
        ]
    },
    "data analyst": {
        "beginner": [
            ("Advanced Excel & Business Analytics", "Master XLOOKUP, INDEX/MATCH, dynamic pivot tables, Power Query data cleaning, and statistical modeling.", "Excel", "Excel University Guides", "https://support.microsoft.com/en-us/excel", "2 weeks"),
            ("SQL for Analytics & Aggregations", "Window functions (ROW_NUMBER, RANK, LAG/LEAD), CTEs, self joins, and group by rollup.", "SQL", "PostgreSQL Tutorial", "https://www.postgresqltutorial.com/", "3 weeks"),
        ],
        "intermediate": [
            ("Python for Data Analysis (Pandas & NumPy)", "Data wrangling, cleaning missing values, exploratory data analysis (EDA), and time series analysis.", "Pandas", "Pandas Official User Guide", "https://pandas.pydata.org/docs/user_guide/index.html", "3 weeks"),
            ("Interactive Business Dashboards (Power BI / Tableau)", "Design executive dashboards with DAX measures, star schema modeling, drill-down parameters, and KPIs.", "Power BI", "Microsoft Power BI Guided Learning", "https://learn.microsoft.com/en-us/power-bi/guided-learning/", "3 weeks"),
        ],
        "advanced": [
            ("Statistical Hypothesis Testing & A/B Testing", "P-values, confidence intervals, t-tests, ANOVA, chi-square, and conversion rate analysis.", "Statistics", "OpenIntro Statistics", "https://www.openintro.org/book/os/", "2 weeks"),
            ("Automated Data Pipelines & Scheduled Reporting", "Extract data from REST APIs, automate weekly cleaning routines with Python scripts.", "Python", "Automate the Boring Stuff with Python", "https://automatetheboringstuff.com/", "2 weeks"),
        ],
        "projects": [
            ("SaaS Customer Churn & Revenue Analytics Dashboard", "Analyze 50,000+ subscription records using SQL and Pandas to identify key churn indicators, calculate Customer Lifetime Value (LTV), and build an interactive Power BI dashboard.", "SQL, Python (Pandas/Seaborn), Power BI", "https://github.com", "3 weeks"),
            ("E-Commerce Marketing Campaign A/B Test Case Study", "Evaluate campaign variant conversion rates with statistical significance testing, sample size validation, and executive summary slide deck.", "Python, Statsmodels, Jupyter Notebook", "https://github.com", "2-3 weeks"),
        ],
        "interview_prep": [
            ("SQL Live Coding & Business Case Scenarios", "Solve LeetCode/StrataScratch medium SQL challenges under timed conditions.", "SQL", "StrataScratch SQL Practice", "https://www.stratascratch.com/", "2 weeks"),
            ("Metric Definition & Product Analytics Questions", "Practice structuring answers for metric drops, funnel conversion, and KPI diagnostics.", "Product Analytics", "Case Interview Secrets", "https://www.caseinterview.com/", "1-2 weeks"),
        ]
    },
    "data scientist": {
        "beginner": [
            ("Mathematics for Machine Learning", "Linear algebra (eigenvalues, vectors), multivariate calculus, and probability distributions.", "Math", "Mathematics for Machine Learning Book", "https://mml-book.github.io/", "3 weeks"),
            ("Python Data Science Stack (NumPy, SciPy, Pandas)", "Vectorized operations, data transformation pipelines, and statistical modeling.", "Python", "NumPy & Pandas Guide", "https://pandas.pydata.org/docs/", "2-3 weeks"),
        ],
        "intermediate": [
            ("Supervised & Unsupervised Machine Learning", "Regression, Random Forests, XGBoost, K-Means, PCA, cross-validation, and ROC-AUC curves.", "Scikit-Learn", "Scikit-Learn Official User Guide", "https://scikit-learn.org/stable/user_guide.html", "4 weeks"),
            ("Feature Engineering & Model Evaluation", "Target encoding, scaling, handling class imbalance (SMOTE), and hyperparameter tuning (Optuna).", "Machine Learning", "Feature Engineering for ML", "https://www.oreilly.com/library/view/feature-engineering-for/9781491953235/", "2 weeks"),
        ],
        "advanced": [
            ("Deep Learning & PyTorch Foundations", "Feedforward neural nets, CNNs, RNNs, backpropagation, and loss function customization.", "PyTorch", "PyTorch Official Tutorials", "https://pytorch.org/tutorials/", "3-4 weeks"),
            ("ML Model Deployment & MLOps Basics", "Containerize models with Docker, serve REST predictions with FastAPI, and log metrics with MLflow.", "MLOps", "Made With ML Course", "https://madewithml.com/", "2-3 weeks"),
        ],
        "projects": [
            ("End-to-End Credit Default Prediction Engine", "Clean financial records, engineer behavioral features, train an XGBoost ensemble, optimize F1-score with Bayesian tuning, and deploy inference API via FastAPI with Docker.", "Python, Scikit-Learn, XGBoost, FastAPI, Docker", "https://github.com", "4 weeks"),
            ("Customer Segmentation & Recommendation System", "Implement collaborative filtering and matrix factorization on retail transactions with t-SNE clustering visualizations.", "Python, PyTorch/Surprise, Pandas, Matplotlib", "https://github.com", "3 weeks"),
        ],
        "interview_prep": [
            ("Machine Learning Theory & Bias-Variance Tradeoff", "Explain L1/L2 regularization, gradient boosting math, and overfitting remedies.", "ML Theory", "StatQuest ML Series", "https://statquest.org/", "2 weeks"),
            ("Coding & Take-Home Assignment Preparation", "Prepare clean, reproducible Jupyter notebooks and GitHub repositories.", "Jupyter", "Nexora Interview Prep", "/assessments", "1 week"),
        ]
    },
    "ai & machine learning": {
        "beginner": [
            ("Python Deep Learning Core & PyTorch", "Tensors, autograd, custom Dataset and DataLoader, training loops, and GPU acceleration with CUDA.", "PyTorch", "PyTorch Deep Learning Zero to Mastery", "https://pytorch.org/tutorials/", "3 weeks"),
            ("Foundational NLP & Computer Vision", "Tokenization, embeddings (Word2Vec), transfer learning with ResNet, and OpenCV fundamentals.", "Deep Learning", "Fast.ai Practical Deep Learning", "https://course.fast.ai/", "3 weeks"),
        ],
        "intermediate": [
            ("Transformers & Modern LLM Architecture", "Self-attention mechanisms, encoder-decoder models, BERT, and generative transformers (GPT).", "Transformers", "Hugging Face NLP Course", "https://huggingface.co/learn/nlp-course/", "4 weeks"),
            ("Fine-Tuning & Parameter-Efficient Tuning (LoRA/QLoRA)", "Hugging Face PEFT, quantization, dataset formatting, and loss evaluation.", "LLMs", "Hugging Face PEFT Guide", "https://huggingface.co/docs/peft/index", "3 weeks"),
        ],
        "advanced": [
            ("RAG Systems & Vector Database Engineering", "Retrieval-Augmented Generation, chunking strategies, hybrid dense/sparse search, ChromaDB/Pinecone.", "RAG", "PromptingGuide RAG Deep Dive", "https://www.promptingguide.ai/techniques/rag", "3 weeks"),
            ("LLM Evaluation, Guardrails & Production Serving", "vLLM, Ollama, semantic caching, latency optimization, and output hallucination mitigation.", "LLM Serving", "vLLM Documentation", "https://docs.vllm.ai/en/latest/", "2-3 weeks"),
        ],
        "projects": [
            ("Enterprise Enterprise Knowledge Base RAG Assistant", "Construct an end-to-end question answering system over proprietary PDF documents using LangChain, sentence-transformers, ChromaDB vector store, and streaming LLM responses with source citations.", "LangChain, ChromaDB, FastAPI, Streamlit/React", "https://github.com", "4 weeks"),
            ("Domain-Specific Medical/Legal Question Answering LLM", "Fine-tune a 7B parameter open-weights model using LoRA on instruction pairs, evaluate BLEU/ROUGE metrics, and deploy on modal/replicate.", "Hugging Face, PyTorch, LoRA, Docker", "https://github.com", "4 weeks"),
        ],
        "interview_prep": [
            ("LLM & Generative AI Architecture Viva", "Attention math, KV cache, speculative decoding, and hallucination reduction methods.", "GenAI", "DeepLearning.AI Short Courses", "https://www.deeplearning.ai/", "2 weeks"),
            ("Coding Challenge: Custom PyTorch Architecture", "Implement self-attention or mini-transformer from scratch without external libraries.", "PyTorch", "Nexora Skill Assessments", "/assessments", "1-2 weeks"),
        ]
    },
    "devops": {
        "beginner": [
            ("Linux Systems Administration & Bash Scripting", "Process management, cron jobs, file permissions, networking diagnostics (netstat, curl, iptables).", "Linux", "Linux Journey Interactive", "https://linuxjourney.com/", "2-3 weeks"),
            ("Docker Containerization Standards", "Multi-stage builds, non-root user security, volume management, and image footprint optimization.", "Docker", "Docker Curriculum", "https://docker-curriculum.com/", "2 weeks"),
        ],
        "intermediate": [
            ("CI/CD Automation with GitHub Actions & GitLab", "Self-hosted runners, secret rotation, semantic release tags, matrix testing, and artifact caching.", "CI/CD", "GitHub Actions Documentation", "https://docs.github.com/en/actions", "2-3 weeks"),
            ("Cloud Infrastructure on AWS / GCP", "VPC configuration, subnets, NAT gateways, IAM policies, security groups, S3, and EC2/ECS.", "AWS", "AWS Free Tier & Cloud Practitioner", "https://aws.amazon.com/free/", "3 weeks"),
            ("Infrastructure as Code (IaC) with Terraform", "State file management, remote backends (S3/DynamoDB locks), modules, and provider versioning.", "Terraform", "HashiCorp Terraform Tutorials", "https://developer.hashicorp.com/terraform/tutorials", "3 weeks"),
        ],
        "advanced": [
            ("Kubernetes (K8s) Cluster Orchestration", "Deployments, Services, Ingress controllers, ConfigMaps, Secrets, persistent volumes, and Helm charts.", "Kubernetes", "Kubernetes Basics & Hands-on", "https://kubernetes.io/docs/tutorials/kubernetes-basics/", "4 weeks"),
            ("Observability & Monitoring (Prometheus & Grafana)", "Metric scraping, custom alerting rules, log aggregation with Loki/ELK, and distributed tracing.", "Observability", "Prometheus Getting Started", "https://prometheus.io/docs/introduction/first_steps/", "2-3 weeks"),
        ],
        "projects": [
            ("Production-Grade Multi-Environment K8s Cluster via Terraform", "Automate complete AWS EKS cluster provisioning with Terraform, including ArgoCD GitOps, cert-manager SSL, and Prometheus/Grafana monitoring stack.", "Terraform, AWS EKS, ArgoCD, Helm, Grafana", "https://github.com", "4 weeks"),
            ("Zero-Downtime Blue/Green Deployment Pipeline", "Build a GitHub Actions workflow that executes automated test suites, builds signed Docker images, and executes rolling blue/green deployments on container clusters.", "GitHub Actions, Docker, AWS ECS/K8s, Bash", "https://github.com", "3 weeks"),
        ],
        "interview_prep": [
            ("Troubleshooting Broken Cloud Infrastructure Scenarios", "Diagnose CrashLoopBackOff, SSL handshake failures, DNS resolution issues, and disk memory pressure.", "DevOps", "SadServers Scenario Practice", "https://sadservers.com/", "2 weeks"),
            ("DevOps Architecture & Security Standards", "Discuss principle of least privilege, zero-trust network access, and secret scanning.", "Cloud Security", "Nexora Skill Assessments", "/assessments", "1-2 weeks"),
        ]
    },
    "cybersecurity": {
        "beginner": [
            ("Computer Networking & OSI Model Fundamentals", "TCP/IP handshakes, DNS, DHCP, routing protocols, subnetting, and Wireshark packet capture.", "Networking", "Professor Messer Network+", "https://www.professormesser.com/network-plus/n10-008/n10-008-training-course/", "3 weeks"),
            ("Linux Security & Scripting for Penetration Testing", "Bash automation, Python socket programming, port scanning scripts, and SSH hardening.", "Linux", "Linux Journey", "https://linuxjourney.com/", "2 weeks"),
        ],
        "intermediate": [
            ("OWASP Top 10 Web Application Security", "SQL injection, XSS, CSRF, SSRF, IDOR, and authentication bypass vulnerability exploitation and defense.", "OWASP", "OWASP Top 10 Security Guide", "https://owasp.org/www-project-top-ten/", "3 weeks"),
            ("Vulnerability Scanning & Penetration Testing", "Hands-on tools: Nmap, Burp Suite, Metasploit, Gobuster, and vulnerability report writing.", "Penetration Testing", "TryHackMe Pre-Security & Jr PenTester", "https://tryhackme.com/", "4 weeks"),
        ],
        "advanced": [
            ("SIEM, Threat Detection & Incident Response", "Splunk / Elastic SIEM query syntax, analyzing brute-force logs, and creating detection alert rules.", "SIEM", "CISA Cyber Resources", "https://www.cisa.gov/resources-tools", "3 weeks"),
            ("Cloud Security & Identity Hardening", "AWS IAM privilege escalation defenses, least privilege policies, and compliance auditing.", "Cloud Security", "OWASP Cloud Security Cheat Sheet", "https://cheatsheetseries.owasp.org/", "2-3 weeks"),
        ],
        "projects": [
            ("Comprehensive Web Vulnerability Assessment & PenTest Report", "Perform a full black-box security audit against a purposely vulnerable test lab (e.g. DVWA/Juice Shop). Document CVSS scores, step-by-step PoC exploits, and developer mitigation patches.", "Burp Suite, Nmap, Kali Linux, OWASP ZAP", "https://github.com", "3-4 weeks"),
            ("Automated Threat Detection & Log Analysis Script", "Write a Python IDS script that parses Nginx access logs in real-time, detects SQLi/XSS attack signatures, and automatically blocks abusive IP addresses via iptables.", "Python, Linux iptables, Regex, Syslog", "https://github.com", "3 weeks"),
        ],
        "interview_prep": [
            ("Cybersecurity Technical Viva & Attack Vectors", "Walk through how HTTPS works, Diffie-Hellman key exchange, symmetric vs asymmetric encryption.", "Cryptography", "Practical Cryptography Guide", "https://cryptobook.nakov.com/", "2 weeks"),
            ("Scenario-Based Incident Response Questions", "Structured responses for compromised credentials, ransomware outbreaks, and data exfiltration.", "Incident Response", "Nexora Skill Assessments", "/assessments", "1-2 weeks"),
        ]
    },
    "java": {
        "beginner": [
            ("Core Java 21 & Object-Oriented Principles", "Encapsulation, inheritance, polymorphism, abstract classes, interfaces, records, and memory model.", "Java", "Oracle Java Tutorials", "https://docs.oracle.com/javase/tutorial/", "3 weeks"),
            ("Java Collections Framework & Streams API", "List, Set, Map implementations, time complexity, lambdas, stream filtering, mapping, and reduction.", "Java", "Baeldung Java Collections Guide", "https://www.baeldung.com/java-collections", "2 weeks"),
        ],
        "intermediate": [
            ("Spring Boot 3 & REST API Development", "Dependency injection (@Component, @Autowired), controllers, services, repositories, and exception handling.", "Spring Boot", "Spring Boot Official Guides", "https://spring.io/guides/gs/rest-service/", "3 weeks"),
            ("Spring Data JPA & Hibernate ORM", "Entity relationships (@OneToMany, @ManyToMany), fetch types, criteria queries, caching, and transactions.", "Hibernate", "Baeldung Spring Data JPA", "https://www.baeldung.com/the-persistence-layer-with-spring-data-jpa", "3 weeks"),
            ("Spring Security & JWT Authentication", "Filter chains, password hashing (BCrypt), role-based access control, and stateless tokens.", "Spring Security", "Spring Security Reference", "https://docs.spring.io/spring-security/reference/", "2 weeks"),
        ],
        "advanced": [
            ("Microservices Architecture with Spring Cloud", "Service discovery (Eureka), API Gateway, Resilience4j circuit breakers, and Kafka message streaming.", "Microservices", "Microservices Architecture Patterns", "https://microservices.io/", "4 weeks"),
            ("Unit & Integration Testing with JUnit 5 & Mockito", "Test-driven development, MockMvc REST testing, Testcontainers for real PostgreSQL tests.", "JUnit", "JUnit 5 User Guide", "https://junit.org/junit5/docs/current/user-guide/", "2 weeks"),
        ],
        "projects": [
            ("Enterprise Banking / Fintech Transaction Microservice", "Build a high-reliability account ledger service with Spring Boot, PostgreSQL, Kafka event publishing for transaction alerts, and distributed tracing with OpenTelemetry.", "Java 21, Spring Boot 3, Kafka, PostgreSQL, Docker", "https://github.com", "4 weeks"),
            ("Multi-Vendor Marketplace Backend System", "RESTful ecommerce engine with inventory reservation locks, stripe payment gateway integration, and JWT auth.", "Spring Boot, Hibernate, MySQL, Redis", "https://github.com", "3-4 weeks"),
        ],
        "interview_prep": [
            ("Java Concurrency, Garbage Collection & JVM Internals", "JVM heap memory structure, GC algorithms (G1, ZGC), volatile, synchronized, and virtual threads.", "JVM", "Baeldung JVM Internals", "https://www.baeldung.com/jvm-parameters", "2 weeks"),
            ("Spring Boot Architecture & Design Patterns", "Singleton, Factory, Strategy, Builder, and Proxy patterns in enterprise Java frameworks.", "Design Patterns", "Nexora Skill Assessments", "/assessments", "2 weeks"),
        ]
    },
    "qa": {
        "beginner": [
            ("Manual Testing & QA Methodologies", "Test case design, bug lifecycle, boundary value analysis, equivalence partitioning, and Jira reporting.", "QA Fundamentals", "Guru99 Software Testing", "https://www.guru99.com/software-testing.html", "2 weeks"),
            ("API Testing with Postman & Newman", "HTTP status codes, assertions, environment variables, collection runners, and automated mock servers.", "API Testing", "Postman Learning Center", "https://learning.postman.com/", "2 weeks"),
        ],
        "intermediate": [
            ("Web Automation with Selenium WebDriver / Playwright", "Page Object Model (POM), element locators (XPath/CSS), explicit waits, and cross-browser testing.", "Playwright", "Playwright Documentation", "https://playwright.dev/", "3-4 weeks"),
            ("Test Automation Framework with Python / Java", "Test runners (PyTest / TestNG), parameterization, screenshot on failure, and Allure reporting.", "PyTest", "PyTest Documentation", "https://docs.pytest.org/", "2-3 weeks"),
        ],
        "advanced": [
            ("CI/CD Test Pipeline Integration & Docker", "Running headless regression suites inside GitHub Actions and containerized Selenium grids.", "CI/CD", "GitHub Actions Automation", "https://docs.github.com/en/actions", "2 weeks"),
            ("Performance & Load Testing with Locust / JMeter", "Simulate 1,000+ concurrent virtual users, measure 95th percentile latency, and diagnose bottlenecks.", "Performance Testing", "Locust.io Documentation", "https://locust.io/", "2 weeks"),
        ],
        "projects": [
            ("Production E-Commerce E2E Test Suite with Playwright", "Build an automated end-to-end regression suite covering user signup, search, cart checkout, and payment mocking with automated Allure report generation.", "Playwright, TypeScript, GitHub Actions, Allure", "https://github.com", "3-4 weeks"),
            ("Comprehensive REST API Automation Suite with Postman & Python", "Automate 100+ endpoints with negative testing, schema validation, and security fuzzing executed on every git push.", "Python Requests, PyTest, Docker", "https://github.com", "3 weeks"),
        ],
        "interview_prep": [
            ("Scenario-Based Bug Hunting & Test Strategy", "How to write a comprehensive test plan for complex features (e.g. payment gateway or file uploader).", "Test Strategy", "Software Testing Help", "https://www.softwaretestinghelp.com/", "2 weeks"),
            ("Automation Code Problem Solving", "Solve live coding locator challenges, synchronization waits, and iframe/shadow DOM handling.", "Automation", "Nexora Skill Assessments", "/assessments", "1-2 weeks"),
        ]
    }
}

def calculate_job_readiness(user, target_role_id: int = None) -> dict:
    """
    Transparent, explainable multi-factor Job Readiness Score calculation.
    """
    try:
        candidate_profile = user.candidate_profile
    except Exception:
        candidate_profile = None

    # Determine target role
    target_role = None
    if target_role_id:
        target_role = TargetRole.objects.filter(id=target_role_id).first()
    
    if not target_role and candidate_profile and candidate_profile.target_role:
        target_role = TargetRole.objects.filter(title__icontains=candidate_profile.target_role).first()
        
    if not target_role:
        target_role = TargetRole.objects.first()

    if not target_role:
        return {
            "overall_readiness": 50,
            "error": "No target role found in system."
        }

    # 1. Candidate skills aggregation
    candidate_skills = set()
    if candidate_profile and candidate_profile.skills:
        candidate_skills.update([s.lower() for s in candidate_profile.skills])
    
    resume = Resume.objects.filter(user=user, is_primary=True).first()
    if resume and resume.parsed_skills:
        candidate_skills.update([s.lower() for s in resume.parsed_skills])

    role_req_skills = [s.lower() for s in (target_role.required_skills or [])]
    role_pref_skills = [s.lower() for s in (target_role.preferred_skills or [])]

    matched_req = [s for s in role_req_skills if s in candidate_skills]
    missing_req = [s for s in role_req_skills if s not in candidate_skills]
    matched_pref = [s for s in role_pref_skills if s in candidate_skills]

    # Skill coverage (40% weight)
    if role_req_skills:
        skill_coverage_score = int(((len(matched_req) + 0.5 * len(matched_pref)) / max(1, len(role_req_skills) + 0.5 * len(role_pref_skills))) * 100)
    else:
        skill_coverage_score = 65
    skill_coverage_score = min(skill_coverage_score, 100)

    # 2. Assessment Demonstration (25% weight)
    attempts = AssessmentAttempt.objects.filter(candidate=user)
    if attempts.exists():
        avg_score = sum(a.percentage for a in attempts) / attempts.count()
        assessment_score = int(avg_score)
    else:
        assessment_score = 20  # Baseline before taking any assessments

    # 3. Resume Alignment (20% weight)
    latest_ats = ATSAnalysis.objects.filter(user=user).order_by('-created_at').first()
    if latest_ats:
        resume_score = latest_ats.overall_score
    elif resume:
        resume_score = 60  # Has resume uploaded
    else:
        resume_score = 25  # No resume yet

    # 4. Project & Experience Evidence (15% weight)
    evidence_score = 20
    if candidate_profile:
        if candidate_profile.projects and len(candidate_profile.projects) > 0:
            evidence_score += 40
        if candidate_profile.experience_years and float(candidate_profile.experience_years) > 0:
            evidence_score += 40
    evidence_score = min(evidence_score, 100)

    # Weighted Overall:
    overall = int(
        (skill_coverage_score * 0.40) +
        (assessment_score * 0.25) +
        (resume_score * 0.20) +
        (evidence_score * 0.15)
    )
    overall = min(max(overall, 15), 98)

    # Strongest areas & priority gaps
    strongest_areas = [s.title() for s in matched_req[:4]]
    if not strongest_areas and candidate_skills:
        strongest_areas = [s.title() for s in list(candidate_skills)[:3]]

    priority_gaps = [s.title() for s in missing_req[:4]]

    # Next actionable recommendations
    recommendations = []
    if missing_req:
        recommendations.append(f"Learn or demonstrate {missing_req[0].title()} to boost role alignment.")
    if not attempts.exists():
        recommendations.append("Take a Skill Assessment to prove your technical ability to recruiters.")
    if not latest_ats:
        recommendations.append("Run an ATS check with your resume against your target role.")
    if candidate_profile and (not candidate_profile.projects or len(candidate_profile.projects) == 0):
        recommendations.append("Add 1-2 portfolio projects highlighting real-world code.")

    return {
        "overall_readiness": overall,
        "target_role": {
            "id": target_role.id,
            "title": target_role.title,
            "salary_range": target_role.average_salary,
            "market_demand": target_role.market_demand
        },
        "component_scores": {
            "skill_coverage": skill_coverage_score,
            "assessment_demonstration": assessment_score,
            "resume_alignment": resume_score,
            "experience_and_projects": evidence_score
        },
        "strongest_areas": strongest_areas,
        "priority_gaps": priority_gaps,
        "recommendations": recommendations,
        "disclaimer": "The Job Readiness Score is an estimated development benchmark. It combines your self-reported profile, assessments, and resume alignment to guide your preparation, and does not predict employer hiring decisions."
    }

def find_matching_blueprint(role_title: str) -> dict:
    """Finds best curated blueprint by title keywords."""
    title_lower = role_title.lower()
    if "python" in title_lower:
        return ROLE_BLUEPRINTS["python"]
    if "full stack" in title_lower or "web engineer" in title_lower:
        return ROLE_BLUEPRINTS["full stack"]
    if "data analyst" in title_lower:
        return ROLE_BLUEPRINTS["data analyst"]
    if "data scientist" in title_lower:
        return ROLE_BLUEPRINTS["data scientist"]
    if "machine learning" in title_lower or "ai" in title_lower:
        return ROLE_BLUEPRINTS["ai & machine learning"]
    if "devops" in title_lower or "cloud" in title_lower:
        return ROLE_BLUEPRINTS["devops"]
    if "security" in title_lower or "cyber" in title_lower:
        return ROLE_BLUEPRINTS["cybersecurity"]
    if "java" in title_lower:
        return ROLE_BLUEPRINTS["java"]
    if "qa" in title_lower or "test" in title_lower:
        return ROLE_BLUEPRINTS["qa"]
    return None

def generate_roadmap_for_role(user, target_role: TargetRole, user_inputs: dict = None) -> CareerRoadmap:
    """
    Creates or regenerates a personalized, 7-stage learning and job-preparation roadmap for a candidate's target role.
    Integrates user's existing skills, experience level, and preferred duration.
    """
    user_inputs = user_inputs or {}
    current_skills_input = [s.strip().lower() for s in user_inputs.get('current_skills', []) if s.strip()]

    # Also aggregate existing skills from profile and primary resume
    known_skills = set(current_skills_input)
    try:
        if user.candidate_profile and user.candidate_profile.skills:
            known_skills.update([s.lower() for s in user.candidate_profile.skills])
    except Exception:
        pass

    primary_res = Resume.objects.filter(user=user, is_primary=True).first()
    if primary_res and primary_res.parsed_skills:
        known_skills.update([s.lower() for s in primary_res.parsed_skills])

    roadmap, _ = CareerRoadmap.objects.get_or_create(
        candidate=user,
        target_role=target_role
    )

    # If force regenerating with user_inputs or empty steps
    if user_inputs or roadmap.steps.count() == 0:
        roadmap.steps.all().delete()
        step_order = 1

        blueprint = find_matching_blueprint(target_role.title)

        if blueprint:
            # 1. Beginner Stage
            for item in blueprint.get("beginner", []):
                title, desc, skill, r_title, r_url, dur = item
                has_skill = skill.lower() in known_skills
                RoadmapStep.objects.create(
                    roadmap=roadmap,
                    phase="Stage 1: Beginner Foundations",
                    title=title,
                    description=desc,
                    skill_name=skill,
                    resource_title=r_title,
                    resource_url=r_url,
                    estimated_duration=dur,
                    order=step_order,
                    is_completed=has_skill,
                    verified_by_assessment=has_skill
                )
                step_order += 1

            # 2. Intermediate Stage
            for item in blueprint.get("intermediate", []):
                title, desc, skill, r_title, r_url, dur = item
                has_skill = skill.lower() in known_skills
                RoadmapStep.objects.create(
                    roadmap=roadmap,
                    phase="Stage 2: Intermediate Specialization",
                    title=title,
                    description=desc,
                    skill_name=skill,
                    resource_title=r_title,
                    resource_url=r_url,
                    estimated_duration=dur,
                    order=step_order,
                    is_completed=has_skill,
                    verified_by_assessment=has_skill
                )
                step_order += 1

            # 3. Advanced Stage
            for item in blueprint.get("advanced", []):
                title, desc, skill, r_title, r_url, dur = item
                has_skill = skill.lower() in known_skills
                RoadmapStep.objects.create(
                    roadmap=roadmap,
                    phase="Stage 3: Advanced Architecture & Production Systems",
                    title=title,
                    description=desc,
                    skill_name=skill,
                    resource_title=r_title,
                    resource_url=r_url,
                    estimated_duration=dur,
                    order=step_order,
                    is_completed=has_skill,
                    verified_by_assessment=has_skill
                )
                step_order += 1

            # 4. Role-Specific Projects
            for item in blueprint.get("projects", []):
                title, desc, stack, r_url, dur = item
                RoadmapStep.objects.create(
                    roadmap=roadmap,
                    phase="Stage 4: Role-Specific Portfolio Projects",
                    title=title,
                    description=f"{desc} | Tech Stack: {stack}",
                    skill_name="Project Development",
                    resource_title="Project Architecture Spec & GitHub Template",
                    resource_url=r_url,
                    estimated_duration=dur,
                    order=step_order,
                    is_completed=False,
                    verified_by_assessment=False
                )
                step_order += 1

            # 5. Practical Skill Assessments
            RoadmapStep.objects.create(
                roadmap=roadmap,
                phase="Stage 5: Skill Assessments & Coding Labs",
                title=f"Complete {target_role.title} Technical Evaluation",
                description=f"Validate your core knowledge through timed MCQs and sandbox coding challenges with automated unit tests.",
                skill_name="Verified Assessment",
                resource_title="Nexora Assessment Benchmarks",
                resource_url="/assessments",
                estimated_duration="1-2 days",
                order=step_order,
                is_completed=False,
                verified_by_assessment=False
            )
            step_order += 1

            # 6. Technical Interview Preparation
            for item in blueprint.get("interview_prep", []):
                title, desc, skill, r_title, r_url, dur = item
                RoadmapStep.objects.create(
                    roadmap=roadmap,
                    phase="Stage 6: Technical Interview Preparation",
                    title=title,
                    description=desc,
                    skill_name=skill,
                    resource_title=r_title,
                    resource_url=r_url,
                    estimated_duration=dur,
                    order=step_order,
                    is_completed=False,
                    verified_by_assessment=False
                )
                step_order += 1

            # 7. Job Preparation & ATS Optimization
            RoadmapStep.objects.create(
                roadmap=roadmap,
                phase="Stage 7: Job Readiness & ATS Checklist",
                title=f"ATS Resume Tailoring for {target_role.title}",
                description=f"Scan and optimize your resume against actual {target_role.title} postings using Nexora's ATS Checker and Resume Improvement Studio.",
                skill_name="ATS Optimization",
                resource_title="Nexora ATS Checker",
                resource_url="/ats-checker",
                estimated_duration="3-5 days",
                order=step_order,
                is_completed=False,
                verified_by_assessment=False
            )
            step_order += 1

            RoadmapStep.objects.create(
                roadmap=roadmap,
                phase="Stage 7: Job Readiness & ATS Checklist",
                title="Portfolio Deployment & Application Launch",
                description=f"Deploy live demos of your projects on cloud platforms, link GitHub repositories, and begin applying to curated opportunities in Find Jobs.",
                skill_name="Job Applications",
                resource_title="Nexora Curated Jobs",
                resource_url="/jobs",
                estimated_duration="Ongoing",
                order=step_order,
                is_completed=False,
                verified_by_assessment=False
            )

        else:
            # Dynamic fallback for any custom role using required & preferred skills
            req_skills = target_role.required_skills or ["Core Engineering", "Problem Solving"]
            pref_skills = target_role.preferred_skills or ["System Architecture", "Cloud Deployment"]

            # Stage 1: Beginner Foundations
            for skill in req_skills[:3]:
                skill_clean = skill.lower().strip()
                res_title, res_url = SKILL_RESOURCES.get(
                    skill_clean, 
                    (f"Official {skill} Documentation", f"https://www.google.com/search?q={skill}+documentation")
                )
                has_skill = skill_clean in known_skills
                RoadmapStep.objects.create(
                    roadmap=roadmap,
                    phase="Stage 1: Beginner Foundations",
                    title=f"Core Foundations: {skill}",
                    description=f"Master fundamental syntax, patterns, and best practices for {skill}.",
                    skill_name=skill,
                    resource_title=res_title,
                    resource_url=res_url,
                    estimated_duration="2-3 weeks",
                    order=step_order,
                    is_completed=has_skill,
                    verified_by_assessment=has_skill
                )
                step_order += 1

            # Stage 2: Intermediate Specialization
            for skill in req_skills[3:] + pref_skills[:2]:
                skill_clean = skill.lower().strip()
                res_title, res_url = SKILL_RESOURCES.get(
                    skill_clean, 
                    (f"{skill} Deep Dive Tutorial", f"https://www.google.com/search?q={skill}+tutorial")
                )
                has_skill = skill_clean in known_skills
                RoadmapStep.objects.create(
                    roadmap=roadmap,
                    phase="Stage 2: Intermediate Specialization",
                    title=f"Specialized Practice: {skill}",
                    description=f"Build production-grade applications, design patterns, and testing strategies with {skill}.",
                    skill_name=skill,
                    resource_title=res_title,
                    resource_url=res_url,
                    estimated_duration="3-4 weeks",
                    order=step_order,
                    is_completed=has_skill,
                    verified_by_assessment=has_skill
                )
                step_order += 1

            # Stage 3: Advanced Architecture
            RoadmapStep.objects.create(
                roadmap=roadmap,
                phase="Stage 3: Advanced Architecture & Production Systems",
                title=f"Scalable System Architecture for {target_role.title}",
                description=f"Implement resilient architectural patterns, caching, concurrency controls, and CI/CD automation for {target_role.title}.",
                skill_name="System Architecture",
                resource_title="High Scalability Architecture Patterns",
                resource_url="https://microservices.io/",
                estimated_duration="3-4 weeks",
                order=step_order,
                is_completed=False,
                verified_by_assessment=False
            )
            step_order += 1

            # Stage 4: Role-Specific Portfolio Projects
            RoadmapStep.objects.create(
                roadmap=roadmap,
                phase="Stage 4: Role-Specific Portfolio Projects",
                title=f"Build a {target_role.title} Portfolio Project",
                description=f"Architect, develop, and deploy an end-to-end project applying {', '.join(req_skills[:3])}. Include automated tests and a live demo.",
                skill_name="Portfolio Project",
                resource_title="Nexora Project Playbook",
                resource_url="https://github.com",
                estimated_duration="3-4 weeks",
                order=step_order,
                is_completed=False,
                verified_by_assessment=False
            )
            step_order += 1

            # Stage 5: Skill Assessments
            RoadmapStep.objects.create(
                roadmap=roadmap,
                phase="Stage 5: Skill Assessments & Coding Labs",
                title=f"Demonstrate Skill Competency via Nexora Assessments",
                description="Prove your hands-on competencies through timed, server-validated multiple choice and technical evaluations.",
                skill_name="Skill Benchmark",
                resource_title="Nexora Assessments",
                resource_url="/assessments",
                estimated_duration="1-2 days",
                order=step_order,
                is_completed=False,
                verified_by_assessment=False
            )
            step_order += 1

            # Stage 6: Technical Interview Preparation
            RoadmapStep.objects.create(
                roadmap=roadmap,
                phase="Stage 6: Technical Interview Preparation",
                title=f"Technical & System Design Interview Drills",
                description=f"Prepare domain-specific algorithm problem solving, live whiteboard questions, and STAR behavioral narratives.",
                skill_name="Interview Readiness",
                resource_title="Technical Interview Guide",
                resource_url="https://neetcode.io/roadmap",
                estimated_duration="2-3 weeks",
                order=step_order,
                is_completed=False,
                verified_by_assessment=False
            )
            step_order += 1

            # Stage 7: Job Readiness & ATS Checklist
            RoadmapStep.objects.create(
                roadmap=roadmap,
                phase="Stage 7: Job Readiness & ATS Checklist",
                title="Targeted Resume Tailoring & ATS Optimization",
                description=f"Scan and align your resume using Nexora's ATS Checker against {target_role.title} job postings.",
                skill_name="ATS Resume Optimization",
                resource_title="Nexora ATS Checker",
                resource_url="/ats-checker",
                estimated_duration="1 week",
                order=step_order,
                is_completed=False,
                verified_by_assessment=False
            )

    roadmap.overall_progress = roadmap.calculate_progress()
    roadmap.save()
    return roadmap
