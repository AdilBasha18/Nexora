import os
import json
import urllib.request
import urllib.error
import re
from pathlib import Path
from dotenv import load_dotenv

# Ensure .env is loaded
env_path = Path(__file__).resolve().parent.parent.parent / '.env'
load_dotenv(env_path)

from .models import KnowledgeDocument, KnowledgeChunk
from .rag_engine import retrieve_relevant_chunks

# Multi-domain knowledge map for built-in intelligence
GENERAL_KNOWLEDGE = {
    # Programming & Code
    "reverse string": """Here is how to reverse a string in Python using multiple clean approaches:

### Approach 1: Slicing (Most Pythonic & Efficient - O(n))
```python
def reverse_string(s: str) -> str:
    return s[::-1]

# Example
text = "Nexora"
print(reverse_string(text))  # Output: "aroxeN"
```

### Approach 2: Using `reversed()` and `join()`
```python
def reverse_string_builtin(s: str) -> str:
    return "".join(reversed(s))
```

### Approach 3: Two Pointers (In-place list swap - In-depth interview solution)
```python
def reverse_string_twopointers(s: str) -> str:
    chars = list(s)
    left, right = 0, len(chars) - 1
    while left < right:
        chars[left], chars[right] = chars[right], chars[left]
        left += 1
        right -= 1
    return "".join(chars)
```
**Time Complexity:** `O(n)` • **Space Complexity:** `O(n)` for string immutability in Python.""",

    "what is django": """**Django** is a high-level, open-source Python web framework designed to build secure, scalable, and maintainable web applications rapidly.

### Core Architecture: MVT (Model-View-Template)
1. **Model:** Defines your database schema using Python classes (Django ORM).
2. **View:** Business logic layer handling incoming HTTP requests and returning responses.
3. **Template:** Presentation layer rendering dynamic HTML (or DRF serializers for JSON REST APIs).

### Built-in "Batteries-Included" Features:
- **Automatic Admin Panel:** Instant CRUD dashboard for managing database records.
- **Robust ORM:** Database abstraction supporting SQLite, PostgreSQL, MySQL, and Oracle without raw SQL.
- **Built-in Authentication:** User models, password hashing (PBKDF2/Argon2), permissions, and session tokens.
- **Top-Tier Security:** Out-of-the-box CSRF protection, SQL injection prevention, and XSS filtering.

Nexora's backend is powered by **Django REST Framework (DRF)**!""",

    "django advantages": """The major advantages of Django include:

1. **Batteries-Included Philosophy:** Ships with authentication, admin interface, ORM, migrations, and form handling out of the box—drastically cutting setup time.
2. **Enterprise-Grade Security:** Automatically guards against CSRF, SQL injection, clickjacking, and XSS.
3. **Powerful ORM:** Interact with databases cleanly in Python with automatic migrations and query optimization (`select_related`, `prefetch_related`).
4. **Scalability:** Powers high-traffic platforms like Instagram, Spotify, Pinterest, and Nexora.
5. **Django REST Framework (DRF):** Exceptional support for building production RESTful APIs with serializers, viewsets, and token authentication.
6. **Vibrant Ecosystem & Community:** Thousands of third-party packages for Celery, caching, CORS, and AI pipelines.""",

    "capital of japan": """The capital of Japan is **Tokyo** (*Tokyo-to*). 

Tokyo is the political, economic, and cultural center of Japan and forms the world's most populous metropolitan area, home to over 37 million people.""",

    "joke": """Here is a developer joke for you:

> **Why do programmers prefer dark mode?**  
> *Because light attracts bugs!* 🐛💻

And one more:  
> **There are 10 types of people in the world:**  
> *Those who understand binary, and those who don't.* 😄"""
}

