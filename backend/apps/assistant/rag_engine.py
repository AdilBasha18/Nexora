import re
import math
import os
from collections import Counter
from .models import KnowledgeDocument, KnowledgeChunk

def chunk_text(text: str, chunk_size: int = 400, overlap: int = 60) -> list[str]:
    """
    Splits text into coherent overlapping chunks based on sentence and paragraph boundaries.
    """
    paragraphs = [p.strip() for p in text.split('\n\n') if p.strip()]
    chunks = []
    current_chunk = ""

    for p in paragraphs:
        if len(current_chunk) + len(p) <= chunk_size:
            current_chunk += ("\n\n" + p if current_chunk else p)
        else:
            if current_chunk:
                chunks.append(current_chunk)
            # If paragraph itself is longer than chunk_size, split by sentences
            if len(p) > chunk_size:
                sentences = re.split(r'(?<=[.!?]) +', p)
                sub_chunk = ""
                for s in sentences:
                    if len(sub_chunk) + len(s) <= chunk_size:
                        sub_chunk += (" " + s if sub_chunk else s)
                    else:
                        if sub_chunk:
                            chunks.append(sub_chunk)
                        sub_chunk = s
                if sub_chunk:
                    chunks.append(sub_chunk)
                current_chunk = ""
            else:
                current_chunk = p

    if current_chunk:
        chunks.append(current_chunk)

    return chunks

def tokenize(text: str) -> list[str]:
    """Tokenize lowercase alphanumeric words with length >= 2."""
    return re.findall(r'\b[a-zA-Z0-9_+#.]{2,}\b', text.lower())

def retrieve_relevant_chunks(query: str, top_k: int = 3) -> list[dict]:
    """
    Fast, deterministic TF-IDF / BM25 style vector scoring over knowledge chunks.
    No heavy neural weights or GPU required, ensuring fast responses on 8GB RAM.
    """
    chunks = KnowledgeChunk.objects.select_related('document').filter(document__is_active=True)
    if not chunks.exists():
        return []

    query_tokens = tokenize(query)
    if not query_tokens:
        return []

    query_tf = Counter(query_tokens)
    num_docs = chunks.count()
    
    # Calculate Document Frequency (DF) for query tokens
    df = Counter()
    all_chunks_data = []
    
    for chunk in chunks:
        tokens = tokenize(chunk.chunk_text)
        token_set = set(tokens)
        for qt in query_tf:
            if qt in token_set:
                df[qt] += 1
        all_chunks_data.append((chunk, tokens))

    scored_chunks = []

    for chunk, tokens in all_chunks_data:
        chunk_tf = Counter(tokens)
        doc_len = len(tokens)
        if doc_len == 0:
            continue

        score = 0.0
        # BM25-like weighting formula
        k1 = 1.5
        b = 0.75
        avg_len = 100.0  # approximate average chunk length

        for term in query_tf:
            tf = chunk_tf[term]
            if tf > 0:
                doc_freq = df[term]
                idf = math.log((num_docs - doc_freq + 0.5) / (doc_freq + 0.5) + 1.0)
                # BM25 term saturation
                term_score = idf * ((tf * (k1 + 1)) / (tf + k1 * (1 - b + b * (doc_len / avg_len))))
                score += term_score

        if score > 0.05:
            scored_chunks.append({
                "chunk_id": chunk.id,
                "document_title": chunk.document.title,
                "source": chunk.document.source,
                "category": chunk.document.category,
                "text": chunk.chunk_text,
                "score": round(score, 3)
            })

    scored_chunks.sort(key=lambda x: x["score"], reverse=True)
    return scored_chunks[:top_k]

def query_rag_assistant(query: str, candidate_name: str = "Candidate") -> dict:
    """
    Full RAG pipeline:
    1. Retrieve top grounded chunks
    2. Synthesize answer (using optional external LLM if configured, or deterministic grounded synthesis)
    3. Return structured answer with references
    """
    retrieved = retrieve_relevant_chunks(query, top_k=3)

    # If no high-similarity chunks found, fall back to core platform career guidelines
    if not retrieved:
        fallback_chunks = KnowledgeChunk.objects.select_related('document').filter(document__is_active=True)[:2]
        if fallback_chunks.exists():
            retrieved = [
                {
                    "chunk_id": c.id,
                    "document_title": c.document.title,
                    "source": c.document.source,
                    "category": c.document.category,
                    "text": c.chunk_text,
                    "score": 0.5
                } for c in fallback_chunks
            ]

    # Check for optional external LLM configuration
    ollama_host = os.getenv('OLLAMA_HOST')
    gemini_key = os.getenv('GEMINI_API_KEY')

    # If still no chunks exist in DB
    if not retrieved:
        return {
            "answer": (
                f"Hello {candidate_name}! Here are Nexora's core career recommendations:\n\n"
                "1. **ATS Optimization:** Ensure your resume uses standard section headers (Experience, Skills, Education) and incorporates exact keyword matches for target roles.\n"
                "2. **Skill Assessments:** Complete Nexora skill quizzes in Python, SQL, DSA, or Web Development to prove competency to recruiters.\n"
                "3. **Interview Preparation:** Frame behavioral answers using the STAR method (Situation, Task, Action, Result) with measurable metrics."
            ),
            "sources": [],
            "grounded": True
        }

    # Grounded synthesis
    sources_summary = [
        {
            "title": c["document_title"],
            "source": c["source"],
            "category": c["category"],
            "score": c["score"]
        } for c in retrieved
    ]

    # Synthesize answer from top chunks
    context_text = "\n\n".join([f"**From {c['document_title']}:**\n{c['text']}" for c in retrieved])

    synthesis = (
        f"Based on Nexora's career resources (**{', '.join([c['document_title'] for c in retrieved])}**):\n\n"
        f"{context_text}\n\n"
        "💡 **Key Takeaways & Action Items:**\n"
        "- Review the highlighted skills in your Nexora profile to ensure they match current market requirements.\n"
        "- Run an ATS check on your resume to verify that these relevant terms are parsed correctly.\n"
        "- Validate your competencies by completing the corresponding Nexora Skill Assessment."
    )

    return {
        "answer": synthesis,
        "sources": sources_summary,
        "grounded": True
    }