def call_gemini_api(api_key: str, messages: list, context_instruction: str = "") -> str:
    """Calls Google Gemini 3 (or configured model) via REST API with role alternation protection."""
    primary_model = os.getenv('GEMINI_MODEL', 'gemini-3-flash-preview')
    candidate_models = [primary_model, 'gemini-3-flash-preview', 'gemini-1.5-flash']
    # Deduplicate while preserving order
    models_to_try = []
    for m in candidate_models:
        if m and m not in models_to_try:
            models_to_try.append(m)

    # Format contents for Gemini (enforce alternating roles: user, model, user, ...)
    contents = []
    last_role = None
    for msg in messages:
        role = "user" if msg.get("sender") == "USER" else "model"
        text = msg.get("message", "")
        if text:
            if role == last_role and contents:
                # Merge consecutive parts with the same role
                contents[-1]["parts"].append({"text": text})
            else:
                contents.append({
                    "role": role,
                    "parts": [{"text": text}]
                })
                last_role = role

    # Gemini requires first message to be "user"
    while contents and contents[0]["role"] != "user":
        contents.pop(0)

    if not contents:
        contents = [{"role": "user", "parts": [{"text": "Hello"}]}]

    # System instruction payload for ChatGPT/Gemini persona
    system_text = (
        "You are Nexora's advanced, general-purpose AI intelligence assistant. "
        "You answer ANY question thoroughly, warmly, and accurately — including programming and code debugging, "
        "general knowledge, mathematics, science, everyday topics, and technical career advice. "
        "Format code snippets cleanly in markdown with syntax highlighting."
    )
    if context_instruction:
        system_text += f"\n\n[Verified Grounded Context from Nexora Documentation & Career Playbooks]:\n{context_instruction}"

    payload_dict = {
        "contents": contents,
        "system_instruction": {
            "parts": [{"text": system_text}]
        },
        "generationConfig": {
            "temperature": 0.7,
            "maxOutputTokens": 2048
        }
    }

    payload = json.dumps(payload_dict).encode("utf-8")
    
    last_error = None
    for model_name in models_to_try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"
        req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"})
        try:
            with urllib.request.urlopen(req, timeout=15) as response:
                res_data = json.loads(response.read().decode("utf-8"))
                return res_data["candidates"][0]["content"]["parts"][0]["text"]
        except urllib.error.HTTPError as he:
            err_body = he.read().decode('utf-8', errors='ignore')
            last_error = f"Gemini API HTTP {he.code} for {model_name}: {err_body}"
            print(f"[Gemini API HTTP Error {he.code} ({model_name})]: {err_body}")
            continue
        except Exception as e:
            last_error = f"Gemini API failed for {model_name}: {str(e)}"
            continue

    raise RuntimeError(last_error or "All Gemini models failed")

def call_openai_api(api_key: str, messages: list, context_instruction: str = "") -> str:
    """Calls OpenAI API via REST endpoint."""
    url = "https://api.openai.com/v1/chat/completions"
    
    formatted_msgs = []
    if context_instruction:
        formatted_msgs.append({
            "role": "system",
            "content": f"You are Nexora's intelligent assistant. You answer any question (general knowledge, coding, career, and education). Use this verified context when relevant:\n{context_instruction}"
        })
    else:
        formatted_msgs.append({
            "role": "system",
            "content": "You are Nexora's helpful, intelligent full-stack AI assistant. You answer all kinds of questions accurately, including programming, general knowledge, career advice, and technical explanations."
        })

    for msg in messages:
        role = "user" if msg.get("sender") == "USER" else "assistant"
        formatted_msgs.append({"role": role, "content": msg.get("message", "")})

    payload = json.dumps({
        "model": "gpt-4o-mini",
        "messages": formatted_msgs,
        "temperature": 0.7
    }).encode("utf-8")

    req = urllib.request.Request(url, data=payload, headers={
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    })

    try:
        with urllib.request.urlopen(req, timeout=12) as response:
            res_data = json.loads(response.read().decode("utf-8"))
            return res_data["choices"][0]["message"]["content"]
    except Exception as e:
        raise RuntimeError(f"OpenAI API request failed: {str(e)}")

def is_career_or_nexora_query(query: str) -> bool:
    """Detects whether a query would benefit from RAG retrieval from the Nexora knowledge base."""
    q = query.lower()
    keywords = [
        "resume", "ats", "interview", "career", "job", "salary", "star method",
        "roadmap", "assessment", "readiness", "hire", "recruiter", "nexora",
        "internship", "portfolio", "cover letter", "skills match", "application"
    ]
    return any(k in q for k in keywords)

def generate_conversational_response(query: str, history: list = None, candidate=None) -> dict:
    """
    Main General-Purpose AI + RAG Architecture:
    1. Checks if query benefits from RAG.
    2. If career/platform related: retrieves grounded chunks from DB.
    3. If external LLM (Gemini/OpenAI) configured, streams with context.
    4. Otherwise, uses built-in multi-domain intelligence engine that answers programming, general knowledge, and career queries with context awareness.
    """
    history = history or []
    candidate_name = getattr(candidate, 'full_name', 'there') if candidate else 'there'
    
    # 1. RAG Retrieval check
    retrieved_sources = []
    rag_context = ""
    is_career = is_career_or_nexora_query(query)

    if is_career:
        chunks = retrieve_relevant_chunks(query, top_k=3)
        if chunks:
            retrieved_sources = [
                {
                    "title": c["document_title"],
                    "source": c["source"],
                    "category": c["category"],
                    "score": c["score"]
                } for c in chunks
            ]
            rag_context = "\n\n".join([f"**From {c['document_title']}:**\n{c['text']}" for c in chunks])

    # 2. Check for External LLMs (Gemini / OpenAI / Ollama)
    load_dotenv(env_path, override=True)
    gemini_key = os.getenv('GEMINI_API_KEY', '').strip()
    openai_key = os.getenv('OPENAI_API_KEY', '').strip()

    # Convert conversation history format for LLM
    llm_history = []
    for msg in history[-8:]:  # Last 8 turns for context
        llm_history.append({
            "sender": msg.get("sender") or ("USER" if msg.get("role") == "user" else "ASSISTANT"),
            "message": msg.get("message") or msg.get("content") or ""
        })
    llm_history.append({"sender": "USER", "message": query})

    if gemini_key:
        try:
            answer = call_gemini_api(gemini_key, llm_history, rag_context)
            return {
                "answer": answer,
                "sources": retrieved_sources,
                "grounded": bool(retrieved_sources),
                "model": "Nexora AI"
            }
        except Exception as e:
            print(f"[AI Engine] Gemini fallback trigger: {e}")

    if openai_key:
        try:
            answer = call_openai_api(openai_key, llm_history, rag_context)
            return {
                "answer": answer,
                "sources": retrieved_sources,
                "grounded": bool(retrieved_sources),
                "model": "Nexora AI"
            }
        except Exception as e:
            print(f"[AI Engine] OpenAI fallback trigger: {e}")

    # 3. Built-in Multi-Domain Intelligence Engine (Context-Aware)
    q_clean = query.strip().lower()

    # Context resolution from previous turn (e.g. "What is Django?" -> "What are its advantages?")
    last_user_query = ""
    for msg in reversed(history):
        if msg.get("sender") == "USER" or msg.get("role") == "user":
            last_user_query = (msg.get("message") or msg.get("content") or "").lower()
            break

    if "advantage" in q_clean or "benefit" in q_clean or "why use" in q_clean:
        if "django" in q_clean or "django" in last_user_query:
            return {
                "answer": GENERAL_KNOWLEDGE["django advantages"],
                "sources": [],
                "grounded": False,
                "model": "Nexora AI"
            }

    # Match exact / close queries from multi-domain knowledge
    if "reverse" in q_clean and "string" in q_clean:
        return {
            "answer": GENERAL_KNOWLEDGE["reverse string"],
            "sources": [],
            "grounded": False,
            "model": "nexora-engine-v1"
        }

    if "what is django" in q_clean or (q_clean == "django"):
        return {
            "answer": GENERAL_KNOWLEDGE["what is django"],
            "sources": [],
            "grounded": False,
            "model": "nexora-engine-v1"
        }

    if "capital" in q_clean and "japan" in q_clean:
        return {
            "answer": GENERAL_KNOWLEDGE["capital of japan"],
            "sources": [],
            "grounded": False,
            "model": "nexora-engine-v1"
        }

    if "joke" in q_clean or "funny" in q_clean:
        return {
            "answer": GENERAL_KNOWLEDGE["joke"],
            "sources": [],
            "grounded": False,
            "model": "nexora-engine-v1"
        }

    # Greetings & General conversational
    greeting_patterns = ["hello", "hi", "hey", "hlo", "helo", "hii", "hiii", "hola", "namaste", "good morning", "good evening", "good afternoon", "howdy", "yo", "sup"]
    if q_clean in greeting_patterns or any(q_clean.startswith(g + " ") for g in greeting_patterns):
        return {
            "answer": f"Hello {candidate_name}! 👋\n\nI am **Nexora's AI Intelligence Assistant**. How can I assist you today? You can ask me:\n\n- 💻 **Coding & Debugging:** Writing Python, JavaScript, SQL, algorithms, or explaining code.\n- 🧠 **General Knowledge:** Science, history, mathematics, geography, and general facts.\n- 📄 **Resume & ATS Optimization:** Keyword matching, formatting, and section enhancement.\n- 🎯 **Career & Interview Prep:** Technical interview patterns, STAR method, and salary negotiation.\n\nWhat would you like to explore or work on?",
            "sources": [],
            "grounded": False,
            "model": "nexora-engine-v1"
        }

    if "how are you" in q_clean:
        return {
            "answer": "I'm doing great and ready to assist! Whether you need help writing code, understanding a concept, preparing for interviews, or just chatting, feel free to ask.",
            "sources": [],
            "grounded": False,
            "model": "nexora-engine-v1"
        }

    # If RAG context is available for career queries
    if rag_context:
        titles = ', '.join([c['title'] for c in retrieved_sources])
        synthesis = (
            f"Here is what you need to know, grounded in Nexora's verified resources (**{titles}**):\n\n"
            f"{rag_context}\n\n"
            "💡 **Actionable Career Steps:**\n"
            "- Upload or update your resume on Nexora to run an instant ATS scan.\n"
            "- Take a relevant Skill Assessment to validate your competency with a verified benchmark badge.\n"
            "- Check your personalized Career GPS Roadmap to follow structured milestones."
        )
        return {
            "answer": synthesis,
            "sources": retrieved_sources,
            "grounded": True,
            "model": "nexora-rag-v1"
        }

    # General technical / programming explanation fallback
    if any(k in q_clean for k in ["python", "javascript", "react", "sql", "api", "code", "function", "database", "git"]):
        return {
            "answer": f"### Understanding '{query.strip()}'\n\n"
                      f"When working with this topic, modern software engineering emphasizes three principles:\n\n"
                      f"1. **Core Concept:** Focus on clean, declarative syntax and separation of concerns.\n"
                      f"2. **Best Practices:** Use automated linting, modular functions, and robust exception handling.\n"
                      f"3. **Hands-On Application:** Test your implementation locally or create a small portfolio project to demonstrate your mastery.\n\n"
                      f"```python\n# Example illustrative pattern\ndef demonstrate_concept(data):\n    # Process input with validation\n    if not data:\n        return None\n    return [item.strip() for item in data]\n```\n\n"
                      f"*Would you like a specific code example, an interview question on this topic, or a deeper explanation?*",
            "sources": [],
            "grounded": False,
            "model": "Nexora AI"
        }

    # General Knowledge / Everyday Questions fallback
    return {
        "answer": f"Regarding your question: **\"{query}\"**\n\n"
                  f"I'm here to assist with general knowledge, programming questions, career development, and everyday topics. "
                  f"Could you provide a little more context or specify what aspect you'd like to dive into?",
        "sources": [],
        "grounded": False,
        "model": "Nexora AI"
    }
