"""
Seeder script for 14 New Trending Skill Assessment Courses
Includes 5 MCQs and 5 Real Coding Challenges (Python & Java) for each course.
Duration: 60 minutes.
"""

import os
import sys
import django

# Setup Django environment
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), 'apps'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from assessments.models import Assessment, AssessmentCategory, Question

COURSES_DATA = [
    # 1. Agentic AI & Autonomous Multi-Agent Frameworks
    {
        "title": "Agentic AI & Autonomous Multi-Agent Frameworks",
        "category_name": "Agentic AI & Intelligent Agents",
        "category_icon": "Bot",
        "description": "Comprehensive evaluation of multi-agent architectures, tool-calling protocols, ReAct reasoning loops, agent state persistence, and self-correcting autonomous workflows.",
        "difficulty": "ADVANCED",
        "duration_minutes": 60,
        "questions": [
            {
                "question_type": "mcq",
                "title": "ReAct Reasoning Pattern",
                "question_text": "In autonomous agent architecture, what is the core mechanism of the ReAct (Reason + Act) prompting paradigm?",
                "options": [
                    "It executes fine-tuning gradients after every single user query",
                    "It interleaves chain-of-thought reasoning steps with environment action invocations and observations",
                    "It restricts the model to deterministic regex token matching",
                    "It replaces vector search with recurrent neural network memory"
                ],
                "correct_option_index": 1,
                "explanation": "ReAct (Yao et al.) enables agents to generate reasoning traces ('Thoughts') alongside task-specific actions ('Action') and observe execution output ('Observation') iteratively."
            },
            {
                "question_type": "mcq",
                "title": "Agent Tool Calling Protocols",
                "question_text": "When an LLM agent invokes an external tool via structured output (e.g. JSON schema), what role does the runtime engine play?",
                "options": [
                    "It compiles the tool definition into WebAssembly",
                    "It parses the model's function arguments, executes the local or remote tool handler, and returns the result as an environment observation",
                    "It automatically modifies the LLM's transformer weights",
                    "It terminates the conversation turn immediately without returning data"
                ],
                "correct_option_index": 1,
                "explanation": "The runtime inspects the tool call emitted by the LLM, validates parameters against the schema, executes the function, and injects the output back into the message sequence."
            },
            {
                "question_type": "mcq",
                "title": "Stateful Agent Graphs (e.g. LangGraph)",
                "question_text": "Why are graph-based state machine abstractions preferred over linear chains for complex multi-agent systems?",
                "options": [
                    "Linear chains do not support API keys",
                    "Graph architectures allow cycles, conditional branching, human-in-the-loop pauses, and distributed multi-agent handoffs",
                    "Graphs eliminate the need for an underlying LLM",
                    "Graphs run exclusively on client-side browser JavaScript"
                ],
                "correct_option_index": 1,
                "explanation": "State graphs represent cyclic agent interaction loops, allowing dynamic self-correction, parallel agent tasks, and checkpointed state resumption."
            },
            {
                "question_type": "mcq",
                "title": "Agent Reflection & Self-Correction",
                "question_text": "What is the primary benefit of adding a 'Critic / Reflection' agent node in an agentic workflow?",
                "options": [
                    "It reduces LLM token consumption to zero",
                    "It inspects generated artifacts (such as code or SQL) against constraints or tests, providing corrective feedback before final user delivery",
                    "It encrypts database connection strings",
                    "It prevents the user from canceling running background tasks"
                ],
                "correct_option_index": 1,
                "explanation": "Reflection architectures (e.g., Reflexion) evaluate outputs against rubrics or unit tests, feeding actionable critique back to the generator agent to fix errors."
            },
            {
                "question_type": "mcq",
                "title": "Context Window Drift & Compaction",
                "question_text": "In multi-turn autonomous agent sessions, how should long execution histories be managed to prevent context overflow?",
                "options": [
                    "Delete all previous system prompts permanently",
                    "Apply sliding-window conversation pruning or semantic LLM summary compaction on older observations",
                    "Force the LLM to output only 1 character per turn",
                    "Restart the operating system process every minute"
                ],
                "correct_option_index": 1,
                "explanation": "Summarization and message buffer compaction compress historic execution traces into high-density state representations without losing essential context."
            },
            # 5 Coding Challenges
            {
                "question_type": "code",
                "title": "ReAct Action Extractor",
                "difficulty": "Easy",
                "function_name": "extract_action",
                "function_name_java": "extractAction",
                "question_text": "Given an agent thought string containing 'Action: <tool_name>' and 'Action Input: <input_text>', extract and return a list of two strings: [tool_name, input_text]. If either marker is missing, return an empty list []. Both markers are case-sensitive and end at the line break or end of text.",
                "input_format": "A single string `trace`",
                "output_format": "List of strings `[tool_name, input_text]`",
                "constraints": "1 <= len(trace) <= 1000",
                "examples": [
                    {"input": "trace = 'Thought: Need weather.\\nAction: get_weather\\nAction Input: San Francisco'", "output": "['get_weather', 'San Francisco']"}
                ],
                "starter_code": "def extract_action(trace: str) -> list:\n    # Return [tool_name, input_str] or []\n    pass\n",
                "starter_code_java": "import java.util.*;\n\npublic class Solution {\n    public String[] extractAction(String trace) {\n        // Return new String[]{tool, input} or new String[0]\n        return new String[0];\n    }\n}\n",
                "sample_test_cases": [
                    {"inputs": ["Thought: I should search.\\nAction: web_search\\nAction Input: Nexora platform"], "expected": ["web_search", "Nexora platform"]},
                    {"inputs": ["Thought: Only thinking here, no tool."], "expected": []}
                ],
                "test_cases": [
                    {"inputs": ["Thought: I should search.\\nAction: web_search\\nAction Input: Nexora platform"], "expected": ["web_search", "Nexora platform"]},
                    {"inputs": ["Thought: Only thinking here, no tool."], "expected": []},
                    {"inputs": ["Action: calculate_sum\\nAction Input: 10 + 25"], "expected": ["calculate_sum", "10 + 25"]},
                    {"inputs": ["Action: run_query"], "expected": []}
                ],
                "explanation": "Search for lines starting with 'Action: ' and 'Action Input: ', strip whitespace, and return both parts."
            },
            {
                "question_type": "code",
                "title": "Agent Token Window Buffer",
                "difficulty": "Medium",
                "function_name": "trim_history",
                "function_name_java": "trimHistory",
                "question_text": "Given an array of message token costs `costs` (where index 0 is oldest) and an integer `max_tokens`, return the index of the first message to keep such that the sum of costs from that index to the end is <= `max_tokens`. If all messages fit, return 0. If no messages fit, return the length of `costs`.",
                "input_format": "List of integers `costs`, integer `max_tokens`",
                "output_format": "Integer start_index",
                "constraints": "1 <= len(costs) <= 10^5, max_tokens >= 0",
                "examples": [
                    {"input": "costs = [100, 200, 150, 300], max_tokens = 450", "output": "2"}
                ],
                "starter_code": "def trim_history(costs: list, max_tokens: int) -> int:\n    pass\n",
                "starter_code_java": "public class Solution {\n    public int trimHistory(int[] costs, int maxTokens) {\n        return 0;\n    }\n}\n",
                "sample_test_cases": [
                    {"inputs": [[100, 200, 150, 300], 450], "expected": 2},
                    {"inputs": [[50, 50, 50], 200], "expected": 0}
                ],
                "test_cases": [
                    {"inputs": [[100, 200, 150, 300], 450], "expected": 2},
                    {"inputs": [[50, 50, 50], 200], "expected": 0},
                    {"inputs": [[500, 400], 200], "expected": 2},
                    {"inputs": [[10, 20, 30, 40], 70], "expected": 2}
                ],
                "explanation": "Iterate backwards accumulating total cost until adding the next item exceeds max_tokens."
            },
            {
                "question_type": "code",
                "title": "Agent Cycle Loop Detector",
                "difficulty": "Medium",
                "function_name": "has_loop",
                "function_name_java": "hasLoop",
                "question_text": "Given a list of executed agent states `states` (e.g. ['search', 'read', 'search', 'read', 'search']), return True (or true) if the last state sequence exhibits an immediate repeated cycle of length k (where 1 <= k <= len(states)/2). That is, the last k elements are identical to the preceding k elements.",
                "input_format": "List of strings `states`",
                "output_format": "Boolean",
                "constraints": "2 <= len(states) <= 100",
                "examples": [
                    {"input": "states = ['plan', 'search', 'read', 'search', 'read']", "output": "True"}
                ],
                "starter_code": "def has_loop(states: list) -> bool:\n    pass\n",
                "starter_code_java": "import java.util.*;\n\npublic class Solution {\n    public boolean hasLoop(String[] states) {\n        return false;\n    }\n}\n",
                "sample_test_cases": [
                    {"inputs": [["plan", "search", "read", "search", "read"]], "expected": True},
                    {"inputs": [["plan", "search", "write", "finish"]], "expected": False}
                ],
                "test_cases": [
                    {"inputs": [["plan", "search", "read", "search", "read"]], "expected": True},
                    {"inputs": [["plan", "search", "write", "finish"]], "expected": False},
                    {"inputs": [["retry", "retry"]], "expected": True},
                    {"inputs": [["a", "b", "c", "a", "b", "c"]], "expected": True}
                ],
                "explanation": "Check for any k from 1 up to len//2 whether states[-k:] == states[-2k:-k]."
            },
            {
                "question_type": "code",
                "title": "Multi-Agent Consensus Voting",
                "difficulty": "Easy",
                "function_name": "consensus_decision",
                "function_name_java": "consensusDecision",
                "question_text": "Given an array of agent voting outputs `votes` (e.g. ['APPROVE', 'REJECT', 'APPROVE']), return the candidate with the strict majority (> len/2). If no candidate has a strict majority, return 'NO_CONSENSUS'.",
                "input_format": "List of strings `votes`",
                "output_format": "String winning vote or 'NO_CONSENSUS'",
                "constraints": "1 <= len(votes) <= 10^4",
                "examples": [
                    {"input": "votes = ['PASS', 'FAIL', 'PASS']", "output": "'PASS'"}
                ],
                "starter_code": "def consensus_decision(votes: list) -> str:\n    pass\n",
                "starter_code_java": "import java.util.*;\n\npublic class Solution {\n    public String consensusDecision(String[] votes) {\n        return \"NO_CONSENSUS\";\n    }\n}\n",
                "sample_test_cases": [
                    {"inputs": [["PASS", "FAIL", "PASS"]], "expected": "PASS"},
                    {"inputs": [["YES", "NO"]], "expected": "NO_CONSENSUS"}
                ],
                "test_cases": [
                    {"inputs": [["PASS", "FAIL", "PASS"]], "expected": "PASS"},
                    {"inputs": [["YES", "NO"]], "expected": "NO_CONSENSUS"},
                    {"inputs": [["ACCEPT", "ACCEPT", "ACCEPT"]], "expected": "ACCEPT"},
                    {"inputs": [["A", "B", "C", "A"]], "expected": "NO_CONSENSUS"}
                ],
                "explanation": "Count frequencies with a map; check if max count exceeds len/2."
            },
            {
                "question_type": "code",
                "title": "Tool Registry Invocation Dispatcher",
                "difficulty": "Medium",
                "function_name": "dispatch_tools",
                "function_name_java": "dispatchTools",
                "question_text": "Given an array of registered valid tool names `available_tools` and an array of requested tool calls `requested_calls`, return a list of valid requested calls in their original order that exist in `available_tools`. Filter out unknown tools.",
                "input_format": "List of strings `available_tools`, List of strings `requested_calls`",
                "output_format": "List of strings valid calls",
                "constraints": "1 <= len(available_tools), len(requested_calls) <= 10^3",
                "examples": [
                    {"input": "available = ['calc', 'search'], requested = ['calc', 'hack', 'search']", "output": "['calc', 'search']"}
                ],
                "starter_code": "def dispatch_tools(available_tools: list, requested_calls: list) -> list:\n    pass\n",
                "starter_code_java": "import java.util.*;\n\npublic class Solution {\n    public String[] dispatchTools(String[] availableTools, String[] requestedCalls) {\n        return new String[0];\n    }\n}\n",
                "sample_test_cases": [
                    {"inputs": [["calc", "search"], ["calc", "hack", "search"]], "expected": ["calc", "search"]},
                    {"inputs": [["git"], ["docker", "k8s"]], "expected": []}
                ],
                "test_cases": [
                    {"inputs": [["calc", "search"], ["calc", "hack", "search"]], "expected": ["calc", "search"]},
                    {"inputs": [["git"], ["docker", "k8s"]], "expected": []},
                    {"inputs": [["db_read", "db_write"], ["db_read", "db_read", "delete_all"]], "expected": ["db_read", "db_read"]},
                    {"inputs": [["a", "b", "c"], ["a", "b", "c"]], "expected": ["a", "b", "c"]}
                ],
                "explanation": "Convert available tools to a hash set and filter requested calls in linear time."
            }
        ]
    },

    # 2. Retrieval-Augmented Generation (RAG) Architecture
    {
        "title": "Retrieval-Augmented Generation (RAG) Systems",
        "category_name": "Generative AI & RAG",
        "category_icon": "Sparkles",
        "description": "Production RAG evaluation covering dense vector indexing, hybrid keyword-vector search, chunking boundaries, cross-encoder re-ranking, and context hallucination mitigation.",
        "difficulty": "ADVANCED",
        "duration_minutes": 60,
        "questions": [
            {
                "question_type": "mcq",
                "title": "Dense vs Sparse Retrieval",
                "question_text": "What is the primary advantage of combining sparse keyword retrieval (e.g. BM25) with dense embeddings (e.g. bi-encoders) in Hybrid Search?",
                "options": [
                    "Sparse retrieval eliminates the need for vector storage",
                    "Dense retrieval captures semantic intent while sparse retrieval accurately preserves exact keyword tokens like product SKUs or error codes",
                    "It reduces database queries by 50%",
                    "Sparse search converts text into image pixels"
                ],
                "correct_option_index": 1,
                "explanation": "Dense vectors can miss out-of-vocabulary acronyms, part numbers, or exact keywords; hybrid search pairs semantic embeddings with BM25 inverted indices."
            },
            {
                "question_type": "mcq",
                "title": "Reciprocal Rank Fusion (RRF)",
                "question_text": "How does Reciprocal Rank Fusion (RRF) combine ranking results from different retrieval algorithms without calibrated probability scores?",
                "options": [
                    "It multiplies the vector dot products directly",
                    "It assigns each document a score equal to the reciprocal of its rank plus a constant k (1 / (k + rank)), summing across lists",
                    "It chooses whichever algorithm finished first in milliseconds",
                    "It discards all results except the first document in list A"
                ],
                "correct_option_index": 1,
                "explanation": "RRF (Cormack et al.) relies purely on relative rankings rather than raw scores: score(d) = sum(1 / (k + rank_i(d))), making it robust across disparate score distributions."
            },
            {
                "question_type": "mcq",
                "title": "Chunking Chunk Size vs Overlap",
                "question_text": "Why is sliding window overlap (e.g., 500-token chunks with 50-token overlap) critical during document ingestion in RAG?",
                "options": [
                    "It prevents sentences and semantic context from being severed right at arbitrary chunk boundary cuts",
                    "It doubles the vector database capacity automatically",
                    "It compresses text files into zip format",
                    "It prevents OCR engines from reading PDF files"
                ],
                "correct_option_index": 0,
                "explanation": "Without overlap, vital entity relationships that span the chunk split point lose their surrounding semantic context."
            },
            {
                "question_type": "mcq",
                "title": "Lost in the Middle Phenomenon",
                "question_text": "According to research on LLM context attention ('Lost in the Middle'), where should the most critical retrieved evidence be placed in the prompt?",
                "options": [
                    "Exclusively in the exact dead center of a 32k prompt",
                    "At the very beginning or end of the context block, where attention weights are strongest",
                    "In the user's username field",
                    "In the response stop sequence"
                ],
                "correct_option_index": 1,
                "explanation": "Liu et al. proved that standard transformer self-attention exhibits a U-shaped accuracy curve: information in the middle of long prompts experiences lower recall."
            },
            {
                "question_type": "mcq",
                "title": "Cross-Encoder Re-Ranking",
                "question_text": "Why are cross-encoders used primarily for re-ranking top-K candidates rather than searching millions of documents directly?",
                "options": [
                    "Cross-encoders cannot process English text",
                    "Cross-encoders jointly pass query and document through all attention layers (O(N) inference cost), which is too slow for first-stage search but yields superior relevance for top candidates",
                    "Cross-encoders require GPU memory in petabytes",
                    "Cross-encoders are only compatible with SQLite"
                ],
                "correct_option_index": 1,
                "explanation": "Bi-encoders compute document embeddings offline for fast sub-millisecond vector indexing; cross-encoders compare query-document pairs on the fly for high-precision re-ranking."
            },
            # 5 Coding Challenges
            {
                "question_type": "code",
                "title": "Sliding Window Document Chunker",
                "difficulty": "Easy",
                "function_name": "chunk_document",
                "function_name_java": "chunkDocument",
                "question_text": "Given a list of words `tokens`, a chunk size `size`, and a step size `step`, return a list of chunk token arrays. Each chunk has at most `size` tokens starting at indices 0, step, 2*step, etc., until the end of `tokens`.",
                "input_format": "List of strings `tokens`, int `size`, int `step`",
                "output_format": "List of lists of strings",
                "constraints": "1 <= len(tokens) <= 1000, 1 <= step <= size <= 100",
                "examples": [
                    {"input": "tokens = ['a', 'b', 'c', 'd', 'e'], size = 3, step = 2", "output": "[['a', 'b', 'c'], ['c', 'd', 'e'], ['e']]"}
                ],
                "starter_code": "def chunk_document(tokens: list, size: int, step: int) -> list:\n    pass\n",
                "starter_code_java": "import java.util.*;\n\npublic class Solution {\n    public List<List<String>> chunkDocument(String[] tokens, int size, int step) {\n        return new ArrayList<>();\n    }\n}\n",
                "sample_test_cases": [
                    {"inputs": [["a", "b", "c", "d", "e"], 3, 2], "expected": [["a", "b", "c"], ["c", "d", "e"], ["e"]]},
                    {"inputs": [["x", "y"], 2, 2], "expected": [["x", "y"]]}
                ],
                "test_cases": [
                    {"inputs": [["a", "b", "c", "d", "e"], 3, 2], "expected": [["a", "b", "c"], ["c", "d", "e"], ["e"]]},
                    {"inputs": [["x", "y"], 2, 2], "expected": [["x", "y"]]},
                    {"inputs": [["1", "2", "3", "4"], 2, 1], "expected": [["1", "2"], ["2", "3"], ["3", "4"], ["4"]]},
                    {"inputs": [["a"], 5, 2], "expected": [["a"]]}
                ],
                "explanation": "Iterate index i from 0 with increment step, slicing tokens[i : i + size]."
            },
            {
                "question_type": "code",
                "title": "Cosine Similarity Vector Matcher",
                "difficulty": "Medium",
                "function_name": "cosine_similarity_top1",
                "function_name_java": "cosineSimilarityTop1",
                "question_text": "Given a query vector `query` of length D and a list of document vectors `docs` (each of length D), return the index of the document with the highest dot product. Assume all vectors are already normalized unit vectors (magnitude = 1.0). If docs is empty, return -1.",
                "input_format": "List of floats `query`, List of lists of floats `docs`",
                "output_format": "Integer index of best match",
                "constraints": "1 <= D <= 100, 1 <= len(docs) <= 1000",
                "examples": [
                    {"input": "query = [1.0, 0.0], docs = [[0.0, 1.0], [0.8, 0.6]]", "output": "1"}
                ],
                "starter_code": "def cosine_similarity_top1(query: list, docs: list) -> int:\n    pass\n",
                "starter_code_java": "import java.util.*;\n\npublic class Solution {\n    public int cosineSimilarityTop1(double[] query, double[][] docs) {\n        return -1;\n    }\n}\n",
                "sample_test_cases": [
                    {"inputs": [[1.0, 0.0], [[0.0, 1.0], [0.8, 0.6]]], "expected": 1},
                    {"inputs": [[0.5, 0.5], [[0.5, 0.5]]], "expected": 0}
                ],
                "test_cases": [
                    {"inputs": [[1.0, 0.0], [[0.0, 1.0], [0.8, 0.6]]], "expected": 1},
                    {"inputs": [[0.5, 0.5], [[0.5, 0.5]]], "expected": 0},
                    {"inputs": [[0.0, 1.0], [[1.0, 0.0], [0.707, 0.707], [-1.0, 0.0]]], "expected": 1},
                    {"inputs": [[1.0], [[-1.0], [0.5], [1.0]]], "expected": 2}
                ],
                "explanation": "Compute sum(q[i] * doc[i]) for each doc and find the index with the maximum score."
            },
            {
                "question_type": "code",
                "title": "Top-K Deduplicator",
                "difficulty": "Easy",
                "function_name": "dedup_top_k",
                "function_name_java": "dedupTopK",
                "question_text": "Given a list of retrieved document IDs `doc_ids` (which may contain duplicates from multiple search indices) and an integer `k`, return a list of up to `k` unique document IDs in the order they first appeared.",
                "input_format": "List of integers `doc_ids`, int `k`",
                "output_format": "List of integers",
                "constraints": "1 <= len(doc_ids) <= 10^4, k >= 1",
                "examples": [
                    {"input": "doc_ids = [101, 102, 101, 103, 102], k = 3", "output": "[101, 102, 103]"}
                ],
                "starter_code": "def dedup_top_k(doc_ids: list, k: int) -> list:\n    pass\n",
                "starter_code_java": "import java.util.*;\n\npublic class Solution {\n    public int[] dedupTopK(int[] docIds, int k) {\n        return new int[0];\n    }\n}\n",
                "sample_test_cases": [
                    {"inputs": [[101, 102, 101, 103, 102], 3], "expected": [101, 102, 103]},
                    {"inputs": [[1, 2, 3], 2], "expected": [1, 2]}
                ],
                "test_cases": [
                    {"inputs": [[101, 102, 101, 103, 102], 3], "expected": [101, 102, 103]},
                    {"inputs": [[1, 2, 3], 2], "expected": [1, 2]},
                    {"inputs": [[5, 5, 5, 5], 2], "expected": [5]},
                    {"inputs": [[4, 3, 2, 1], 10], "expected": [4, 3, 2, 1]}
                ],
                "explanation": "Use a set to track seen IDs and collect unvisited ones until reaching size k."
            },
            {
                "question_type": "code",
                "title": "Context Window Token Budget Trimmer",
                "difficulty": "Medium",
                "function_name": "budget_context",
                "function_name_java": "budgetContext",
                "question_text": "Given a list of document strings `docs` and an integer `max_chars`, build a single combined context string by joining docs with ' \\n\\n ' such that the total length of the final string does not exceed `max_chars`. Include documents in order; stop before adding a document that would cause the combined length to exceed `max_chars`.",
                "input_format": "List of strings `docs`, integer `max_chars`",
                "output_format": "String combined context",
                "constraints": "1 <= len(docs) <= 100, max_chars >= 0",
                "examples": [
                    {"input": "docs = ['Doc A', 'Doc B'], max_chars = 15", "output": "'Doc A \\n\\n Doc B'"}
                ],
                "starter_code": "def budget_context(docs: list, max_chars: int) -> str:\n    pass\n",
                "starter_code_java": "import java.util.*;\n\npublic class Solution {\n    public String budgetContext(String[] docs, int maxChars) {\n        return \"\";\n    }\n}\n",
                "sample_test_cases": [
                    {"inputs": [["Doc A", "Doc B"], 15], "expected": "Doc A \n\n Doc B"},
                    {"inputs": [["Very Long Document Exceeding Limit"], 10], "expected": ""}
                ],
                "test_cases": [
                    {"inputs": [["Doc A", "Doc B"], 15], "expected": "Doc A \n\n Doc B"},
                    {"inputs": [["Very Long Document Exceeding Limit"], 10], "expected": ""},
                    {"inputs": [["A", "B", "C"], 6], "expected": "A \n\n B"},
                    {"inputs": [["First"], 5], "expected": "First"}
                ],
                "explanation": "Accumulate docs into a list, checking if candidate string length <= max_chars."
            },
            {
                "question_type": "code",
                "title": "Reciprocal Rank Fusion Scorer",
                "difficulty": "Hard",
                "function_name": "rrf_score_top",
                "function_name_java": "rrfScoreTop",
                "question_text": "Given two lists of document IDs `list_a` and `list_b` representing rankings from two search engines (index 0 is rank 1), calculate the RRF score for each unique document as: score(doc) = 1.0 / (60 + rank_a) + 1.0 / (60 + rank_b), where rank is 1-based index (if a document does not appear in a list, its term for that list is 0). Return the document ID with the highest RRF score. In case of tie, return the smaller ID.",
                "input_format": "List of integers `list_a`, List of integers `list_b`",
                "output_format": "Integer document ID",
                "constraints": "1 <= len(list_a), len(list_b) <= 100",
                "examples": [
                    {"input": "list_a = [10, 20], list_b = [20, 30]", "output": "20"}
                ],
                "starter_code": "def rrf_score_top(list_a: list, list_b: list) -> int:\n    pass\n",
                "starter_code_java": "import java.util.*;\n\npublic class Solution {\n    public int rrfScoreTop(int[] listA, int[] listB) {\n        return -1;\n    }\n}\n",
                "sample_test_cases": [
                    {"inputs": [[10, 20], [20, 30]], "expected": 20},
                    {"inputs": [[100], [200]], "expected": 100}
                ],
                "test_cases": [
                    {"inputs": [[10, 20], [20, 30]], "expected": 20},
                    {"inputs": [[100], [200]], "expected": 100},
                    {"inputs": [[5, 6, 7], [7, 5, 6]], "expected": 5},
                    {"inputs": [[1], [1]], "expected": 1}
                ],
                "explanation": "Calculate 1.0 / (60 + rank) for each list, sum per document ID, and find the maximum."
            }
        ]
    },

    # 3. MLOps & Production Model Monitoring
    {
        "title": "MLOps & Production Model Monitoring",
        "category_name": "MLOps & Production Machine Learning",
        "category_icon": "Activity",
        "description": "Production machine learning lifecycle skills: feature stores, data drift detection (PSI/KS-test), canary deployment routing, automated retraining triggers, and SLA latency benchmarks.",
        "difficulty": "ADVANCED",
        "duration_minutes": 60,
        "questions": [
            {
                "question_type": "mcq",
                "title": "Concept Drift vs Data Drift",
                "question_text": "What is the key difference between Covariate (Data) Drift and Concept Drift in production ML?",
                "options": [
                    "Concept drift only occurs with convolutional neural networks",
                    "Data drift is a shift in feature distribution P(X) while P(Y|X) remains constant; concept drift is a shift in the conditional probability relationship P(Y|X)",
                    "Data drift means the hard drive is full",
                    "Concept drift means the server IP address changed"
                ],
                "correct_option_index": 1,
                "explanation": "In data drift, input features change (e.g. demographic shift). In concept drift, the real-world definition of the target changes (e.g. purchasing habits changing during a pandemic)."
            },
            {
                "question_type": "mcq",
                "title": "Population Stability Index (PSI)",
                "question_text": "In model drift monitoring, what does a Population Stability Index (PSI) value above 0.25 typically signify?",
                "options": [
                    "The model has 100% accuracy",
                    "A significant distribution shift between baseline reference and production inference data, indicating an urgent need for model investigation or retraining",
                    "The dataset contains zero missing values",
                    "The GPU temperature is within normal limits"
                ],
                "correct_option_index": 1,
                "explanation": "Standard PSI thresholds: PSI < 0.10 means no significant change; 0.10 to 0.25 indicates moderate drift; PSI > 0.25 indicates significant shift."
            },
            {
                "question_type": "mcq",
                "title": "Feature Stores (Offline vs Online)",
                "question_text": "What primary purpose does an enterprise Feature Store (like Feast or Hopsworks) serve?",
                "options": [
                    "To store user passwords in plain text",
                    "To prevent training-serving skew by providing consistent feature definitions and low-latency key-value serving for inference alongside batch historical serving for training",
                    "To replace git version control for frontend code",
                    "To render 3D graphics in modern web browsers"
                ],
                "correct_option_index": 1,
                "explanation": "Feature stores synchronize dual storage engines (e.g., Redis for millisecond online inference and Snowflake/S3 for point-in-time correct batch training)."
            },
            {
                "question_type": "mcq",
                "title": "Shadow Deployment vs Canary Deployment",
                "question_text": "How does a Shadow Deployment of an ML model differ from a Canary Deployment?",
                "options": [
                    "Shadow deployments route live traffic to both versions in parallel but only return the old model's prediction to users, with zero user risk",
                    "Shadow deployments delete the existing model immediately",
                    "Canary deployments only run in offline Jupyter notebooks",
                    "There is no operational difference"
                ],
                "correct_option_index": 0,
                "explanation": "Shadow (mirror) mode executes the candidate model on production traffic asynchronously to monitor latency and output stability without exposing end-users to potential regressions."
            },
            {
                "question_type": "mcq",
                "title": "Model Registry Lifecycle States",
                "question_text": "In tools such as MLflow or Weights & Biases, what is the role of the Model Registry?",
                "options": [
                    "To sell models on public e-commerce stores",
                    "To govern model artifacts, lineages, version tags, transition stages (Staging, Production, Archived), and deployment approvals",
                    "To run automated payroll calculation",
                    "To compile Python into CUDA C++ automatically"
                ],
                "correct_option_index": 1,
                "explanation": "A model registry tracks trained weights, metrics, dependencies, and governs promotional transitions from staging to production."
            },
            # 5 Coding Challenges
            {
                "question_type": "code",
                "title": "Rolling P99 Latency Calculator",
                "difficulty": "Medium",
                "function_name": "calc_p99",
                "function_name_java": "calcP99",
                "question_text": "Given an unsorted list of inference response times in milliseconds `latencies`, return the 99th percentile value (nearest-rank method: index = ceil(0.99 * N) - 1 on the sorted array). If latencies is empty, return 0.",
                "input_format": "List of integers `latencies`",
                "output_format": "Integer 99th percentile latency",
                "constraints": "1 <= len(latencies) <= 10^5",
                "examples": [
                    {"input": "latencies = [10, 20, 30, ..., 100 items from 1 to 100]", "output": "99"}
                ],
                "starter_code": "import math\n\ndef calc_p99(latencies: list) -> int:\n    pass\n",
                "starter_code_java": "import java.util.*;\n\npublic class Solution {\n    public int calcP99(int[] latencies) {\n        return 0;\n    }\n}\n",
                "sample_test_cases": [
                    {"inputs": [[10, 20, 30, 40, 50, 60, 70, 80, 90, 100]], "expected": 100},
                    {"inputs": [[5]], "expected": 5}
                ],
                "test_cases": [
                    {"inputs": [[10, 20, 30, 40, 50, 60, 70, 80, 90, 100]], "expected": 100},
                    {"inputs": [[5]], "expected": 5},
                    {"inputs": [[15, 20, 25, 30, 35, 40, 45, 50]], "expected": 50},
                    {"inputs": [[100, 200, 300, 400]], "expected": 400}
                ],
                "explanation": "Sort array and compute index int(math.ceil(0.99 * n)) - 1."
            },
            {
                "question_type": "code",
                "title": "Canary Traffic Splitter",
                "difficulty": "Easy",
                "function_name": "route_traffic",
                "function_name_java": "routeTraffic",
                "question_text": "Given a candidate user ID integer `user_id` and a canary percentage integer `canary_pct` (0 to 100), return 'CANARY' if (user_id % 100) < canary_pct, otherwise return 'BASELINE'.",
                "input_format": "int `user_id`, int `canary_pct`",
                "output_format": "String 'CANARY' or 'BASELINE'",
                "constraints": "user_id >= 0, 0 <= canary_pct <= 100",
                "examples": [
                    {"input": "user_id = 105, canary_pct = 10", "output": "'CANARY'"}
                ],
                "starter_code": "def route_traffic(user_id: int, canary_pct: int) -> str:\n    pass\n",
                "starter_code_java": "public class Solution {\n    public String routeTraffic(int userId, int canaryPct) {\n        return \"BASELINE\";\n    }\n}\n",
                "sample_test_cases": [
                    {"inputs": [105, 10], "expected": "CANARY"},
                    {"inputs": [150, 10], "expected": "BASELINE"}
                ],
                "test_cases": [
                    {"inputs": [105, 10], "expected": "CANARY"},
                    {"inputs": [150, 10], "expected": "BASELINE"},
                    {"inputs": [99, 100], "expected": "CANARY"},
                    {"inputs": [0, 0], "expected": "BASELINE"}
                ],
                "explanation": "Deterministic hashing or modulo partition determines cohort routing."
            },
            {
                "question_type": "code",
                "title": "Binary Classification F1 Score Evaluator",
                "difficulty": "Medium",
                "function_name": "calc_f1",
                "function_name_java": "calcF1",
                "question_text": "Given two arrays of equal length `actual` and `predicted` containing binary labels (0 or 1), calculate and return the F1 score rounded to 2 decimal places. F1 = 2 * (precision * recall) / (precision + recall). If (precision + recall) is 0, return 0.0.",
                "input_format": "List of ints `actual`, List of ints `predicted`",
                "output_format": "Float rounded to 2 decimal places",
                "constraints": "1 <= len(actual) == len(predicted) <= 10^4",
                "examples": [
                    {"input": "actual = [1, 1, 0, 1], predicted = [1, 0, 0, 1]", "output": "0.8"}
                ],
                "starter_code": "def calc_f1(actual: list, predicted: list) -> float:\n    pass\n",
                "starter_code_java": "public class Solution {\n    public double calcF1(int[] actual, int[] predicted) {\n        return 0.0;\n    }\n}\n",
                "sample_test_cases": [
                    {"inputs": [[1, 1, 0, 1], [1, 0, 0, 1]], "expected": 0.8},
                    {"inputs": [[0, 0], [1, 1]], "expected": 0.0}
                ],
                "test_cases": [
                    {"inputs": [[1, 1, 0, 1], [1, 0, 0, 1]], "expected": 0.8},
                    {"inputs": [[0, 0], [1, 1]], "expected": 0.0},
                    {"inputs": [[1, 1, 1], [1, 1, 1]], "expected": 1.0},
                    {"inputs": [[1, 0, 1, 0], [1, 1, 0, 0]], "expected": 0.5}
                ],
                "explanation": "Count TP, FP, FN to derive precision = TP/(TP+FP), recall = TP/(TP+FN), and F1."
            },
            {
                "question_type": "code",
                "title": "Feature Missing Value Imputer",
                "difficulty": "Easy",
                "function_name": "impute_mean",
                "function_name_java": "imputeMean",
                "question_text": "Given a list of floats `values` where -999.0 represents a missing value, replace every -999.0 with the rounded integer mean of all valid (non -999.0) values. If there are no valid values, replace with 0.",
                "input_format": "List of floats `values`",
                "output_format": "List of integers",
                "constraints": "1 <= len(values) <= 1000",
                "examples": [
                    {"input": "values = [10.0, -999.0, 30.0]", "output": "[10, 20, 30]"}
                ],
                "starter_code": "def impute_mean(values: list) -> list:\n    pass\n",
                "starter_code_java": "import java.util.*;\n\npublic class Solution {\n    public int[] imputeMean(double[] values) {\n        return new int[0];\n    }\n}\n",
                "sample_test_cases": [
                    {"inputs": [[10.0, -999.0, 30.0]], "expected": [10, 20, 30]},
                    {"inputs": [[-999.0, -999.0]], "expected": [0, 0]}
                ],
                "test_cases": [
                    {"inputs": [[10.0, -999.0, 30.0]], "expected": [10, 20, 30]},
                    {"inputs": [[-999.0, -999.0]], "expected": [0, 0]},
                    {"inputs": [[100.0, 200.0]], "expected": [100, 200]},
                    {"inputs": [[-999.0, 50.0]], "expected": [50, 50]}
                ],
                "explanation": "Compute mean of valid numbers, round to nearest integer, and impute into sentinel spots."
            },
            {
                "question_type": "code",
                "title": "Distribution Shift Threshold Alert",
                "difficulty": "Easy",
                "function_name": "detect_drift",
                "function_name_java": "detectDrift",
                "question_text": "Given an array of baseline feature means `baseline` and production feature means `production` (equal length), return True if the absolute difference |baseline[i] - production[i]| exceeds `threshold` for any feature i, otherwise return False.",
                "input_format": "List of floats `baseline`, List of floats `production`, float `threshold`",
                "output_format": "Boolean",
                "constraints": "1 <= len(baseline) <= 1000, threshold >= 0.0",
                "examples": [
                    {"input": "baseline = [1.0, 2.0], production = [1.0, 2.5], threshold = 0.4", "output": "True"}
                ],
                "starter_code": "def detect_drift(baseline: list, production: list, threshold: float) -> bool:\n    pass\n",
                "starter_code_java": "public class Solution {\n    public boolean detectDrift(double[] baseline, double[] production, double threshold) {\n        return false;\n    }\n}\n",
                "sample_test_cases": [
                    {"inputs": [[1.0, 2.0], [1.0, 2.5], 0.4], "expected": True},
                    {"inputs": [[1.0, 2.0], [1.1, 2.1], 0.5], "expected": False}
                ],
                "test_cases": [
                    {"inputs": [[1.0, 2.0], [1.0, 2.5], 0.4], "expected": True},
                    {"inputs": [[1.0, 2.0], [1.1, 2.1], 0.5], "expected": False},
                    {"inputs": [[10.0], [15.0], 4.0], "expected": True},
                    {"inputs": [[5.0, 5.0], [5.0, 5.0], 0.0], "expected": False}
                ],
                "explanation": "Check if abs(baseline[i] - production[i]) > threshold for any element."
            }
        ]
    },

    # 4. Data Engineering with Apache Spark & Distributed Pipelines
    {
        "title": "Data Engineering with Apache Spark & Distributed Pipelines",
        "category_name": "Big Data & Distributed Engineering",
        "category_icon": "Database",
        "description": "Distributed computing architecture with Spark: DAG scheduling, shuffle spill prevention, columnar Parquet optimization, watermarking, and streaming window aggregations.",
        "difficulty": "ADVANCED",
        "duration_minutes": 60,
        "questions": [
            {
                "question_type": "mcq",
                "title": "Spark Catalyst Query Optimizer",
                "question_text": "What does the Apache Spark Catalyst Optimizer do during DataFrame transformations?",
                "options": [
                    "It translates high-level DataFrame relational expressions into an optimized physical plan using rules like predicate pushdown and projection pruning",
                    "It replaces all RAM with hard drive swap files",
                    "It converts Scala code into visual diagrams",
                    "It downloads external open source libraries"
                ],
                "correct_option_index": 0,
                "explanation": "Catalyst inspects the query tree, executes analysis, logical optimization (pushing filters directly down to Parquet row groups), and compiles to physical RDD bytecode."
            },
            {
                "question_type": "mcq",
                "title": "Spark Shuffle & Partition Skew",
                "question_text": "What occurs when a Spark query experiences severe data skew on a join key?",
                "options": [
                    "All workers finish in exactly the same millisecond",
                    "A single executor task processes an overwhelmingly large percentage of the dataset, causing OOM errors or straggling stages while other nodes idle",
                    "Spark switches automatically to Single-User Mode",
                    "The JVM garbage collector stops running permanently"
                ],
                "correct_option_index": 1,
                "explanation": "Data skew sends disproportionate partitions to single reducer tasks. Solutions include salting keys or using adaptive query execution (AQE)."
            },
            {
                "question_type": "mcq",
                "title": "Columnar Storage & Predicate Pushdown",
                "question_text": "Why is the Apache Parquet file format significantly faster for analytical queries than JSON or CSV?",
                "options": [
                    "Parquet is written in uncompressed plain text",
                    "Parquet stores data by column with dictionary encoding, enabling readers to skip irrelevant columns entirely and use min/max column statistics to skip whole row groups",
                    "Parquet disables all database indexing",
                    "Parquet files can only be read on single-core laptops"
                ],
                "correct_option_index": 1,
                "explanation": "Columnar layout drastically reduces I/O transfer because analytical aggregations (e.g. SELECT AVG(salary)) only read the salary column bytes."
            },
            {
                "question_type": "mcq",
                "title": "Structured Streaming Watermarks",
                "question_text": "In Spark Structured Streaming, what is the role of a Watermark?",
                "options": [
                    "To print a copyright logo onto generated reports",
                    "To set a limit on how late event-time data can arrive before being discarded, allowing the engine to safely evict old state from memory",
                    "To slow down the ingestion rate artificially",
                    "To enforce SSL encryption on Kafka topics"
                ],
                "correct_option_index": 1,
                "explanation": "Watermarks bound state size in event-time stream processing by defining when an event is too late to update existing aggregation windows."
            },
            {
                "question_type": "mcq",
                "title": "Broadcast Hash Join Optimization",
                "question_text": "When is a Broadcast Hash Join preferred over a standard Shuffle Hash Join in distributed SQL engines?",
                "options": [
                    "When joining two multi-terabyte fact tables",
                    "When one of the joined tables is small enough (e.g. < 10-100MB) to be copied to all executor nodes, eliminating the expensive shuffle phase entirely",
                    "When connecting to MongoDB over HTTP",
                    "When running inside Kubernetes without network cards"
                ],
                "correct_option_index": 1,
                "explanation": "Broadcasting the dimension table avoids an all-to-all network shuffle across cluster nodes."
            },
            # 5 Coding Challenges
            {
                "question_type": "code",
                "title": "Group By Key & Sum Aggregator",
                "difficulty": "Easy",
                "function_name": "group_and_sum",
                "function_name_java": "groupAndSum",
                "question_text": "Given a list of key-value pairs where each element is [key_string, value_int], aggregate and return a sorted list of pairs [key, total_sum] in ascending alphabetical order of keys.",
                "input_format": "List of pairs `records`",
                "output_format": "List of pairs [key, sum]",
                "constraints": "1 <= len(records) <= 10^4",
                "examples": [
                    {"input": "records = [['apple', 5], ['banana', 2], ['apple', 3]]", "output": "[['apple', 8], ['banana', 2]]"}
                ],
                "starter_code": "def group_and_sum(records: list) -> list:\n    pass\n",
                "starter_code_java": "import java.util.*;\n\npublic class Solution {\n    public List<List<Object>> groupAndSum(List<List<Object>> records) {\n        return new ArrayList<>();\n    }\n}\n",
                "sample_test_cases": [
                    {"inputs": [[["apple", 5], ["banana", 2], ["apple", 3]]], "expected": [["apple", 8], ["banana", 2]]},
                    {"inputs": [[["item", 10]]], "expected": [["item", 10]]}
                ],
                "test_cases": [
                    {"inputs": [[["apple", 5], ["banana", 2], ["apple", 3]]], "expected": [["apple", 8], ["banana", 2]]},
                    {"inputs": [[["item", 10]]], "expected": [["item", 10]]},
                    {"inputs": [[["z", 1], ["a", 2], ["z", 3]]], "expected": [["a", 2], ["z", 4]]},
                    {"inputs": [[["x", 0], ["y", -5], ["y", 10]]], "expected": [["x", 0], ["y", 5]]}
                ],
                "explanation": "Use a map/dict to accumulate values by key, then sort by key."
            },
            {
                "question_type": "code",
                "title": "Sliding Window Event Counter",
                "difficulty": "Medium",
                "function_name": "events_in_window",
                "function_name_java": "eventsInWindow",
                "question_text": "Given a sorted list of integer event timestamps `timestamps` and a window duration `window_size`, return the maximum number of events that occurred within any time interval of length `window_size` (i.e. timestamps[j] - timestamps[i] <= window_size).",
                "input_format": "List of integers `timestamps`, int `window_size`",
                "output_format": "Integer max count",
                "constraints": "1 <= len(timestamps) <= 10^5, window_size >= 0",
                "examples": [
                    {"input": "timestamps = [1, 3, 4, 7, 10], window_size = 3", "output": "3"}
                ],
                "starter_code": "def events_in_window(timestamps: list, window_size: int) -> int:\n    pass\n",
                "starter_code_java": "public class Solution {\n    public int eventsInWindow(int[] timestamps, int windowSize) {\n        return 0;\n    }\n}\n",
                "sample_test_cases": [
                    {"inputs": [[1, 3, 4, 7, 10], 3], "expected": 3},
                    {"inputs": [[10, 20, 30], 5], "expected": 1}
                ],
                "test_cases": [
                    {"inputs": [[1, 3, 4, 7, 10], 3], "expected": 3},
                    {"inputs": [[10, 20, 30], 5], "expected": 1},
                    {"inputs": [[1, 2, 3, 4, 5], 10], "expected": 5},
                    {"inputs": [[5], 0], "expected": 1}
                ],
                "explanation": "Use a two-pointer sliding window to maintain timestamps[right] - timestamps[left] <= window_size."
            },
            {
                "question_type": "code",
                "title": "Stream Watermark Filter",
                "difficulty": "Easy",
                "function_name": "filter_late_events",
                "function_name_java": "filterLateEvents",
                "question_text": "Given an array of incoming event timestamps `events` and a watermark threshold integer `watermark`, return an array of timestamps that are strictly greater than or equal to `watermark`. Discard events older than watermark.",
                "input_format": "List of integers `events`, int `watermark`",
                "output_format": "List of integers",
                "constraints": "1 <= len(events) <= 10^4",
                "examples": [
                    {"input": "events = [100, 85, 120, 70], watermark = 90", "output": "[100, 120]"}
                ],
                "starter_code": "def filter_late_events(events: list, watermark: int) -> list:\n    pass\n",
                "starter_code_java": "import java.util.*;\n\npublic class Solution {\n    public int[] filterLateEvents(int[] events, int watermark) {\n        return new int[0];\n    }\n}\n",
                "sample_test_cases": [
                    {"inputs": [[100, 85, 120, 70], 90], "expected": [100, 120]},
                    {"inputs": [[50, 60], 70], "expected": []}
                ],
                "test_cases": [
                    {"inputs": [[100, 85, 120, 70], 90], "expected": [100, 120]},
                    {"inputs": [[50, 60], 70], "expected": []},
                    {"inputs": [[10, 20, 30], 10], "expected": [10, 20, 30]},
                    {"inputs": [[5, 15, 25], 20], "expected": [25]}
                ],
                "explanation": "Filter elements where x >= watermark."
            },
            {
                "question_type": "code",
                "title": "Flatten Nested Record Pipeline",
                "difficulty": "Medium",
                "function_name": "flatten_batches",
                "function_name_java": "flattenBatches",
                "question_text": "Given a 2D array of integers `batches` representing distributed partitions of incoming records, return a single 1D array containing all integers in sequential order.",
                "input_format": "List of lists of integers `batches`",
                "output_format": "List of integers",
                "constraints": "0 <= len(batches) <= 1000",
                "examples": [
                    {"input": "batches = [[1, 2], [3], [4, 5]]", "output": "[1, 2, 3, 4, 5]"}
                ],
                "starter_code": "def flatten_batches(batches: list) -> list:\n    pass\n",
                "starter_code_java": "import java.util.*;\n\npublic class Solution {\n    public int[] flattenBatches(int[][] batches) {\n        return new int[0];\n    }\n}\n",
                "sample_test_cases": [
                    {"inputs": [[[1, 2], [3], [4, 5]]], "expected": [1, 2, 3, 4, 5]},
                    {"inputs": [[[]]], "expected": []}
                ],
                "test_cases": [
                    {"inputs": [[[1, 2], [3], [4, 5]]], "expected": [1, 2, 3, 4, 5]},
                    {"inputs": [[[]]], "expected": []},
                    {"inputs": [[[10], [20, 30]]], "expected": [10, 20, 30]},
                    {"inputs": [[[7, 8, 9]]], "expected": [7, 8, 9]}
                ],
                "explanation": "Flatten list of sublists into a single continuous list."
            },
            {
                "question_type": "code",
                "title": "Partition Hash Balancer",
                "difficulty": "Easy",
                "function_name": "assign_partition",
                "function_name_java": "assignPartition",
                "question_text": "Given a string `record_key` and the number of cluster partitions `num_partitions`, return the partition index calculated as: (sum of ASCII values of characters in record_key) % num_partitions.",
                "input_format": "String `record_key`, int `num_partitions`",
                "output_format": "Integer partition index",
                "constraints": "1 <= len(record_key) <= 100, num_partitions >= 1",
                "examples": [
                    {"input": "record_key = 'abc', num_partitions = 4", "output": "2"}
                ],
                "starter_code": "def assign_partition(record_key: str, num_partitions: int) -> int:\n    pass\n",
                "starter_code_java": "public class Solution {\n    public int assignPartition(String recordKey, int numPartitions) {\n        return 0;\n    }\n}\n",
                "sample_test_cases": [
                    {"inputs": ["abc", 4], "expected": 2},
                    {"inputs": ["A", 2], "expected": 1}
                ],
                "test_cases": [
                    {"inputs": ["abc", 4], "expected": 2},
                    {"inputs": ["A", 2], "expected": 1},
                    {"inputs": ["user_100", 8], "expected": 1},
                    {"inputs": ["key", 1], "expected": 0}
                ],
                "explanation": "Sum ord(c) for character in record_key and return sum % num_partitions."
            }
        ]
    },

    # 5. Kubernetes Orchestration & Cloud Native Architecture
    {
        "title": "Kubernetes Orchestration & Cloud Native Architecture",
        "category_name": "Cloud Orchestration & Containers",
        "category_icon": "Server",
        "description": "Production Kubernetes cluster management: Pod lifecycle probes, Horizontal Pod Autoscaling (HPA), Ingress routing, rolling update deployment strategies, and Helm configurations.",
        "difficulty": "ADVANCED",
        "duration_minutes": 60,
        "questions": [
            {
                "question_type": "mcq",
                "title": "Liveness vs Readiness Probes",
                "question_text": "What is the consequence when a Pod's Readiness Probe fails versus when its Liveness Probe fails?",
                "options": [
                    "A failed liveness probe removes the Pod from Service endpoints; a failed readiness probe restarts the container",
                    "A failed readiness probe stops routing Service network traffic to the Pod; a failed liveness probe causes kubelet to restart or kill the container",
                    "Both probes perform identical actions in Kubernetes",
                    "Probes are only evaluated during initial cluster installation"
                ],
                "correct_option_index": 1,
                "explanation": "Readiness indicates whether the app is warm enough to receive traffic; Liveness detects unrecoverable deadlocks and triggers container restart."
            },
            {
                "question_type": "mcq",
                "title": "Horizontal Pod Autoscaler (HPA)",
                "question_text": "How does the Horizontal Pod Autoscaler (HPA) compute the desired replica count when scaling based on CPU utilization?",
                "options": [
                    "desiredReplicas = ceil(currentReplicas * (currentMetricValue / targetMetricValue))",
                    "desiredReplicas = currentReplicas + 10",
                    "desiredReplicas = currentNodes * 2",
                    "desiredReplicas = random integer between 1 and 10"
                ],
                "correct_option_index": 0,
                "explanation": "HPA queries the Metrics Server API and dynamically adjusts replicas proportional to the ratio of current vs target utilization."
            },
            {
                "question_type": "mcq",
                "title": "RollingUpdate maxSurge and maxUnavailable",
                "question_text": "In a Kubernetes Deployment, what does `maxUnavailable: 0` and `maxSurge: 25%` guarantee during a rollout?",
                "options": [
                    "All Pods are terminated simultaneously before new ones start",
                    "Zero downtime: 100% of desired capacity is guaranteed to remain active and healthy at all times while up to 25% extra Pods are spun up",
                    "The deployment is permanently frozen",
                    "Traffic is routed directly to the database without Pods"
                ],
                "correct_option_index": 1,
                "explanation": "Setting maxUnavailable to 0 prevents any reduction in active service capacity while new pods boot up."
            },
            {
                "question_type": "mcq",
                "title": "ConfigMaps and Secrets Immutability",
                "question_text": "Why should Kubernetes ConfigMaps and Secrets be marked as `immutable: true` when possible?",
                "options": [
                    "It prevents users from reading the data forever",
                    "It stops kubelet from periodically polling the API server for changes, drastically reducing control plane load on large clusters and preventing accidental silent mutations",
                    "It encrypts strings with 4096-bit RSA keys",
                    "It removes the secret from memory"
                ],
                "correct_option_index": 1,
                "explanation": "Immutable ConfigMaps protect against accidental drift and reduce kubelet watch overhead on the Kubernetes API server."
            },
            {
                "question_type": "mcq",
                "title": "Ingress Controller Architecture",
                "question_text": "What is the primary role of a Kubernetes Ingress Controller (e.g. NGINX Ingress, Traefik)?",
                "options": [
                    "To format hard drives on worker nodes",
                    "To act as a reverse proxy/load balancer routing external HTTP/HTTPS traffic to internal ClusterIP services based on host headers and URL paths",
                    "To generate Dockerfile images",
                    "To execute cron jobs inside containers"
                ],
                "correct_option_index": 1,
                "explanation": "The Ingress resource declares routing rules; the controller implements those rules by configuring a reverse proxy."
            },
            # 5 Coding Challenges
            {
                "question_type": "code",
                "title": "HPA Replica Calculator",
                "difficulty": "Easy",
                "function_name": "calc_replicas",
                "function_name_java": "calcReplicas",
                "question_text": "Given `current_replicas` (int), `current_metric` (float), and `target_metric` (float), return the desired replicas as ceil(current_replicas * (current_metric / target_metric)). If the calculated value is less than 1, return 1.",
                "input_format": "int `current_replicas`, float `current_metric`, float `target_metric`",
                "output_format": "Integer desired replicas",
                "constraints": "current_replicas >= 1, target_metric > 0",
                "examples": [
                    {"input": "current_replicas = 2, current_metric = 80.0, target_metric = 50.0", "output": "4"}
                ],
                "starter_code": "import math\n\ndef calc_replicas(current_replicas: int, current_metric: float, target_metric: float) -> int:\n    pass\n",
                "starter_code_java": "public class Solution {\n    public int calcReplicas(int currentReplicas, double currentMetric, double targetMetric) {\n        return 1;\n    }\n}\n",
                "sample_test_cases": [
                    {"inputs": [2, 80.0, 50.0], "expected": 4},
                    {"inputs": [5, 50.0, 50.0], "expected": 5}
                ],
                "test_cases": [
                    {"inputs": [2, 80.0, 50.0], "expected": 4},
                    {"inputs": [5, 50.0, 50.0], "expected": 5},
                    {"inputs": [1, 20.0, 80.0], "expected": 1},
                    {"inputs": [3, 90.0, 30.0], "expected": 9}
                ],
                "explanation": "Compute ceil(current * (currentMetric / targetMetric)) and clamp min to 1."
            },
            {
                "question_type": "code",
                "title": "Ingress Path Matcher",
                "difficulty": "Medium",
                "function_name": "match_ingress_path",
                "function_name_java": "matchIngressPath",
                "question_text": "Given a list of registered prefix routes `routes` (e.g. ['/api/v1', '/api', '/static']) and a request URI `request_path`, return the longest matching prefix route. If no route matches, return '404_NOT_FOUND'.",
                "input_format": "List of strings `routes`, String `request_path`",
                "output_format": "String matched route or '404_NOT_FOUND'",
                "constraints": "1 <= len(routes) <= 100",
                "examples": [
                    {"input": "routes = ['/api', '/api/v1'], request_path = '/api/v1/users'", "output": "'/api/v1'"}
                ],
                "starter_code": "def match_ingress_path(routes: list, request_path: str) -> str:\n    pass\n",
                "starter_code_java": "import java.util.*;\n\npublic class Solution {\n    public String matchIngressPath(String[] routes, String requestPath) {\n        return \"404_NOT_FOUND\";\n    }\n}\n",
                "sample_test_cases": [
                    {"inputs": [["/api", "/api/v1"], "/api/v1/users"], "expected": "/api/v1"},
                    {"inputs": [["/docs"], "/login"], "expected": "404_NOT_FOUND"}
                ],
                "test_cases": [
                    {"inputs": [["/api", "/api/v1"], "/api/v1/users"], "expected": "/api/v1"},
                    {"inputs": [["/docs"], "/login"], "expected": "404_NOT_FOUND"},
                    {"inputs": [["/"], "/index.html"], "expected": "/"},
                    {"inputs": [["/v1", "/v1/auth", "/v2"], "/v1/auth/token"], "expected": "/v1/auth"}
                ],
                "explanation": "Filter routes that request_path starts with, and choose the one with max length."
            },
            {
                "question_type": "code",
                "title": "Pod Resource Quota Checker",
                "difficulty": "Easy",
                "function_name": "check_quota",
                "function_name_java": "checkQuota",
                "question_text": "Given a list of requested container memory in megabytes `mem_requests` and a cluster quota limit `limit_mb`, return True if the total sum of memory requests <= limit_mb, otherwise return False.",
                "input_format": "List of integers `mem_requests`, int `limit_mb`",
                "output_format": "Boolean",
                "constraints": "1 <= len(mem_requests) <= 1000",
                "examples": [
                    {"input": "mem_requests = [512, 1024, 256], limit_mb = 2048", "output": "True"}
                ],
                "starter_code": "def check_quota(mem_requests: list, limit_mb: int) -> bool:\n    pass\n",
                "starter_code_java": "public class Solution {\n    public boolean checkQuota(int[] memRequests, int limitMb) {\n        return false;\n    }\n}\n",
                "sample_test_cases": [
                    {"inputs": [[512, 1024, 256], 2048], "expected": True},
                    {"inputs": [[1024, 2048], 2048], "expected": False}
                ],
                "test_cases": [
                    {"inputs": [[512, 1024, 256], 2048], "expected": True},
                    {"inputs": [[1024, 2048], 2048], "expected": False},
                    {"inputs": [[100, 200, 300], 600], "expected": True},
                    {"inputs": [[500], 400], "expected": False}
                ],
                "explanation": "Check if sum(mem_requests) <= limit_mb."
            },
            {
                "question_type": "code",
                "title": "Service Endpoint Health Aggregator",
                "difficulty": "Easy",
                "function_name": "healthy_endpoint_count",
                "function_name_java": "healthyEndpointCount",
                "question_text": "Given an array of Pod readiness statuses `statuses` (strings: 'Ready' or 'NotReady'), return the integer count of 'Ready' endpoints.",
                "input_format": "List of strings `statuses`",
                "output_format": "Integer count",
                "constraints": "1 <= len(statuses) <= 1000",
                "examples": [
                    {"input": "statuses = ['Ready', 'NotReady', 'Ready']", "output": "2"}
                ],
                "starter_code": "def healthy_endpoint_count(statuses: list) -> int:\n    pass\n",
                "starter_code_java": "public class Solution {\n    public int healthyEndpointCount(String[] statuses) {\n        return 0;\n    }\n}\n",
                "sample_test_cases": [
                    {"inputs": [["Ready", "NotReady", "Ready"]], "expected": 2},
                    {"inputs": [["NotReady", "NotReady"]], "expected": 0}
                ],
                "test_cases": [
                    {"inputs": [["Ready", "NotReady", "Ready"]], "expected": 2},
                    {"inputs": [["NotReady", "NotReady"]], "expected": 0},
                    {"inputs": [["Ready", "Ready", "Ready"]], "expected": 3},
                    {"inputs": [["Ready"]], "expected": 1}
                ],
                "explanation": "Count elements equal to 'Ready'."
            },
            {
                "question_type": "code",
                "title": "ConfigMap Key Value Parser",
                "difficulty": "Medium",
                "function_name": "parse_configmap",
                "function_name_java": "parseConfigmap",
                "question_text": "Given a multiline string `raw_yaml` containing lines formatted as 'KEY: VALUE', parse and return a sorted list of pairs [key, value] sorted alphabetically by key. Ignore blank lines or lines without ':' separator.",
                "input_format": "String `raw_yaml`",
                "output_format": "List of pairs [key, value]",
                "constraints": "1 <= len(raw_yaml) <= 1000",
                "examples": [
                    {"input": "raw_yaml = 'PORT: 8080\\nENV: prod'", "output": "[['ENV', 'prod'], ['PORT', '8080']]"}
                ],
                "starter_code": "def parse_configmap(raw_yaml: str) -> list:\n    pass\n",
                "starter_code_java": "import java.util.*;\n\npublic class Solution {\n    public List<List<String>> parseConfigmap(String rawYaml) {\n        return new ArrayList<>();\n    }\n}\n",
                "sample_test_cases": [
                    {"inputs": ["PORT: 8080\nENV: prod"], "expected": [["ENV", "prod"], ["PORT", "8080"]]},
                    {"inputs": ["LOG_LEVEL: debug"], "expected": [["LOG_LEVEL", "debug"]]}
                ],
                "test_cases": [
                    {"inputs": ["PORT: 8080\nENV: prod"], "expected": [["ENV", "prod"], ["PORT", "8080"]]},
                    {"inputs": ["LOG_LEVEL: debug"], "expected": [["LOG_LEVEL", "debug"]]},
                    {"inputs": ["B: 2\nA: 1\nC: 3"], "expected": [["A", "1"], ["B", "2"], ["C", "3"]]},
                    {"inputs": ["\nINVALID_LINE\nKEY: VAL"], "expected": [["KEY", "VAL"]]}
                ],
                "explanation": "Split lines, split on ':', trim whitespace, and sort by key."
            }
        ]
    },

    # 6. Infrastructure as Code with Terraform & Cloud Automation
    {
        "title": "Infrastructure as Code with Terraform & Cloud Automation",
        "category_name": "DevOps & Infrastructure as Code",
        "category_icon": "Cpu",
        "description": "Enterprise cloud provisioning with Terraform: remote state locking, resource dependency graphs (DAG), drift detection, modular architecture, and CI/CD plan validation.",
        "difficulty": "INTERMEDIATE",
        "duration_minutes": 60,
        "questions": [
            {
                "question_type": "mcq",
                "title": "Terraform State Locking",
                "question_text": "Why is distributed state locking (e.g. AWS DynamoDB with S3 backend) required when collaborating on Terraform projects?",
                "options": [
                    "To prevent concurrent `terraform apply` executions from corrupting or overwriting the state file",
                    "To make Terraform run faster on local laptops",
                    "To prevent AWS from billing for resources",
                    "To convert HCL code into Python automatically"
                ],
                "correct_option_index": 0,
                "explanation": "If two team members or CI jobs run apply simultaneously, race conditions can corrupt state or cause double-provisioning."
            },
            {
                "question_type": "mcq",
                "title": "Terraform Refresh & Drift Detection",
                "question_text": "What does Terraform do during the `refresh` phase of `terraform plan`?",
                "options": [
                    "It queries real cloud provider APIs to reconcile the actual live infrastructure state with the recorded `.tfstate` file",
                    "It reboots all running cloud virtual machines",
                    "It deletes uncommitted git branches",
                    "It upgrades Terraform to the latest beta version"
                ],
                "correct_option_index": 0,
                "explanation": "Refresh updates Terraform's knowledge of the real world before computing plan diffs to identify out-of-band manual changes (drift)."
            },
            {
                "question_type": "mcq",
                "title": "Terraform Resource Dependency Graph",
                "question_text": "How does Terraform determine the order in which cloud resources are created or destroyed?",
                "options": [
                    "Alphabetical order by file name",
                    "By constructing a Directed Acyclic Graph (DAG) derived from implicit references (e.g. `aws_subnet.id`) and explicit `depends_on` blocks",
                    "Purely random selection",
                    "In the exact order files were edited in VS Code"
                ],
                "correct_option_index": 1,
                "explanation": "Terraform generates a DAG to determine dependencies, enabling independent resources to be safely provisioned concurrently."
            },
            {
                "question_type": "mcq",
                "title": "Terraform Workspace Use Cases",
                "question_text": "When is it appropriate to use Terraform Workspaces?",
                "options": [
                    "To manage identical infrastructure configurations across lightweight staging environments with separate state instances",
                    "To store user passwords",
                    "To run database unit tests",
                    "To compile C++ code"
                ],
                "correct_option_index": 0,
                "explanation": "Workspaces allow multiple named state files for the same configuration code, often used for ephemeral staging environments."
            },
            {
                "question_type": "mcq",
                "title": "Terraform count vs for_each",
                "question_text": "Why is `for_each` preferred over `count` when provisioning a collection of cloud resources from a list?",
                "options": [
                    "Removing an item from the middle of a `count` list shifts all subsequent index positions, causing Terraform to destroy and recreate unedited resources",
                    "`count` cannot provision more than 2 resources",
                    "`for_each` is free while `count` incurs licensing fees",
                    "`for_each` disables cloud firewall rules"
                ],
                "correct_option_index": 0,
                "explanation": "Resources managed with `count` are keyed by integer index (`[0]`, `[1]`), while `for_each` keys resources by persistent map keys."
            },
            # 5 Coding Challenges
            {
                "question_type": "code",
                "title": "CIDR Subnet Host Count Calculator",
                "difficulty": "Easy",
                "function_name": "calc_usable_hosts",
                "function_name_java": "calcUsableHosts",
                "question_text": "Given an IPv4 CIDR prefix integer `prefix_len` (e.g. 24 for a /24 subnet), calculate the number of usable host IP addresses: 2^(32 - prefix_len) - 2. If prefix_len >= 31, return 0.",
                "input_format": "int `prefix_len`",
                "output_format": "Integer usable hosts",
                "constraints": "1 <= prefix_len <= 32",
                "examples": [
                    {"input": "prefix_len = 24", "output": "254"}
                ],
                "starter_code": "def calc_usable_hosts(prefix_len: int) -> int:\n    pass\n",
                "starter_code_java": "public class Solution {\n    public int calcUsableHosts(int prefixLen) {\n        return 0;\n    }\n}\n",
                "sample_test_cases": [
                    {"inputs": [24], "expected": 254},
                    {"inputs": [30], "expected": 2}
                ],
                "test_cases": [
                    {"inputs": [24], "expected": 254},
                    {"inputs": [30], "expected": 2},
                    {"inputs": [31], "expected": 0},
                    {"inputs": [28], "expected": 14}
                ],
                "explanation": "Compute (2 ** (32 - prefix_len)) - 2 if prefix_len < 31 else 0."
            },
            {
                "question_type": "code",
                "title": "Mandatory Cloud Tag Enforcer",
                "difficulty": "Easy",
                "function_name": "validate_tags",
                "function_name_java": "validateTags",
                "question_text": "Given a list of required tag names `required_tags` and a list of present tag names `present_tags`, return True if all required tags are contained in present_tags, otherwise return False.",
                "input_format": "List of strings `required_tags`, List of strings `present_tags`",
                "output_format": "Boolean",
                "constraints": "1 <= len(required_tags) <= 100",
                "examples": [
                    {"input": "required = ['Environment', 'Owner'], present = ['Environment', 'Owner', 'CostCenter']", "output": "True"}
                ],
                "starter_code": "def validate_tags(required_tags: list, present_tags: list) -> bool:\n    pass\n",
                "starter_code_java": "import java.util.*;\n\npublic class Solution {\n    public boolean validateTags(String[] requiredTags, String[] presentTags) {\n        return false;\n    }\n}\n",
                "sample_test_cases": [
                    {"inputs": [["Environment", "Owner"], ["Environment", "Owner", "CostCenter"]], "expected": True},
                    {"inputs": [["Environment", "Project"], ["Environment"]], "expected": False}
                ],
                "test_cases": [
                    {"inputs": [["Environment", "Owner"], ["Environment", "Owner", "CostCenter"]], "expected": True},
                    {"inputs": [["Environment", "Project"], ["Environment"]], "expected": False},
                    {"inputs": [["A"], ["A"]], "expected": True},
                    {"inputs": [["A", "B", "C"], ["B", "C"]], "expected": False}
                ],
                "explanation": "Check if set(required_tags).issubset(set(present_tags))."
            },
            {
                "question_type": "code",
                "title": "Cloud Resource Cost Calculator",
                "difficulty": "Easy",
                "function_name": "calc_monthly_cost",
                "function_name_java": "calcMonthlyCost",
                "question_text": "Given an array of instances where each item is [hourly_rate_float, count_int], calculate and return the total monthly cost assuming 730 hours in a month, rounded to the nearest integer.",
                "input_format": "List of pairs `instances`",
                "output_format": "Integer total monthly cost",
                "constraints": "1 <= len(instances) <= 100",
                "examples": [
                    {"input": "instances = [[0.10, 2], [0.50, 1]]", "output": "511"}
                ],
                "starter_code": "def calc_monthly_cost(instances: list) -> int:\n    pass\n",
                "starter_code_java": "import java.util.*;\n\npublic class Solution {\n    public int calcMonthlyCost(List<List<Double>> instances) {\n        return 0;\n    }\n}\n",
                "sample_test_cases": [
                    {"inputs": [[[0.10, 2.0], [0.50, 1.0]]], "expected": 511},
                    {"inputs": [[[1.0, 1.0]]], "expected": 730}
                ],
                "test_cases": [
                    {"inputs": [[[0.10, 2.0], [0.50, 1.0]]], "expected": 511},
                    {"inputs": [[[1.0, 1.0]]], "expected": 730},
                    {"inputs": [[[0.05, 10.0]]], "expected": 365},
                    {"inputs": [[[0.0, 5.0]]], "expected": 0}
                ],
                "explanation": "Sum hourly_rate * count * 730 and round to int."
            },
            {
                "question_type": "code",
                "title": "Topological Resource Graph Sorter",
                "difficulty": "Hard",
                "function_name": "topo_sort_resources",
                "function_name_java": "topoSortResources",
                "question_text": "Given a number of resources `n` (indexed 0 to n-1) and a list of dependency pairs `deps` where `[a, b]` means resource `a` depends on `b` (so `b` must be created before `a`), return a valid linear creation order list of integers. If there is a circular dependency cycle, return an empty list []. In case of multiple valid choices, choose smaller index first.",
                "input_format": "int `n`, List of pairs `deps`",
                "output_format": "List of integers creation order",
                "constraints": "1 <= n <= 100",
                "examples": [
                    {"input": "n = 3, deps = [[0, 1], [1, 2]]", "output": "[2, 1, 0]"}
                ],
                "starter_code": "def topo_sort_resources(n: int, deps: list) -> list:\n    pass\n",
                "starter_code_java": "import java.util.*;\n\npublic class Solution {\n    public int[] topoSortResources(int n, int[][] deps) {\n        return new int[0];\n    }\n}\n",
                "sample_test_cases": [
                    {"inputs": [3, [[0, 1], [1, 2]]], "expected": [2, 1, 0]},
                    {"inputs": [2, [[0, 1], [1, 0]]], "expected": []}
                ],
                "test_cases": [
                    {"inputs": [3, [[0, 1], [1, 2]]], "expected": [2, 1, 0]},
                    {"inputs": [2, [[0, 1], [1, 0]]], "expected": []},
                    {"inputs": [2, []], "expected": [0, 1]},
                    {"inputs": [4, [[3, 0], [3, 1], [2, 0]]], "expected": [0, 1, 2, 3]}
                ],
                "explanation": "Kahn's algorithm using in-degree array and priority queue."
            },
            {
                "question_type": "code",
                "title": "Variable Default Value Fallback",
                "difficulty": "Easy",
                "function_name": "resolve_config",
                "function_name_java": "resolveConfig",
                "question_text": "Given a user-provided value string `override_val` and a default value string `default_val`, return `override_val` if it is not empty, otherwise return `default_val`.",
                "input_format": "String `override_val`, String `default_val`",
                "output_format": "String",
                "constraints": "0 <= len <= 100",
                "examples": [
                    {"input": "override_val = 't3.large', default_val = 't3.micro'", "output": "'t3.large'"}
                ],
                "starter_code": "def resolve_config(override_val: str, default_val: str) -> str:\n    pass\n",
                "starter_code_java": "public class Solution {\n    public String resolveConfig(String overrideVal, String defaultVal) {\n        return (overrideVal != null && !overrideVal.isEmpty()) ? overrideVal : defaultVal;\n    }\n}\n",
                "sample_test_cases": [
                    {"inputs": ["t3.large", "t3.micro"], "expected": "t3.large"},
                    {"inputs": ["", "t3.micro"], "expected": "t3.micro"}
                ],
                "test_cases": [
                    {"inputs": ["t3.large", "t3.micro"], "expected": "t3.large"},
                    {"inputs": ["", "t3.micro"], "expected": "t3.micro"},
                    {"inputs": ["us-west-2", "us-east-1"], "expected": "us-west-2"},
                    {"inputs": ["", "default_vpc"], "expected": "default_vpc"}
                ],
                "explanation": "Return override_val if override_val else default_val."
            }
        ]
    },

    # 7. Java Spring Boot & Enterprise Microservices
    {
        "title": "Java Spring Boot & Enterprise Microservices",
        "category_name": "Enterprise Java & Spring Cloud",
        "category_icon": "Coffee",
        "description": "Production enterprise Java engineering: Spring Boot dependency injection, Spring Data JPA dirty checking, Resilience4j circuit breakers, distributed transaction patterns, and JWT security filter chains.",
        "difficulty": "ADVANCED",
        "duration_minutes": 60,
        "questions": [
            {
                "question_type": "mcq",
                "title": "Spring Bean Scopes",
                "question_text": "What is the default scope of a Spring Bean created with `@Component` or `@Service` in the ApplicationContext?",
                "options": [
                    "Prototype (a new instance is created every time it is injected)",
                    "Singleton (a single shared instance per Spring IoC container)",
                    "Request (a new instance per HTTP request)",
                    "Session (a new instance per user session)"
                ],
                "correct_option_index": 1,
                "explanation": "By default, Spring beans are singletons per ApplicationContext, meaning shared state must be thread-safe."
            },
            {
                "question_type": "mcq",
                "title": "Spring Data JPA Hibernate N+1 Problem",
                "question_text": "How can you resolve the N+1 SELECT query problem in Spring Data JPA when querying entities with `@OneToMany` lazy relationships?",
                "options": [
                    "Delete the database indexes",
                    "Use a `JOIN FETCH` clause in a JPQL `@Query` or an `@EntityGraph` to load parent and child associations in a single SQL query",
                    "Switch to flat CSV file storage",
                    "Wrap the query in a synchronized block"
                ],
                "correct_option_index": 1,
                "explanation": "Without JOIN FETCH or EntityGraph, Hibernate issues 1 query for the parent list and N additional queries for each child collection."
            },
            {
                "question_type": "mcq",
                "title": "Resilience4j Circuit Breaker States",
                "question_text": "In Resilience4j, what triggers a Circuit Breaker to transition from OPEN to HALF_OPEN?",
                "options": [
                    "A predefined wait duration timer expires, allowing a trial number of test requests to pass through and evaluate downstream service health",
                    "The JVM restarts automatically",
                    "The user refreshes their browser tab",
                    "An administrator manually deletes the log files"
                ],
                "correct_option_index": 0,
                "explanation": "When open, calls fail fast. Once waitDurationInOpenState expires, it enters HALF_OPEN to test if the service has recovered."
            },
            {
                "question_type": "mcq",
                "title": "@Transactional Propagation REQUIRES_NEW",
                "question_text": "What happens when a Spring method annotated with `@Transactional(propagation = Propagation.REQUIRES_NEW)` is invoked from within an existing active transaction?",
                "options": [
                    "It joins the current transaction and shares its commit/rollback fate",
                    "The current transaction is suspended, and a completely independent new physical database transaction is started and committed/rolled back separately",
                    "An exception is thrown immediately",
                    "All database tables are locked in read-only mode"
                ],
                "correct_option_index": 1,
                "explanation": "REQUIRES_NEW suspends the outer transaction and executes in a distinct transaction boundary (useful for audit logging that must commit even if the parent fails)."
            },
            {
                "question_type": "mcq",
                "title": "Spring Security OncePerRequestFilter",
                "question_text": "Why do custom JWT authentication filters in Spring Security commonly extend `OncePerRequestFilter`?",
                "options": [
                    "To ensure the token extraction, signature verification, and SecurityContext population logic executes exactly once per dispatched HTTP request",
                    "To restrict each API endpoint to only one single user globally",
                    "To prevent Java garbage collection from running",
                    "To disable HTTPS on internal microservices"
                ],
                "correct_option_index": 0,
                "explanation": "OncePerRequestFilter guarantees single execution per request dispatch, avoiding duplicate authentication checks during servlet forwards or error dispatches."
            },
            # 5 Coding Challenges
            {
                "question_type": "code",
                "title": "Circuit Breaker State Machine",
                "difficulty": "Medium",
                "function_name": "circuit_breaker_status",
                "function_name_java": "circuitBreakerStatus",
                "question_text": "Given an array of sequential request outcomes `outcomes` (strings: 'SUCCESS' or 'FAILURE') and a failure threshold integer `threshold`, the circuit breaker starts CLOSED. If consecutive FAILURES reach `threshold`, state switches to 'OPEN'. A single 'SUCCESS' resets consecutive failures back to 0. Return the final state ('CLOSED' or 'OPEN').",
                "input_format": "List of strings `outcomes`, int `threshold`",
                "output_format": "String 'CLOSED' or 'OPEN'",
                "constraints": "1 <= len(outcomes) <= 1000, threshold >= 1",
                "examples": [
                    {"input": "outcomes = ['SUCCESS', 'FAILURE', 'FAILURE'], threshold = 2", "output": "'OPEN'"}
                ],
                "starter_code": "def circuit_breaker_status(outcomes: list, threshold: int) -> str:\n    pass\n",
                "starter_code_java": "public class Solution {\n    public String circuitBreakerStatus(String[] outcomes, int threshold) {\n        return \"CLOSED\";\n    }\n}\n",
                "sample_test_cases": [
                    {"inputs": [["SUCCESS", "FAILURE", "FAILURE"], 2], "expected": "OPEN"},
                    {"inputs": [["FAILURE", "SUCCESS", "FAILURE"], 2], "expected": "CLOSED"}
                ],
                "test_cases": [
                    {"inputs": [["SUCCESS", "FAILURE", "FAILURE"], 2], "expected": "OPEN"},
                    {"inputs": [["FAILURE", "SUCCESS", "FAILURE"], 2], "expected": "CLOSED"},
                    {"inputs": [["FAILURE", "FAILURE", "FAILURE"], 3], "expected": "OPEN"},
                    {"inputs": [["SUCCESS", "SUCCESS"], 1], "expected": "CLOSED"}
                ],
                "explanation": "Track consecutive failures; if count >= threshold set state to OPEN; if SUCCESS reset count to 0."
            },
            {
                "question_type": "code",
                "title": "Token Bucket Rate Limiter",
                "difficulty": "Medium",
                "function_name": "rate_limit_requests",
                "function_name_java": "rateLimitRequests",
                "question_text": "A token bucket starts with `capacity` tokens. Given a list of integers `request_costs`, process each request in order: if current tokens >= cost, deduct cost and record 'ALLOW'; otherwise do not deduct and record 'REJECT'. Return a list of 'ALLOW'/'REJECT' decisions.",
                "input_format": "int `capacity`, List of integers `request_costs`",
                "output_format": "List of strings",
                "constraints": "capacity >= 0, 1 <= len(request_costs) <= 1000",
                "examples": [
                    {"input": "capacity = 10, request_costs = [4, 5, 3]", "output": "['ALLOW', 'ALLOW', 'REJECT']"}
                ],
                "starter_code": "def rate_limit_requests(capacity: int, request_costs: list) -> list:\n    pass\n",
                "starter_code_java": "import java.util.*;\n\npublic class Solution {\n    public String[] rateLimitRequests(int capacity, int[] requestCosts) {\n        return new String[0];\n    }\n}\n",
                "sample_test_cases": [
                    {"inputs": [10, [4, 5, 3]], "expected": ["ALLOW", "ALLOW", "REJECT"]},
                    {"inputs": [5, [6]], "expected": ["REJECT"]}
                ],
                "test_cases": [
                    {"inputs": [10, [4, 5, 3]], "expected": ["ALLOW", "ALLOW", "REJECT"]},
                    {"inputs": [5, [6]], "expected": ["REJECT"]},
                    {"inputs": [20, [5, 5, 5, 5]], "expected": ["ALLOW", "ALLOW", "ALLOW", "ALLOW"]},
                    {"inputs": [0, [1]], "expected": ["REJECT"]}
                ],
                "explanation": "Greedy balance deduction if tokens >= cost."
            },
            {
                "question_type": "code",
                "title": "REST Path Variable Extractor",
                "difficulty": "Easy",
                "function_name": "extract_path_var",
                "function_name_java": "extractPathVar",
                "question_text": "Given a URL path template string `template` like '/users/{id}/orders' and an actual request path string `path` like '/users/42/orders', extract and return the value corresponding to the placeholder variable name `var_name` ('id' -> '42'). If variable not found or segments don't match, return ''.",
                "input_format": "String `template`, String `path`, String `var_name`",
                "output_format": "String variable value",
                "constraints": "1 <= len <= 200",
                "examples": [
                    {"input": "template = '/api/{version}/items', path = '/api/v2/items', var_name = 'version'", "output": "'v2'"}
                ],
                "starter_code": "def extract_path_var(template: str, path: str, var_name: str) -> str:\n    pass\n",
                "starter_code_java": "public class Solution {\n    public String extractPathVar(String template, String path, String varName) {\n        return \"\";\n    }\n}\n",
                "sample_test_cases": [
                    {"inputs": ["/api/{version}/items", "/api/v2/items", "version"], "expected": "v2"},
                    {"inputs": ["/users/{id}", "/users/100", "id"], "expected": "100"}
                ],
                "test_cases": [
                    {"inputs": ["/api/{version}/items", "/api/v2/items", "version"], "expected": "v2"},
                    {"inputs": ["/users/{id}", "/users/100", "id"], "expected": "100"},
                    {"inputs": ["/users/{id}/profile", "/users/55/profile", "id"], "expected": "55"},
                    {"inputs": ["/a/{b}", "/x/y", "b"], "expected": "y"}
                ],
                "explanation": "Split both paths by '/' and locate index where template matches '{' + var_name + '}'."
            },
            {
                "question_type": "code",
                "title": "LRU Key Eviction Tracker",
                "difficulty": "Hard",
                "function_name": "lru_evict",
                "function_name_java": "lruEvict",
                "question_text": "A cache with integer `capacity` processes operations in order: `['GET', key]` or `['PUT', key]`. Accessing a key (via GET or PUT) marks it most recently used. If a PUT operation exceeds capacity, the least recently used key is evicted. Return the list of keys present in cache at the end, ordered from least to most recently used.",
                "input_format": "int `capacity`, List of pairs `ops` where each pair is [action_string, key_string]",
                "output_format": "List of strings keys",
                "constraints": "capacity >= 1, 1 <= len(ops) <= 100",
                "examples": [
                    {"input": "capacity = 2, ops = [['PUT', 'A'], ['PUT', 'B'], ['PUT', 'C']]", "output": "['B', 'C']"}
                ],
                "starter_code": "def lru_evict(capacity: int, ops: list) -> list:\n    pass\n",
                "starter_code_java": "import java.util.*;\n\npublic class Solution {\n    public List<String> lruEvict(int capacity, List<List<String>> ops) {\n        return new ArrayList<>();\n    }\n}\n",
                "sample_test_cases": [
                    {"inputs": [2, [["PUT", "A"], ["PUT", "B"], ["PUT", "C"]]], "expected": ["B", "C"]},
                    {"inputs": [2, [["PUT", "A"], ["PUT", "B"], ["GET", "A"], ["PUT", "C"]]], "expected": ["A", "C"]}
                ],
                "test_cases": [
                    {"inputs": [2, [["PUT", "A"], ["PUT", "B"], ["PUT", "C"]]], "expected": ["B", "C"]},
                    {"inputs": [2, [["PUT", "A"], ["PUT", "B"], ["GET", "A"], ["PUT", "C"]]], "expected": ["A", "C"]},
                    {"inputs": [1, [["PUT", "X"], ["PUT", "Y"]]], "expected": ["Y"]},
                    {"inputs": [3, [["PUT", "1"], ["PUT", "2"], ["PUT", "3"]]], "expected": ["1", "2", "3"]}
                ],
                "explanation": "Maintain an OrderedDict / LinkedHashMap and pop item(last=False) when size exceeds capacity."
            },
            {
                "question_type": "code",
                "title": "HTTP Status Code Category Classifier",
                "difficulty": "Easy",
                "function_name": "classify_http_status",
                "function_name_java": "classifyHttpStatus",
                "question_text": "Given an integer HTTP status code `code`, return: 'INFORMATIONAL' for 1xx, 'SUCCESS' for 2xx, 'REDIRECTION' for 3xx, 'CLIENT_ERROR' for 4xx, and 'SERVER_ERROR' for 5xx. For anything else return 'UNKNOWN'.",
                "input_format": "int `code`",
                "output_format": "String category",
                "constraints": "100 <= code <= 999",
                "examples": [
                    {"input": "code = 200", "output": "'SUCCESS'"}
                ],
                "starter_code": "def classify_http_status(code: int) -> str:\n    pass\n",
                "starter_code_java": "public class Solution {\n    public String classifyHttpStatus(int code) {\n        return \"UNKNOWN\";\n    }\n}\n",
                "sample_test_cases": [
                    {"inputs": [200], "expected": "SUCCESS"},
                    {"inputs": [404], "expected": "CLIENT_ERROR"}
                ],
                "test_cases": [
                    {"inputs": [200], "expected": "SUCCESS"},
                    {"inputs": [404], "expected": "CLIENT_ERROR"},
                    {"inputs": [503], "expected": "SERVER_ERROR"},
                    {"inputs": [301], "expected": "REDIRECTION"}
                ],
                "explanation": "Check integer division code // 100."
            }
        ]
    },

    # 8. Next.js 14 & Modern Full Stack Architecture
    {
        "title": "Next.js 14 & Modern Full Stack Architecture",
        "category_name": "Full Stack & Modern Web",
        "category_icon": "Globe",
        "description": "Next.js 14 App Router, React Server Components (RSC), Server Actions, Streaming SSR with Suspense, Incremental Static Regeneration (ISR), and route handlers.",
        "difficulty": "ADVANCED",
        "duration_minutes": 60,
        "questions": [
            {
                "question_type": "mcq",
                "title": "React Server Components (RSC) Execution",
                "question_text": "Where do React Server Components (the default in Next.js App Router) execute?",
                "options": [
                    "Exclusively in the client's web browser JavaScript engine",
                    "Exclusively on the server during build or on request, outputting a compact virtual DOM JSON stream without sending their JavaScript bundle to the client",
                    "Inside the user's local indexedDB database",
                    "On edge DNS servers only"
                ],
                "correct_option_index": 1,
                "explanation": "RSCs execute strictly on the server; their component code and heavy server dependencies (like DB drivers) are never shipped to client bundles."
            },
            {
                "question_type": "mcq",
                "title": "Server Actions Security",
                "question_text": "What must developers keep in mind when defining a Next.js Server Action with `'use server'`?",
                "options": [
                    "Server actions are completely private and impossible to invoke externally",
                    "Server actions expose a publicly reachable HTTP POST endpoint, so arguments must be strictly validated and authorization checked on every invocation",
                    "Server actions only accept image files",
                    "Server actions disable CORS protections automatically"
                ],
                "correct_option_index": 1,
                "explanation": "Every Server Action creates an exposed POST endpoint. Never trust client arguments without server-side validation and session authentication."
            },
            {
                "question_type": "mcq",
                "title": "Incremental Static Regeneration (ISR)",
                "question_text": "In Next.js, what does setting `revalidate = 3600` on a fetch request achieve?",
                "options": [
                    "The server reboots every 3600 seconds",
                    "Cached static content is served immediately; in the background, if 3600 seconds have elapsed, Next.js triggers a revalidation fetch to update the static cache",
                    "Requests take exactly 1 hour to respond",
                    "The browser tab closes after 3600 seconds"
                ],
                "correct_option_index": 1,
                "explanation": "ISR (Stale-While-Revalidate) delivers instant static cache hits while quietly refreshing data in the background once the revalidation window expires."
            },
            {
                "question_type": "mcq",
                "title": "Streaming SSR with React Suspense",
                "question_text": "How does `<Suspense fallback={<Skeleton />}>` enhance user perceived performance in Next.js?",
                "options": [
                    "It converts slow database queries into instant mock responses",
                    "It breaks the page HTML into chunks, streaming the initial shell immediately while slow asynchronous components render in parallel on the server and stream in when ready",
                    "It downloads all images before displaying the page",
                    "It compresses CSS stylesheets"
                ],
                "correct_option_index": 1,
                "explanation": "Streaming SSR avoids blocking the entire HTTP response on slow queries; the fast parts render instantly with skeleton placeholders for the rest."
            },
            {
                "question_type": "mcq",
                "title": "'use client' Directive Placement",
                "question_text": "What is the best architectural practice regarding the `'use client'` directive in Next.js 14?",
                "options": [
                    "Place 'use client' at the top of the root layout file to convert the entire application into client components",
                    "Push 'use client' as far down the component tree as possible (to leaves like interactive buttons or search bars) to maximize server-rendered performance",
                    "Never use 'use client' anywhere",
                    "Use 'use client' only inside database migration scripts"
                ],
                "correct_option_index": 1,
                "explanation": "Confining 'use client' to small interactive leaf components preserves the performance, caching, and bundle size benefits of Server Components."
            },
            # 5 Coding Challenges
            {
                "question_type": "code",
                "title": "URL Query Parameter Serializer",
                "difficulty": "Easy",
                "function_name": "build_query_string",
                "function_name_java": "buildQueryString",
                "question_text": "Given a list of key-value string pairs `params` where each pair is [key, value], return a URL query string starting with '?' followed by 'key=value' pairs joined by '&', sorted alphabetically by key. If params is empty, return ''.",
                "input_format": "List of pairs `params`",
                "output_format": "String query string",
                "constraints": "0 <= len(params) <= 100",
                "examples": [
                    {"input": "params = [['page', '2'], ['sort', 'asc']]", "output": "'?page=2&sort=asc'"}
                ],
                "starter_code": "def build_query_string(params: list) -> str:\n    pass\n",
                "starter_code_java": "import java.util.*;\n\npublic class Solution {\n    public String buildQueryString(List<List<String>> params) {\n        return \"\";\n    }\n}\n",
                "sample_test_cases": [
                    {"inputs": [[["page", "2"], ["sort", "asc"]]], "expected": "?page=2&sort=asc"},
                    {"inputs": [[]], "expected": ""}
                ],
                "test_cases": [
                    {"inputs": [[["page", "2"], ["sort", "asc"]]], "expected": "?page=2&sort=asc"},
                    {"inputs": [[]], "expected": ""},
                    {"inputs": [[["z", "9"], ["a", "1"]]], "expected": "?a=1&z=9"},
                    {"inputs": [[["q", "react"]]], "expected": "?q=react"}
                ],
                "explanation": "Sort pairs by key and join with '&', prepending '?' if non-empty."
            },
            {
                "question_type": "code",
                "title": "Slugify Route Path Generator",
                "difficulty": "Easy",
                "function_name": "slugify_title",
                "function_name_java": "slugifyTitle",
                "question_text": "Given a post title string `title`, convert it into a URL-friendly slug: convert all characters to lowercase, replace any space or underscore with a hyphen '-', remove any non-alphanumeric and non-hyphen character, and collapse consecutive hyphens into a single hyphen. Strip leading and trailing hyphens.",
                "input_format": "String `title`",
                "output_format": "String slug",
                "constraints": "1 <= len(title) <= 200",
                "examples": [
                    {"input": "title = 'Next.js 14: App Router!'", "output": "'nextjs-14-app-router'"}
                ],
                "starter_code": "import re\n\ndef slugify_title(title: str) -> str:\n    pass\n",
                "starter_code_java": "public class Solution {\n    public String slugifyTitle(String title) {\n        return \"\";\n    }\n}\n",
                "sample_test_cases": [
                    {"inputs": ["Next.js 14: App Router!"], "expected": "nextjs-14-app-router"},
                    {"inputs": ["Hello   World"], "expected": "hello-world"}
                ],
                "test_cases": [
                    {"inputs": ["Next.js 14: App Router!"], "expected": "nextjs-14-app-router"},
                    {"inputs": ["Hello   World"], "expected": "hello-world"},
                    {"inputs": ["--Special__Chars@@--"], "expected": "specialchars"},
                    {"inputs": ["Clean Title"], "expected": "clean-title"}
                ],
                "explanation": "Lowercase, replace separators with '-', remove non-alphanumeric except '-', regex collapse '--+' to '-' and strip."
            },
            {
                "question_type": "code",
                "title": "Debounced Queue Batch Size Calculator",
                "difficulty": "Medium",
                "function_name": "batch_queue_events",
                "function_name_java": "batchQueueEvents",
                "question_text": "Given an array of integer event arrival timestamps `timestamps` and a debounce interval `debounce_ms`, events belong to the same batch if consecutive events arrive within <= `debounce_ms` of each other. Return the integer count of distinct batches emitted.",
                "input_format": "List of integers `timestamps`, int `debounce_ms`",
                "output_format": "Integer batch count",
                "constraints": "1 <= len(timestamps) <= 10^4",
                "examples": [
                    {"input": "timestamps = [10, 15, 20, 100, 105], debounce_ms = 10", "output": "2"}
                ],
                "starter_code": "def batch_queue_events(timestamps: list, debounce_ms: int) -> int:\n    pass\n",
                "starter_code_java": "public class Solution {\n    public int batchQueueEvents(int[] timestamps, int debounceMs) {\n        return 0;\n    }\n}\n",
                "sample_test_cases": [
                    {"inputs": [[10, 15, 20, 100, 105], 10], "expected": 2},
                    {"inputs": [[1, 2, 3], 5], "expected": 1}
                ],
                "test_cases": [
                    {"inputs": [[10, 15, 20, 100, 105], 10], "expected": 2},
                    {"inputs": [[1, 2, 3], 5], "expected": 1},
                    {"inputs": [[10, 30, 50], 5], "expected": 3},
                    {"inputs": [[5], 10], "expected": 1}
                ],
                "explanation": "Iterate through timestamps; increment batch count whenever timestamps[i] - timestamps[i-1] > debounce_ms."
            },
            {
                "question_type": "code",
                "title": "Nested Hierarchy Breadcrumb Builder",
                "difficulty": "Medium",
                "function_name": "build_breadcrumbs",
                "function_name_java": "buildBreadcrumbs",
                "question_text": "Given an array of path segments `segments` (e.g. ['dashboard', 'analytics', 'realtime']), return a list of full URL paths for each breadcrumb step: ['/dashboard', '/dashboard/analytics', '/dashboard/analytics/realtime'].",
                "input_format": "List of strings `segments`",
                "output_format": "List of strings breadcrumbs",
                "constraints": "1 <= len(segments) <= 50",
                "examples": [
                    {"input": "segments = ['docs', 'api']", "output": "['/docs', '/docs/api']"}
                ],
                "starter_code": "def build_breadcrumbs(segments: list) -> list:\n    pass\n",
                "starter_code_java": "import java.util.*;\n\npublic class Solution {\n    public String[] buildBreadcrumbs(String[] segments) {\n        return new String[0];\n    }\n}\n",
                "sample_test_cases": [
                    {"inputs": [["docs", "api"]], "expected": ["/docs", "/docs/api"]},
                    {"inputs": [["home"]], "expected": ["/home"]}
                ],
                "test_cases": [
                    {"inputs": [["docs", "api"]], "expected": ["/docs", "/docs/api"]},
                    {"inputs": [["home"]], "expected": ["/home"]},
                    {"inputs": [["a", "b", "c"]], "expected": ["/a", "/a/b", "/a/b/c"]},
                    {"inputs": [["users", "123", "settings"]], "expected": ["/users", "/users/123", "/users/123/settings"]}
                ],
                "explanation": "Accumulate '/' + segment iteratively."
            },
            {
                "question_type": "code",
                "title": "JWT Expiration Timestamp Validator",
                "difficulty": "Easy",
                "function_name": "is_jwt_expired",
                "function_name_java": "isJwtExpired",
                "question_text": "Given a token expiration epoch timestamp integer `exp_timestamp` and the current epoch timestamp integer `current_timestamp`, return True if the token is expired (i.e. current_timestamp >= exp_timestamp), otherwise False.",
                "input_format": "int `exp_timestamp`, int `current_timestamp`",
                "output_format": "Boolean",
                "constraints": "exp_timestamp >= 0, current_timestamp >= 0",
                "examples": [
                    {"input": "exp_timestamp = 1700000000, current_timestamp = 1700000500", "output": "True"}
                ],
                "starter_code": "def is_jwt_expired(exp_timestamp: int, current_timestamp: int) -> bool:\n    pass\n",
                "starter_code_java": "public class Solution {\n    public boolean isJwtExpired(int expTimestamp, int currentTimestamp) {\n        return currentTimestamp >= expTimestamp;\n    }\n}\n",
                "sample_test_cases": [
                    {"inputs": [1700000000, 1700000500], "expected": True},
                    {"inputs": [1700001000, 1700000500], "expected": False}
                ],
                "test_cases": [
                    {"inputs": [1700000000, 1700000500], "expected": True},
                    {"inputs": [1700001000, 1700000500], "expected": False},
                    {"inputs": [100, 100], "expected": True},
                    {"inputs": [500, 499], "expected": False}
                ],
                "explanation": "Check if current_timestamp >= exp_timestamp."
            }
        ]
    },

    # 9. Data Analytics & Modern Business Intelligence
    {
        "title": "Data Analytics & Modern Business Intelligence",
        "category_name": "Data Analytics & Business Intelligence",
        "category_icon": "BarChart3",
        "description": "Practical analytical statistics and BI engineering: cohort retention analysis, IQR outlier detection, conversion funnels, A/B test hypothesis testing, and moving window trends.",
        "difficulty": "INTERMEDIATE",
        "duration_minutes": 60,
        "questions": [
            {
                "question_type": "mcq",
                "title": "Cohort Retention Matrix",
                "question_text": "In product analytics, what does an N-day retention cohort measure?",
                "options": [
                    "The number of visitors on the homepage today",
                    "The percentage of users who started using the product on date X and returned to take an active action on day N",
                    "The amount of RAM retained by the server",
                    "The total number of unread email notifications"
                ],
                "correct_option_index": 1,
                "explanation": "Cohort retention isolates user groups by signup date to accurately observe feature stickiness over time without confounding aggregate growth."
            },
            {
                "question_type": "mcq",
                "title": "A/B Testing Type I vs Type II Errors",
                "question_text": "What is a Type I error (false positive) in an A/B hypothesis test?",
                "options": [
                    "Rejecting the null hypothesis when it is actually true (concluding a feature improved metrics when the difference was pure random noise)",
                    "Failing to detect a real improvement",
                    "A crash in the web browser",
                    "A database timeout"
                ],
                "correct_option_index": 0,
                "explanation": "Type I error (alpha) occurs when you claim a statistically significant effect that does not actually exist."
            },
            {
                "question_type": "mcq",
                "title": "Interquartile Range (IQR) Outlier Rule",
                "question_text": "According to Tukey's boxplot rule, how are outliers identified using IQR (Q3 - Q1)?",
                "options": [
                    "Values below Q1 - 1.5 * IQR or above Q3 + 1.5 * IQR",
                    "Any value greater than the mean",
                    "Any negative number",
                    "Values that appear more than once"
                ],
                "correct_option_index": 0,
                "explanation": "Tukey defined data points falling beyond 1.5 times the IQR from the first or third quartiles as outliers."
            },
            {
                "question_type": "mcq",
                "title": "Conversion Funnel Drop-Off Rate",
                "question_text": "If 1,000 users visit the landing page, 400 view product details, and 100 complete checkout, what is the checkout drop-off rate from the product details stage?",
                "options": [
                    "10%",
                    "75% (300 of the 400 users dropped off)",
                    "25%",
                    "90%"
                ],
                "correct_option_index": 1,
                "explanation": "Stage drop-off is calculated as (Users_stage_N - Users_stage_N+1) / Users_stage_N = (400 - 100) / 400 = 75%."
            },
            {
                "question_type": "mcq",
                "title": "Simpson's Paradox",
                "question_text": "What is Simpson's Paradox in statistical analysis?",
                "options": [
                    "A computer simulation that never terminates",
                    "A phenomenon where a trend appears in several different groups of data but disappears or reverses when the groups are combined",
                    "When two variables have zero correlation",
                    "When sample variance is negative"
                ],
                "correct_option_index": 1,
                "explanation": "Simpson's Paradox occurs when a confounding variable distorts aggregate results, underscoring the need to segment analytical metrics."
            },
            # 5 Coding Challenges
            {
                "question_type": "code",
                "title": "Conversion Funnel Drop-off Rate Calculator",
                "difficulty": "Easy",
                "function_name": "calc_dropoff_pct",
                "function_name_java": "calcDropoffPct",
                "question_text": "Given the count of users in stage A `users_a` and stage B `users_b` (where users_b <= users_a), return the drop-off percentage rounded to the nearest integer: round(((users_a - users_b) / users_a) * 100). If users_a is 0, return 0.",
                "input_format": "int `users_a`, int `users_b`",
                "output_format": "Integer drop-off percentage",
                "constraints": "users_a >= 0, 0 <= users_b <= users_a",
                "examples": [
                    {"input": "users_a = 400, users_b = 100", "output": "75"}
                ],
                "starter_code": "def calc_dropoff_pct(users_a: int, users_b: int) -> int:\n    pass\n",
                "starter_code_java": "public class Solution {\n    public int calcDropoffPct(int usersA, int usersB) {\n        return 0;\n    }\n}\n",
                "sample_test_cases": [
                    {"inputs": [400, 100], "expected": 75},
                    {"inputs": [1000, 1000], "expected": 0}
                ],
                "test_cases": [
                    {"inputs": [400, 100], "expected": 75},
                    {"inputs": [1000, 1000], "expected": 0},
                    {"inputs": [200, 50], "expected": 75},
                    {"inputs": [100, 90], "expected": 10}
                ],
                "explanation": "Compute round(((a - b) / a) * 100)."
            },
            {
                "question_type": "code",
                "title": "Simple Moving Average (SMA) Smoother",
                "difficulty": "Medium",
                "function_name": "calc_sma",
                "function_name_java": "calcSma",
                "question_text": "Given an array of integers `values` and an integer window size `k`, return a list of integer simple moving averages for each valid window of length `k` (using integer floor division of sum / k).",
                "input_format": "List of integers `values`, int `k`",
                "output_format": "List of integers",
                "constraints": "1 <= k <= len(values) <= 10^4",
                "examples": [
                    {"input": "values = [10, 20, 30, 40], k = 2", "output": "[15, 25, 35]"}
                ],
                "starter_code": "def calc_sma(values: list, k: int) -> list:\n    pass\n",
                "starter_code_java": "import java.util.*;\n\npublic class Solution {\n    public int[] calcSma(int[] values, int k) {\n        return new int[0];\n    }\n}\n",
                "sample_test_cases": [
                    {"inputs": [[10, 20, 30, 40], 2], "expected": [15, 25, 35]},
                    {"inputs": [[5, 5, 5], 3], "expected": [5]}
                ],
                "test_cases": [
                    {"inputs": [[10, 20, 30, 40], 2], "expected": [15, 25, 35]},
                    {"inputs": [[5, 5, 5], 3], "expected": [5]},
                    {"inputs": [[1, 2, 3, 4, 5], 1], "expected": [1, 2, 3, 4, 5]},
                    {"inputs": [[100, 200], 2], "expected": [150]}
                ],
                "explanation": "Slide window of size k and compute sum // k."
            },
            {
                "question_type": "code",
                "title": "Daily Retention Rate Calculator",
                "difficulty": "Easy",
                "function_name": "retention_rate",
                "function_name_java": "retentionRate",
                "question_text": "Given a list of signed-up user IDs `signup_users` and a list of active user IDs on day 7 `active_users`, return the retention rate percentage as an integer (round((len(intersection) / len(signup_users)) * 100)). If signup_users is empty, return 0.",
                "input_format": "List of integers `signup_users`, List of integers `active_users`",
                "output_format": "Integer retention percentage",
                "constraints": "1 <= len(signup_users) <= 10^4",
                "examples": [
                    {"input": "signup = [1, 2, 3, 4], active = [2, 4, 5]", "output": "50"}
                ],
                "starter_code": "def retention_rate(signup_users: list, active_users: list) -> int:\n    pass\n",
                "starter_code_java": "import java.util.*;\n\npublic class Solution {\n    public int retentionRate(int[] signupUsers, int[] activeUsers) {\n        return 0;\n    }\n}\n",
                "sample_test_cases": [
                    {"inputs": [[1, 2, 3, 4], [2, 4, 5]], "expected": 50},
                    {"inputs": [[10, 20], [10, 20]], "expected": 100}
                ],
                "test_cases": [
                    {"inputs": [[1, 2, 3, 4], [2, 4, 5]], "expected": 50},
                    {"inputs": [[10, 20], [10, 20]], "expected": 100},
                    {"inputs": [[1, 2, 3], [4, 5]], "expected": 0},
                    {"inputs": [[100], [100]], "expected": 100}
                ],
                "explanation": "Count elements of signup_users that exist in active_users set, divide by len(signup_users)."
            },
            {
                "question_type": "code",
                "title": "IQR Outlier Detector",
                "difficulty": "Medium",
                "function_name": "find_outliers",
                "function_name_java": "findOutliers",
                "question_text": "Given a list of integers `nums`, first sort the array. Let Q1 be nums[N // 4] and Q3 be nums[(3 * N) // 4]. Let IQR = Q3 - Q1. Return a list of all numbers from the original array that are strictly less than (Q1 - 1.5 * IQR) or strictly greater than (Q3 + 1.5 * IQR), sorted in ascending order.",
                "input_format": "List of integers `nums`",
                "output_format": "List of integers",
                "constraints": "4 <= len(nums) <= 1000",
                "examples": [
                    {"input": "nums = [10, 12, 11, 14, 100]", "output": "[100]"}
                ],
                "starter_code": "def find_outliers(nums: list) -> list:\n    pass\n",
                "starter_code_java": "import java.util.*;\n\npublic class Solution {\n    public int[] findOutliers(int[] nums) {\n        return new int[0];\n    }\n}\n",
                "sample_test_cases": [
                    {"inputs": [[10, 12, 11, 14, 100]], "expected": [100]},
                    {"inputs": [[1, 2, 3, 4, 5]], "expected": []}
                ],
                "test_cases": [
                    {"inputs": [[10, 12, 11, 14, 100]], "expected": [100]},
                    {"inputs": [[1, 2, 3, 4, 5]], "expected": []},
                    {"inputs": [[-50, 10, 12, 14, 15]], "expected": [-50]},
                    {"inputs": [[10, 10, 10, 10]], "expected": []}
                ],
                "explanation": "Sort array, calculate Q1, Q3, IQR, and filter outliers."
            },
            {
                "question_type": "code",
                "title": "Top-N Revenue Contributor Ratio",
                "difficulty": "Easy",
                "function_name": "top_n_revenue_ratio",
                "function_name_java": "topNRevenueRatio",
                "question_text": "Given an array of customer revenues `revenues` and an integer `n`, return the integer percentage of total revenue generated by the top `n` highest spending customers: round((sum(top_n) / sum(total)) * 100).",
                "input_format": "List of integers `revenues`, int `n`",
                "output_format": "Integer percentage",
                "constraints": "1 <= n <= len(revenues) <= 1000",
                "examples": [
                    {"input": "revenues = [100, 20, 30, 50], n = 1", "output": "50"}
                ],
                "starter_code": "def top_n_revenue_ratio(revenues: list, n: int) -> int:\n    pass\n",
                "starter_code_java": "import java.util.*;\n\npublic class Solution {\n    public int topNRevenueRatio(int[] revenues, int n) {\n        return 0;\n    }\n}\n",
                "sample_test_cases": [
                    {"inputs": [[100, 20, 30, 50], 1], "expected": 50},
                    {"inputs": [[10, 10, 10, 10], 2], "expected": 50}
                ],
                "test_cases": [
                    {"inputs": [[100, 20, 30, 50], 1], "expected": 50},
                    {"inputs": [[10, 10, 10, 10], 2], "expected": 50},
                    {"inputs": [[500], 1], "expected": 100},
                    {"inputs": [[25, 25, 25, 25], 4], "expected": 100}
                ],
                "explanation": "Sort descending, take top n, compute round((sum(top_n) / sum(all)) * 100)."
            }
        ]
    },

    # 10. Cloud Security, IAM & Zero Trust Architecture
    {
        "title": "Cloud Security, IAM & Zero Trust Architecture",
        "category_name": "Cloud Security & Governance",
        "category_icon": "ShieldCheck",
        "description": "Zero trust architecture, IAM least privilege principles, mutual TLS (mTLS), secret rotation, HMAC request signing, and OWASP API security defenses.",
        "difficulty": "ADVANCED",
        "duration_minutes": 60,
        "questions": [
            {
                "question_type": "mcq",
                "title": "Zero Trust Core Tenet",
                "question_text": "What is the foundational principle of a Zero Trust architecture ('Never Trust, Always Verify')?",
                "options": [
                    "Internal corporate network perimeter traffic is automatically trusted without credentials",
                    "No user or service is trusted by default, regardless of whether they originate inside or outside the corporate network; every request must be authenticated, authorized, and encrypted",
                    "Disabling all firewall logging",
                    "Storing private keys in public git repositories"
                ],
                "correct_option_index": 1,
                "explanation": "Zero Trust eliminates implicit trust based on network locality, requiring continuous verification, least privilege, and assumed breach posture."
            },
            {
                "question_type": "mcq",
                "title": "RBAC vs ABAC Access Control",
                "question_text": "How does Attribute-Based Access Control (ABAC) differ from traditional Role-Based Access Control (RBAC)?",
                "options": [
                    "ABAC cannot be used in cloud environments",
                    "ABAC evaluates dynamic attributes (user department, device security posture, request time, resource classification, geo-IP) rather than static assigned role names",
                    "RBAC allows only 1 user per system",
                    "ABAC does not require authentication"
                ],
                "correct_option_index": 1,
                "explanation": "ABAC offers fine-grained contextual decisions by evaluating policies against multi-attribute combinations (subject, action, resource, environment)."
            },
            {
                "question_type": "mcq",
                "title": "Mutual TLS (mTLS) Handshake",
                "question_text": "In a service mesh (like Istio or Linkerd), what makes Mutual TLS (mTLS) distinct from standard one-way TLS?",
                "options": [
                    "Only the server presents an X.509 certificate to the client",
                    "Both the client and the server validate each other's cryptographic X.509 certificates, establishing bi-directional identity verification and encrypted transit",
                    "mTLS transmits data in cleartext",
                    "mTLS does not require CPU computation"
                ],
                "correct_option_index": 1,
                "explanation": "In mTLS, both parties authenticate each other, ensuring microservices only accept calls from verified internal services."
            },
            {
                "question_type": "mcq",
                "title": "Envelope Encryption",
                "question_text": "How does Envelope Encryption protect large datasets stored in cloud object storage (e.g. AWS S3)?",
                "options": [
                    "The plaintext data is encrypted with a unique Data Encryption Key (DEK); the DEK is itself encrypted using a root Key Encryption Key (KEK) managed by KMS",
                    "Data is compressed into a zip file with no password",
                    "Only metadata headers are encrypted",
                    "Encryption keys are hardcoded into server RAM"
                ],
                "correct_option_index": 0,
                "explanation": "Envelope encryption combines fast local symmetric encryption for large data payloads with centralized KMS governance over the key that encrypts the DEK."
            },
            {
                "question_type": "mcq",
                "title": "OAuth 2.0 PKCE Flow",
                "question_text": "Why is the PKCE (Proof Key for Code Exchange) extension mandatory for public single-page applications and mobile clients in OAuth 2.0?",
                "options": [
                    "Public clients cannot securely maintain a client secret, and PKCE dynamically generates a code verifier and challenge to prevent authorization code interception attacks",
                    "PKCE disables two-factor authentication",
                    "PKCE eliminates HTTP requests",
                    "PKCE enables SQL injection testing"
                ],
                "correct_option_index": 0,
                "explanation": "Public apps cannot keep client secrets safe from reverse-engineering. PKCE binds authorization code redemption to the original initiating client."
            },
            # 5 Coding Challenges
            {
                "question_type": "code",
                "title": "RBAC Permission Matcher",
                "difficulty": "Easy",
                "function_name": "has_permission",
                "function_name_java": "hasPermission",
                "question_text": "Given a list of granted permission strings `granted` (e.g. ['read:users', 'write:orders', 'admin:*']) and a requested permission `requested` ('write:orders'), return True if `requested` is in `granted` or if 'admin:*' is in `granted`. Otherwise return False.",
                "input_format": "List of strings `granted`, String `requested`",
                "output_format": "Boolean",
                "constraints": "1 <= len(granted) <= 100",
                "examples": [
                    {"input": "granted = ['read:users'], requested = 'write:users'", "output": "False"}
                ],
                "starter_code": "def has_permission(granted: list, requested: str) -> bool:\n    pass\n",
                "starter_code_java": "import java.util.*;\n\npublic class Solution {\n    public boolean hasPermission(String[] granted, String requested) {\n        return false;\n    }\n}\n",
                "sample_test_cases": [
                    {"inputs": [["read:users", "write:orders"], "write:orders"], "expected": True},
                    {"inputs": [["read:users"], "write:users"], "expected": False}
                ],
                "test_cases": [
                    {"inputs": [["read:users", "write:orders"], "write:orders"], "expected": True},
                    {"inputs": [["read:users"], "write:users"], "expected": False},
                    {"inputs": [["admin:*"], "delete:database"], "expected": True},
                    {"inputs": [[], "read:any"], "expected": False}
                ],
                "explanation": "Check if requested in granted or 'admin:*' in granted."
            },
            {
                "question_type": "code",
                "title": "Sensitive Email Masker",
                "difficulty": "Easy",
                "function_name": "mask_email",
                "function_name_java": "maskEmail",
                "question_text": "Given an email string `email` formatted as 'username@domain.com', mask the username keeping only the first character and last character of username with 3 asterisks '***' in between, followed by '@domain.com'. (If username length is <= 2, keep the first character and 3 asterisks).",
                "input_format": "String `email`",
                "output_format": "String masked email",
                "constraints": "5 <= len(email) <= 100",
                "examples": [
                    {"input": "email = 'candidate@nexora.com'", "output": "'c***e@nexora.com'"}
                ],
                "starter_code": "def mask_email(email: str) -> str:\n    pass\n",
                "starter_code_java": "public class Solution {\n    public String maskEmail(String email) {\n        return \"\";\n    }\n}\n",
                "sample_test_cases": [
                    {"inputs": ["candidate@nexora.com"], "expected": "c***e@nexora.com"},
                    {"inputs": ["al@domain.org"], "expected": "a***@domain.org"}
                ],
                "test_cases": [
                    {"inputs": ["candidate@nexora.com"], "expected": "c***e@nexora.com"},
                    {"inputs": ["al@domain.org"], "expected": "a***@domain.org"},
                    {"inputs": ["john@example.com"], "expected": "j***n@example.com"},
                    {"inputs": ["a@b.com"], "expected": "a***@b.com"}
                ],
                "explanation": "Split on '@'; format username as user[0] + '***' + (user[-1] if len > 2 else '') + '@' + domain."
            },
            {
                "question_type": "code",
                "title": "Password Complexity Validator",
                "difficulty": "Medium",
                "function_name": "validate_password",
                "function_name_java": "validatePassword",
                "question_text": "A compliant password must have: at least 8 characters, at least 1 uppercase letter, at least 1 lowercase letter, at least 1 digit, and at least 1 special character from '!@#$%^&*'. Return True if valid, otherwise False.",
                "input_format": "String `password`",
                "output_format": "Boolean",
                "constraints": "1 <= len(password) <= 100",
                "examples": [
                    {"input": "password = 'SecurePass1!'", "output": "True"}
                ],
                "starter_code": "def validate_password(password: str) -> bool:\n    pass\n",
                "starter_code_java": "public class Solution {\n    public boolean validatePassword(String password) {\n        return false;\n    }\n}\n",
                "sample_test_cases": [
                    {"inputs": ["SecurePass1!"], "expected": True},
                    {"inputs": ["weakpass"], "expected": False}
                ],
                "test_cases": [
                    {"inputs": ["SecurePass1!"], "expected": True},
                    {"inputs": ["weakpass"], "expected": False},
                    {"inputs": ["NoSpecial123"], "expected": False},
                    {"inputs": ["Short1!"], "expected": False}
                ],
                "explanation": "Verify length >= 8 and regex flags for upper, lower, digit, and special chars."
            },
            {
                "question_type": "code",
                "title": "Credit Card Masker",
                "difficulty": "Easy",
                "function_name": "mask_card",
                "function_name_java": "maskCard",
                "question_text": "Given a 16-digit card number string `card_num`, replace the first 12 digits with '**** **** **** ' and keep the last 4 digits visible: '**** **** **** 1234'.",
                "input_format": "String `card_num` of length 16",
                "output_format": "String masked card",
                "constraints": "len(card_num) == 16",
                "examples": [
                    {"input": "card_num = '1234567812345678'", "output": "'**** **** **** 5678'"}
                ],
                "starter_code": "def mask_card(card_num: str) -> str:\n    pass\n",
                "starter_code_java": "public class Solution {\n    public String maskCard(String cardNum) {\n        return \"**** **** **** \" + cardNum.substring(12);\n    }\n}\n",
                "sample_test_cases": [
                    {"inputs": ["1234567812345678"], "expected": "**** **** **** 5678"},
                    {"inputs": ["9999888877771111"], "expected": "**** **** **** 1111"}
                ],
                "test_cases": [
                    {"inputs": ["1234567812345678"], "expected": "**** **** **** 5678"},
                    {"inputs": ["9999888877771111"], "expected": "**** **** **** 1111"},
                    {"inputs": ["0000000000000000"], "expected": "**** **** **** 0000"},
                    {"inputs": ["1111222233334444"], "expected": "**** **** **** 4444"}
                ],
                "explanation": "Return '**** **** **** ' + card_num[-4:]."
            },
            {
                "question_type": "code",
                "title": "IP Whitelist Subnet Matcher",
                "difficulty": "Medium",
                "function_name": "is_ip_whitelisted",
                "function_name_java": "isIpWhitelisted",
                "question_text": "Given an IPv4 address string `ip` (e.g. '192.168.1.50') and a list of allowed exact IPs or /24 prefixes (e.g. ['10.0.0.1', '192.168.1.*']), return True if the IP matches any exact allowed IP or matches a prefix ending with '.*' (e.g. '192.168.1.*' matches any IP starting with '192.168.1.'). Otherwise False.",
                "input_format": "String `ip`, List of strings `whitelist`",
                "output_format": "Boolean",
                "constraints": "1 <= len(whitelist) <= 100",
                "examples": [
                    {"input": "ip = '192.168.1.5', whitelist = ['192.168.1.*']", "output": "True"}
                ],
                "starter_code": "def is_ip_whitelisted(ip: str, whitelist: list) -> bool:\n    pass\n",
                "starter_code_java": "import java.util.*;\n\npublic class Solution {\n    public boolean isIpWhitelisted(String ip, String[] whitelist) {\n        return false;\n    }\n}\n",
                "sample_test_cases": [
                    {"inputs": ["192.168.1.5", ["192.168.1.*"]], "expected": True},
                    {"inputs": ["10.1.1.1", ["10.0.0.1"]], "expected": False}
                ],
                "test_cases": [
                    {"inputs": ["192.168.1.5", ["192.168.1.*"]], "expected": True},
                    {"inputs": ["10.1.1.1", ["10.0.0.1"]], "expected": False},
                    {"inputs": ["8.8.8.8", ["8.8.8.8", "1.1.1.1"]], "expected": True},
                    {"inputs": ["172.16.0.4", ["172.16.1.*"]], "expected": False}
                ],
                "explanation": "Check if ip == rule or (rule.endswith('.*') and ip.startswith(rule[:-1]))."
            }
        ]
    },

    # 11. Distributed Caching & High-Performance Redis Architecture
    {
        "title": "Distributed Caching & High-Performance Redis Architecture",
        "category_name": "High-Performance Systems & Databases",
        "category_icon": "Zap",
        "description": "Production caching patterns: Cache-Aside vs Write-Through, cache stampede mutex locking, Redis key eviction policies (LRU/LFU), Sorted Sets (ZSET), and TTL management.",
        "difficulty": "ADVANCED",
        "duration_minutes": 60,
        "questions": [
            {
                "question_type": "mcq",
                "title": "Cache Stampede (Dogpiling)",
                "question_text": "What is a Cache Stampede (or Dogpiling), and how is it reliably mitigated?",
                "options": [
                    "When hard drives overheat in the data center",
                    "When a high-traffic cache key expires simultaneously for thousands of concurrent requests, overwhelming the primary database; mitigated using distributed mutex locks or probabilistic early recomputation (XFetch)",
                    "When Redis memory becomes zero",
                    "When database tables are dropped accidentally"
                ],
                "correct_option_index": 1,
                "explanation": "A mutex lock ensures only a single thread queries the DB to repopulate the expired key while others wait or receive stale data."
            },
            {
                "question_type": "mcq",
                "title": "Redis Eviction Policies: allkeys-lru vs volatile-lru",
                "question_text": "What is the difference between Redis `allkeys-lru` and `volatile-lru` when maxmemory is reached?",
                "options": [
                    "volatile-lru only evicts keys that have an explicit expiration (TTL) set, while allkeys-lru can evict any key regardless of TTL",
                    "allkeys-lru shuts down Redis immediately",
                    "volatile-lru is 10 times slower",
                    "There is no difference"
                ],
                "correct_option_index": 0,
                "explanation": "Volatile-lru preserves persistent non-expiring configuration keys, whereas allkeys-lru uses the entire keyspace as an LRU cache."
            },
            {
                "question_type": "mcq",
                "title": "Cache-Aside Pattern Mechanics",
                "question_text": "In the standard Cache-Aside (Lazy Loading) pattern, what steps does the application take on a read request?",
                "options": [
                    "The application writes directly to Redis, and Redis asynchronously copies data to the database",
                    "The application checks the cache; on hit it returns cached data; on miss it queries the database, writes the result to cache with a TTL, and returns it",
                    "The database queries the cache before running SQL queries",
                    "The cache serves as the primary transaction log"
                ],
                "correct_option_index": 1,
                "explanation": "Cache-aside keeps the application in control: reads hit the cache first, falling back to the DB and updating the cache upon a miss."
            },
            {
                "question_type": "mcq",
                "title": "Redis Sorted Sets (ZSET) Use Case",
                "question_text": "Why are Redis Sorted Sets (ZSET) ideal for real-time leaderboards?",
                "options": [
                    "ZSET elements are paired with a floating-point score and automatically ordered using a skiplist and hash table, providing O(log N) score updates and range queries",
                    "ZSETs only store binary images",
                    "ZSETs never consume RAM",
                    "ZSETs run exclusively on single-threaded CPUs"
                ],
                "correct_option_index": 0,
                "explanation": "ZSET maintains elements ordered by score with ZADD, ZREVRANGE, and ZRANK operations in logarithmic time."
            },
            {
                "question_type": "mcq",
                "title": "Redis Single-Threaded Event Loop",
                "question_text": "How does Redis achieve hundreds of thousands of operations per second despite executing commands on a single main thread?",
                "options": [
                    "It runs all operations in RAM using non-blocking I/O multiplexing (epoll/kqueue), avoiding thread context-switching and lock contention overheads",
                    "It uses quantum computing processors",
                    "It skips memory safety checks",
                    "It executes queries in parallel on the GPU"
                ],
                "correct_option_index": 0,
                "explanation": "In-memory operations take sub-microseconds; I/O multiplexing enables a single thread to service tens of thousands of client connections without lock contention."
            },
            # 5 Coding Challenges
            {
                "question_type": "code",
                "title": "Cache Key TTL Expiration Purger",
                "difficulty": "Easy",
                "function_name": "purge_expired_keys",
                "function_name_java": "purgeExpiredKeys",
                "question_text": "Given a list of cache records where each item is [key_string, expire_epoch_int] and an integer `current_epoch`, return a list of non-expired keys (where expire_epoch > current_epoch) in their original order.",
                "input_format": "List of pairs `records`, int `current_epoch`",
                "output_format": "List of strings",
                "constraints": "1 <= len(records) <= 1000",
                "examples": [
                    {"input": "records = [['user:1', 100], ['user:2', 50]], current_epoch = 60", "output": "['user:1']"}
                ],
                "starter_code": "def purge_expired_keys(records: list, current_epoch: int) -> list:\n    pass\n",
                "starter_code_java": "import java.util.*;\n\npublic class Solution {\n    public List<String> purgeExpiredKeys(List<List<Object>> records, int currentEpoch) {\n        return new ArrayList<>();\n    }\n}\n",
                "sample_test_cases": [
                    {"inputs": [[["user:1", 100], ["user:2", 50]], 60], "expected": ["user:1"]},
                    {"inputs": [[["k1", 10]], 20], "expected": []}
                ],
                "test_cases": [
                    {"inputs": [[["user:1", 100], ["user:2", 50]], 60], "expected": ["user:1"]},
                    {"inputs": [[["k1", 10]], 20], "expected": []},
                    {"inputs": [[["a", 200], ["b", 300]], 150], "expected": ["a", "b"]},
                    {"inputs": [[["x", 50], ["y", 60]], 50], "expected": ["y"]}
                ],
                "explanation": "Filter keys where expire_epoch > current_epoch."
            },
            {
                "question_type": "code",
                "title": "Sliding Window Log Rate Limiter",
                "difficulty": "Medium",
                "function_name": "sliding_window_rate_limit",
                "function_name_java": "slidingWindowRateLimit",
                "question_text": "Given an integer `window_size` (in seconds), an integer `max_requests`, and a list of sorted request arrival timestamps `requests` (in seconds), return the integer count of requests that are ALLOWED. A request is allowed if the count of previously allowed requests in the interval [timestamp - window_size + 1, timestamp] is strictly less than max_requests.",
                "input_format": "int `window_size`, int `max_requests`, List of integers `requests`",
                "output_format": "Integer count of allowed requests",
                "constraints": "1 <= len(requests) <= 1000",
                "examples": [
                    {"input": "window_size = 10, max_requests = 2, requests = [1, 2, 5, 12]", "output": "3"}
                ],
                "starter_code": "def sliding_window_rate_limit(window_size: int, max_requests: int, requests: list) -> int:\n    pass\n",
                "starter_code_java": "import java.util.*;\n\npublic class Solution {\n    public int slidingWindowRateLimit(int windowSize, int maxRequests, int[] requests) {\n        return 0;\n    }\n}\n",
                "sample_test_cases": [
                    {"inputs": [10, 2, [1, 2, 5, 12]], "expected": 3},
                    {"inputs": [5, 1, [1, 2, 3]], "expected": 1}
                ],
                "test_cases": [
                    {"inputs": [10, 2, [1, 2, 5, 12]], "expected": 3},
                    {"inputs": [5, 1, [1, 2, 3]], "expected": 1},
                    {"inputs": [60, 5, [10, 20, 30, 40, 50]], "expected": 5},
                    {"inputs": [10, 2, [1, 1, 1, 1]], "expected": 2}
                ],
                "explanation": "Maintain a list/deque of allowed timestamps; for each request prune entries <= req - window_size; allow if size < max_requests."
            },
            {
                "question_type": "code",
                "title": "Redis Leaderboard Ranker",
                "difficulty": "Medium",
                "function_name": "get_leaderboard_top_k",
                "function_name_java": "getLeaderboardTopK",
                "question_text": "Given a list of player entries where each item is [player_name_string, score_int] and an integer `k`, return a list of the top `k` player names sorted by score in descending order. In case of tie in scores, sort player names alphabetically in ascending order.",
                "input_format": "List of pairs `entries`, int `k`",
                "output_format": "List of strings",
                "constraints": "1 <= k <= len(entries) <= 1000",
                "examples": [
                    {"input": "entries = [['Alice', 100], ['Bob', 150], ['Charlie', 100]], k = 2", "output": "['Bob', 'Alice']"}
                ],
                "starter_code": "def get_leaderboard_top_k(entries: list, k: int) -> list:\n    pass\n",
                "starter_code_java": "import java.util.*;\n\npublic class Solution {\n    public List<String> getLeaderboardTopK(List<List<Object>> entries, int k) {\n        return new ArrayList<>();\n    }\n}\n",
                "sample_test_cases": [
                    {"inputs": [[["Alice", 100], ["Bob", 150], ["Charlie", 100]], 2], "expected": ["Bob", "Alice"]},
                    {"inputs": [[["Solo", 50]], 1], "expected": ["Solo"]}
                ],
                "test_cases": [
                    {"inputs": [[["Alice", 100], ["Bob", 150], ["Charlie", 100]], 2], "expected": ["Bob", "Alice"]},
                    {"inputs": [[["Solo", 50]], 1], "expected": ["Solo"]},
                    {"inputs": [[["A", 10], ["B", 20], ["C", 30]], 3], "expected": ["C", "B", "A"]},
                    {"inputs": [[["X", 200], ["Y", 200]], 1], "expected": ["X"]}
                ],
                "explanation": "Sort entries with key lambda x: (-score, name) and extract top k names."
            },
            {
                "question_type": "code",
                "title": "Cache Hit Ratio Calculator",
                "difficulty": "Easy",
                "function_name": "calc_hit_ratio",
                "function_name_java": "calcHitRatio",
                "question_text": "Given integer counts `hits` and `misses`, calculate and return the cache hit ratio percentage rounded to the nearest integer: round((hits / (hits + misses)) * 100). If total is 0, return 0.",
                "input_format": "int `hits`, int `misses`",
                "output_format": "Integer hit percentage",
                "constraints": "hits >= 0, misses >= 0",
                "examples": [
                    {"input": "hits = 90, misses = 10", "output": "90"}
                ],
                "starter_code": "def calc_hit_ratio(hits: int, misses: int) -> int:\n    pass\n",
                "starter_code_java": "public class Solution {\n    public int calcHitRatio(int hits, int misses) {\n        return 0;\n    }\n}\n",
                "sample_test_cases": [
                    {"inputs": [90, 10], "expected": 90},
                    {"inputs": [0, 50], "expected": 0}
                ],
                "test_cases": [
                    {"inputs": [90, 10], "expected": 90},
                    {"inputs": [0, 50], "expected": 0},
                    {"inputs": [75, 25], "expected": 75},
                    {"inputs": [0, 0], "expected": 0}
                ],
                "explanation": "Compute round((hits / (hits + misses)) * 100) if hits + misses > 0 else 0."
            },
            {
                "question_type": "code",
                "title": "Consistent Hashing Node Finder",
                "difficulty": "Medium",
                "function_name": "find_server_node",
                "function_name_java": "findServerNode",
                "question_text": "Given a sorted array of server token positions on a hash ring `server_tokens` (integers 0 to 999) and a key token integer `key_token` (0 to 999), return the first server token >= key_token. If no server token is >= key_token, wrap around and return the first server token at index 0.",
                "input_format": "List of integers `server_tokens`, int `key_token`",
                "output_format": "Integer server token",
                "constraints": "1 <= len(server_tokens) <= 100",
                "examples": [
                    {"input": "server_tokens = [100, 300, 700], key_token = 250", "output": "300"}
                ],
                "starter_code": "def find_server_node(server_tokens: list, key_token: int) -> int:\n    pass\n",
                "starter_code_java": "public class Solution {\n    public int findServerNode(int[] serverTokens, int keyToken) {\n        return 0;\n    }\n}\n",
                "sample_test_cases": [
                    {"inputs": [[100, 300, 700], 250], "expected": 300},
                    {"inputs": [[100, 300, 700], 800], "expected": 100}
                ],
                "test_cases": [
                    {"inputs": [[100, 300, 700], 250], "expected": 300},
                    {"inputs": [[100, 300, 700], 800], "expected": 100},
                    {"inputs": [[50, 150], 50], "expected": 50},
                    {"inputs": [[500], 100], "expected": 500}
                ],
                "explanation": "Binary search / bisect_left on sorted tokens; wrap to index 0 if index == len."
            }
        ]
    },

    # 12. AI Workflow Automation with Python & Event-Driven Webhooks
    {
        "title": "AI Workflow Automation with Python & Event-Driven Webhooks",
        "category_name": "AI Automation & Integration",
        "category_icon": "Workflow",
        "description": "Event-driven asynchronous workflow automation: webhook signature verification, exponential backoff retries, idempotent job queues, dead letter queues (DLQ), and automated pipeline alerts.",
        "difficulty": "INTERMEDIATE",
        "duration_minutes": 60,
        "questions": [
            {
                "question_type": "mcq",
                "title": "Webhook Idempotency Keys",
                "question_text": "Why do webhooks and payment gateways (like Stripe or Shopify) include an `Idempotency-Key` header in HTTP requests?",
                "options": [
                    "To prevent duplicate processing of the same payment or event when network retries occur",
                    "To compress the HTTP payload into gzip",
                    "To change the user's password",
                    "To disable database backups"
                ],
                "correct_option_index": 0,
                "explanation": "If a webhook response is lost due to a network glitch, the caller retries with the same idempotency key; the receiver detects the key and returns the cached result without charging twice."
            },
            {
                "question_type": "mcq",
                "title": "Exponential Backoff with Full Jitter",
                "question_text": "Why is random jitter added to exponential backoff retry algorithms when communicating with upstream APIs?",
                "options": [
                    "To slow down the algorithm as much as possible",
                    "To prevent the 'Thundering Herd' problem where thousands of retrying clients strike the recovering server at identical synchronized intervals",
                    "To simulate network cable disconnects",
                    "To randomize user IDs"
                ],
                "correct_option_index": 1,
                "explanation": "Full jitter spreads retry requests evenly across time, smoothing load spikes and allowing the downstream service to recover."
            },
            {
                "question_type": "mcq",
                "title": "Dead Letter Queue (DLQ) Role",
                "question_text": "What is the primary function of a Dead Letter Queue (DLQ) in an event-driven task queue (such as Celery, SQS, or RabbitMQ)?",
                "options": [
                    "To immediately delete all failed messages permanently",
                    "To isolate messages that failed processing after reaching the maximum retry threshold, preventing poisonous messages from blocking the main queue",
                    "To forward spam emails to customer support",
                    "To restart the Redis broker node"
                ],
                "correct_option_index": 1,
                "explanation": "A DLQ captures persistently failing messages for post-mortem debugging and manual replay without degrading queue throughput."
            },
            {
                "question_type": "mcq",
                "title": "HMAC Webhook Signature Verification",
                "question_text": "Why do webhook producers sign HTTP request payloads with an HMAC (Hash-Based Message Authentication Code)?",
                "options": [
                    "To allow the receiver to verify that the webhook payload originated from the authentic sender and was not tampered with in transit",
                    "To encrypt the payload so external firewalls cannot inspect it",
                    "To reduce JSON payload size",
                    "To convert the request into a WebAssembly module"
                ],
                "correct_option_index": 0,
                "explanation": "HMAC uses a shared secret to compute a cryptographic hash of the raw payload, verifying integrity and sender authenticity."
            },
            {
                "question_type": "mcq",
                "title": "Event-Driven vs Polling Architecture",
                "question_text": "Why are event-driven webhooks generally more efficient than scheduled periodic API polling (e.g. polling every 5 seconds)?",
                "options": [
                    "Webhooks run only when an actual event occurs (push), eliminating 99% of empty redundant API requests and delivering real-time latency",
                    "Polling does not support JSON",
                    "Webhooks require no backend servers",
                    "Polling is blocked by all internet providers"
                ],
                "correct_option_index": 0,
                "explanation": "Polling wastes CPU, network bandwidth, and API rate limits on empty responses; webhooks push data immediately upon status changes."
            },
            # 5 Coding Challenges
            {
                "question_type": "code",
                "title": "Exponential Backoff Delay Calculator",
                "difficulty": "Easy",
                "function_name": "calc_backoff_delay",
                "function_name_java": "calcBackoffDelay",
                "question_text": "Given an integer retry attempt number `attempt` (0-indexed: 0, 1, 2...) and a maximum cap integer `max_cap`, calculate the backoff delay as: min(2^attempt, max_cap).",
                "input_format": "int `attempt`, int `max_cap`",
                "output_format": "Integer delay",
                "constraints": "0 <= attempt <= 20, max_cap >= 1",
                "examples": [
                    {"input": "attempt = 3, max_cap = 60", "output": "8"}
                ],
                "starter_code": "def calc_backoff_delay(attempt: int, max_cap: int) -> int:\n    pass\n",
                "starter_code_java": "public class Solution {\n    public int calcBackoffDelay(int attempt, int maxCap) {\n        return Math.min((int) Math.pow(2, attempt), maxCap);\n    }\n}\n",
                "sample_test_cases": [
                    {"inputs": [3, 60], "expected": 8},
                    {"inputs": [6, 30], "expected": 30}
                ],
                "test_cases": [
                    {"inputs": [3, 60], "expected": 8},
                    {"inputs": [6, 30], "expected": 30},
                    {"inputs": [0, 10], "expected": 1},
                    {"inputs": [10, 500], "expected": 500}
                ],
                "explanation": "Compute min(2 ** attempt, max_cap)."
            },
            {
                "question_type": "code",
                "title": "Idempotent Task Cache Filter",
                "difficulty": "Easy",
                "function_name": "filter_duplicate_events",
                "function_name_java": "filterDuplicateEvents",
                "question_text": "Given a list of incoming event IDs `event_ids` (strings), return a list of only the unique event IDs in their order of first appearance, discarding any duplicate IDs that have already been processed.",
                "input_format": "List of strings `event_ids`",
                "output_format": "List of strings unique event IDs",
                "constraints": "1 <= len(event_ids) <= 10^4",
                "examples": [
                    {"input": "event_ids = ['evt_1', 'evt_2', 'evt_1', 'evt_3']", "output": "['evt_1', 'evt_2', 'evt_3']"}
                ],
                "starter_code": "def filter_duplicate_events(event_ids: list) -> list:\n    pass\n",
                "starter_code_java": "import java.util.*;\n\npublic class Solution {\n    public String[] filterDuplicateEvents(String[] eventIds) {\n        return new String[0];\n    }\n}\n",
                "sample_test_cases": [
                    {"inputs": [["evt_1", "evt_2", "evt_1", "evt_3"]], "expected": ["evt_1", "evt_2", "evt_3"]},
                    {"inputs": [["a", "a", "a"]], "expected": ["a"]}
                ],
                "test_cases": [
                    {"inputs": [["evt_1", "evt_2", "evt_1", "evt_3"]], "expected": ["evt_1", "evt_2", "evt_3"]},
                    {"inputs": [["a", "a", "a"]], "expected": ["a"]},
                    {"inputs": [["x", "y", "z"]], "expected": ["x", "y", "z"]},
                    {"inputs": [["1", "2", "3", "2", "1"]], "expected": ["1", "2", "3"]}
                ],
                "explanation": "Use a set to track seen IDs and preserve initial insertion order."
            },
            {
                "question_type": "code",
                "title": "Dead Letter Queue Router",
                "difficulty": "Easy",
                "function_name": "route_dlq_tasks",
                "function_name_java": "routeDlqTasks",
                "question_text": "Given a list of task records where each item is [task_id_string, fail_count_int] and a maximum retry threshold integer `max_retries`, return a list of task_id strings that have reached or exceeded `max_retries` (fail_count >= max_retries).",
                "input_format": "List of pairs `tasks`, int `max_retries`",
                "output_format": "List of strings",
                "constraints": "1 <= len(tasks) <= 1000",
                "examples": [
                    {"input": "tasks = [['t1', 2], ['t2', 3], ['t3', 1]], max_retries = 3", "output": "['t2']"}
                ],
                "starter_code": "def route_dlq_tasks(tasks: list, max_retries: int) -> list:\n    pass\n",
                "starter_code_java": "import java.util.*;\n\npublic class Solution {\n    public List<String> routeDlqTasks(List<List<Object>> tasks, int maxRetries) {\n        return new ArrayList<>();\n    }\n}\n",
                "sample_test_cases": [
                    {"inputs": [[["t1", 2], ["t2", 3], ["t3", 1]], 3], "expected": ["t2"]},
                    {"inputs": [[["job_a", 5]], 3], "expected": ["job_a"]}
                ],
                "test_cases": [
                    {"inputs": [[["t1", 2], ["t2", 3], ["t3", 1]], 3], "expected": ["t2"]},
                    {"inputs": [[["job_a", 5]], 3], "expected": ["job_a"]},
                    {"inputs": [[["x", 1], ["y", 2]], 5], "expected": []},
                    {"inputs": [[["a", 4], ["b", 4]], 4], "expected": ["a", "b"]}
                ],
                "explanation": "Filter task records where fail_count >= max_retries."
            },
            {
                "question_type": "code",
                "title": "Webhook Event Type Router",
                "difficulty": "Easy",
                "function_name": "count_event_types",
                "function_name_java": "countEventTypes",
                "question_text": "Given a list of incoming webhook event topic strings `event_types` (e.g. ['payment.success', 'user.created', 'payment.success']), return a sorted list of pairs [event_type, count] sorted alphabetically by event_type.",
                "input_format": "List of strings `event_types`",
                "output_format": "List of pairs [event_type, count]",
                "constraints": "1 <= len(event_types) <= 1000",
                "examples": [
                    {"input": "event_types = ['b', 'a', 'b']", "output": "[['a', 1], ['b', 2]]"}
                ],
                "starter_code": "def count_event_types(event_types: list) -> list:\n    pass\n",
                "starter_code_java": "import java.util.*;\n\npublic class Solution {\n    public List<List<Object>> countEventTypes(String[] eventTypes) {\n        return new ArrayList<>();\n    }\n}\n",
                "sample_test_cases": [
                    {"inputs": [["b", "a", "b"]], "expected": [["a", 1], ["b", 2]]},
                    {"inputs": [["user.login"]], "expected": [["user.login", 1]]}
                ],
                "test_cases": [
                    {"inputs": [["b", "a", "b"]], "expected": [["a", 1], ["b", 2]]},
                    {"inputs": [["user.login"]], "expected": [["user.login", 1]]},
                    {"inputs": [["c", "b", "a"]], "expected": [["a", 1], ["b", 1], ["c", 1]]},
                    {"inputs": [["z", "z", "z"]], "expected": [["z", 3]]}
                ],
                "explanation": "Count frequencies using collections.Counter or HashMap, sort by key."
            },
            {
                "question_type": "code",
                "title": "Event Payload Transformer",
                "difficulty": "Medium",
                "function_name": "transform_keys",
                "function_name_java": "transformKeys",
                "question_text": "Given a list of key-value string pairs `payload` where each pair is [snake_case_key, value_string], convert every snake_case_key to camelCase (e.g. 'user_first_name' -> 'userFirstName'). Return the list of updated pairs in original order.",
                "input_format": "List of pairs `payload`",
                "output_format": "List of pairs [camelCaseKey, value]",
                "constraints": "1 <= len(payload) <= 100",
                "examples": [
                    {"input": "payload = [['order_id', '101'], ['total_amount', '50.0']]", "output": "[['orderId', '101'], ['totalAmount', '50.0']]"}
                ],
                "starter_code": "def transform_keys(payload: list) -> list:\n    pass\n",
                "starter_code_java": "import java.util.*;\n\npublic class Solution {\n    public List<List<String>> transformKeys(List<List<String>> payload) {\n        return new ArrayList<>();\n    }\n}\n",
                "sample_test_cases": [
                    {"inputs": [[["order_id", "101"], ["total_amount", "50.0"]]], "expected": [["orderId", "101"], ["totalAmount", "50.0"]]},
                    {"inputs": [[["simple", "val"]]], "expected": [["simple", "val"]]}
                ],
                "test_cases": [
                    {"inputs": [[["order_id", "101"], ["total_amount", "50.0"]]], "expected": [["orderId", "101"], ["totalAmount", "50.0"]]},
                    {"inputs": [[["simple", "val"]]], "expected": [["simple", "val"]]},
                    {"inputs": [[["first_middle_last_name", "alex"]]], "expected": [["firstMiddleLastName", "alex"]]},
                    {"inputs": [[["a_b", "1"], ["c_d", "2"]]], "expected": [["aB", "1"], ["cD", "2"]]}
                ],
                "explanation": "Split key by '_', keep first part lowercase, capitalize subsequent parts, and rejoin."
            }
        ]
    },

    # 13. Modern TypeScript & Advanced Type Systems
    {
        "title": "Modern TypeScript & Advanced Type Systems",
        "category_name": "Modern Programming Languages",
        "category_icon": "FileCode",
        "description": "Enterprise TypeScript architecture: discriminated unions, conditional types (`infer`), mapped types, exhaustiveness checking, utility types, and strict compiler configurations.",
        "difficulty": "INTERMEDIATE",
        "duration_minutes": 60,
        "questions": [
            {
                "question_type": "mcq",
                "title": "Discriminated Unions in TypeScript",
                "question_text": "What is a Discriminated (Tagged) Union in TypeScript?",
                "options": [
                    "A pattern where multiple object types share a common literal discriminant property (e.g. `type: 'circle' | 'square'`), allowing TypeScript to narrow the union in switch/if blocks",
                    "A union that rejects null values automatically",
                    "A syntax error in TypeScript 5",
                    "A database table with two primary keys"
                ],
                "correct_option_index": 0,
                "explanation": "Discriminated unions enable safe type narrowing based on a shared literal property like 'kind' or 'status'."
            },
            {
                "question_type": "mcq",
                "title": "The `unknown` Type vs `any`",
                "question_text": "Why is `unknown` preferred over `any` for handling untyped external inputs (like API JSON responses)?",
                "options": [
                    "`any` turns off all type-checking; `unknown` represents any value safely by forcing developers to perform type narrowing or assertion checks before accessing properties",
                    "`unknown` only accepts strings",
                    "`any` is deprecated in modern TypeScript",
                    "`unknown` automatically validates schemas at runtime"
                ],
                "correct_option_index": 0,
                "explanation": "`unknown` is the type-safe counterpart of `any`: you cannot perform operations on an `unknown` variable without explicit narrowing (e.g. typeof check)."
            },
            {
                "question_type": "mcq",
                "title": "The `infer` Keyword in Conditional Types",
                "question_text": "In TypeScript conditional types (`T extends (...args: any[]) => infer R ? R : any`), what does the `infer` keyword do?",
                "options": [
                    "It introduces a type variable within the conditional check that TypeScript deduces dynamically from the matched type structure",
                    "It converts TypeScript into JavaScript at compile time",
                    "It guesses user input without compilation",
                    "It runs an AI neural network to find syntax errors"
                ],
                "correct_option_index": 0,
                "explanation": "The `infer` keyword allows extraction and deduction of constituent types (such as function return types or Promise resolution values) inside conditional branches."
            },
            {
                "question_type": "mcq",
                "title": "Exhaustiveness Checking with `never`",
                "question_text": "How is the `never` type used to guarantee exhaustiveness in a switch statement over a union?",
                "options": [
                    "By assigning the switch's `default` case to a variable of type `never` (`const _exhaustive: never = action;`), causing a compile-time error if any union member was forgotten",
                    "By calling process.exit()",
                    "By throwing an unhandled runtime error",
                    "By disabling strictNullChecks"
                ],
                "correct_option_index": 0,
                "explanation": "Since `never` has no values, if any union branch is unhandled, assigning it to `never` triggers a TypeScript compiler error."
            },
            {
                "question_type": "mcq",
                "title": "Mapped Types and `keyof`",
                "question_text": "What does the mapped type `{ [K in keyof T]?: T[K] }` accomplish in TypeScript?",
                "options": [
                    "It implements the `Partial<T>` utility type, making every property in type T optional",
                    "It makes all properties readonly",
                    "It removes all string properties",
                    "It inverts keys and values"
                ],
                "correct_option_index": 0,
                "explanation": "Iterating `K in keyof T` with the `?` modifier transforms all properties of T into optional properties."
            },
            # 5 Coding Challenges
            {
                "question_type": "code",
                "title": "Discriminated Union Shape Area Calculator",
                "difficulty": "Easy",
                "function_name": "calc_shape_area",
                "function_name_java": "calcShapeArea",
                "question_text": "Given a shape record pair: ['circle', radius_float] or ['rect', width_float, height_float], return the area as an integer (rounded down): for circle return int(3.14 * r * r); for rect return int(width * height).",
                "input_format": "List of floats/strings `shape_data`",
                "output_format": "Integer area",
                "constraints": "1 <= len(shape_data) <= 3",
                "examples": [
                    {"input": "shape_data = ['circle', 10.0]", "output": "314"}
                ],
                "starter_code": "def calc_shape_area(shape_data: list) -> int:\n    pass\n",
                "starter_code_java": "import java.util.*;\n\npublic class Solution {\n    public int calcShapeArea(List<Object> shapeData) {\n        return 0;\n    }\n}\n",
                "sample_test_cases": [
                    {"inputs": [["circle", 10.0]], "expected": 314},
                    {"inputs": [["rect", 5.0, 4.0]], "expected": 20}
                ],
                "test_cases": [
                    {"inputs": [["circle", 10.0]], "expected": 314},
                    {"inputs": [["rect", 5.0, 4.0]], "expected": 20},
                    {"inputs": [["circle", 1.0]], "expected": 3},
                    {"inputs": [["rect", 10.0, 10.0]], "expected": 100}
                ],
                "explanation": "Match shape_data[0]: if 'circle' int(3.14 * r * r) else int(w * h)."
            },
            {
                "question_type": "code",
                "title": "Partial Object Merger",
                "difficulty": "Easy",
                "function_name": "merge_configs",
                "function_name_java": "mergeConfigs",
                "question_text": "Given two lists of key-value pairs `base_config` and `override_config` (where each pair is [key, value]), merge them such that overrides take precedence. Return a sorted list of pairs [key, value] sorted alphabetically by key.",
                "input_format": "List of pairs `base_config`, List of pairs `override_config`",
                "output_format": "List of pairs [key, value]",
                "constraints": "1 <= len <= 100",
                "examples": [
                    {"input": "base = [['env', 'dev'], ['port', '3000']], override = [['port', '8080']]", "output": "[['env', 'dev'], ['port', '8080']]"}
                ],
                "starter_code": "def merge_configs(base_config: list, override_config: list) -> list:\n    pass\n",
                "starter_code_java": "import java.util.*;\n\npublic class Solution {\n    public List<List<String>> mergeConfigs(List<List<String>> baseConfig, List<List<String>> overrideConfig) {\n        return new ArrayList<>();\n    }\n}\n",
                "sample_test_cases": [
                    {"inputs": [[["env", "dev"], ["port", "3000"]], [["port", "8080"]]], "expected": [["env", "dev"], ["port", "8080"]]},
                    {"inputs": [[["a", "1"]], [["b", "2"]]], "expected": [["a", "1"], ["b", "2"]]}
                ],
                "test_cases": [
                    {"inputs": [[["env", "dev"], ["port", "3000"]], [["port", "8080"]]], "expected": [["env", "dev"], ["port", "8080"]]},
                    {"inputs": [[["a", "1"]], [["b", "2"]]], "expected": [["a", "1"], ["b", "2"]]},
                    {"inputs": [[["k", "v1"]], [["k", "v2"]]], "expected": [["k", "v2"]]},
                    {"inputs": [[], [["x", "y"]]], "expected": [["x", "y"]]}
                ],
                "explanation": "Create a dictionary, update with base, update with override, sort by key."
            },
            {
                "question_type": "code",
                "title": "Dot-Notation Path Value Extractor",
                "difficulty": "Medium",
                "function_name": "extract_dot_path",
                "function_name_java": "extractDotPath",
                "question_text": "Given a list of flat paths and values `records` where each item is [dot_path_string, value_string] (e.g. ['user.profile.name', 'Alice']) and a query string `target_path`, return the matching value string. If not found, return 'NOT_FOUND'.",
                "input_format": "List of pairs `records`, String `target_path`",
                "output_format": "String value",
                "constraints": "1 <= len(records) <= 100",
                "examples": [
                    {"input": "records = [['user.name', 'Alex']], target_path = 'user.name'", "output": "'Alex'"}
                ],
                "starter_code": "def extract_dot_path(records: list, target_path: str) -> str:\n    pass\n",
                "starter_code_java": "import java.util.*;\n\npublic class Solution {\n    public String extractDotPath(List<List<String>> records, String targetPath) {\n        return \"NOT_FOUND\";\n    }\n}\n",
                "sample_test_cases": [
                    {"inputs": [[["user.name", "Alex"]], "user.name"], "expected": "Alex"},
                    {"inputs": [[["a.b", "1"]], "a.c"], "expected": "NOT_FOUND"}
                ],
                "test_cases": [
                    {"inputs": [[["user.name", "Alex"]], "user.name"], "expected": "Alex"},
                    {"inputs": [[["a.b", "1"]], "a.c"], "expected": "NOT_FOUND"},
                    {"inputs": [[["server.port", "8080"], ["server.host", "localhost"]], "server.port"], "expected": "8080"},
                    {"inputs": [[["x", "10"]], "x"], "expected": "10"}
                ],
                "explanation": "Find pair matching target_path."
            },
            {
                "question_type": "code",
                "title": "Unique Value Deduplicator",
                "difficulty": "Easy",
                "function_name": "unique_values",
                "function_name_java": "uniqueValues",
                "question_text": "Given an array of integers `nums`, return a sorted list of unique integers in ascending order.",
                "input_format": "List of integers `nums`",
                "output_format": "List of integers",
                "constraints": "1 <= len(nums) <= 1000",
                "examples": [
                    {"input": "nums = [3, 1, 2, 3, 1]", "output": "[1, 2, 3]"}
                ],
                "starter_code": "def unique_values(nums: list) -> list:\n    pass\n",
                "starter_code_java": "import java.util.*;\n\npublic class Solution {\n    public int[] uniqueValues(int[] nums) {\n        return new int[0];\n    }\n}\n",
                "sample_test_cases": [
                    {"inputs": [[3, 1, 2, 3, 1]], "expected": [1, 2, 3]},
                    {"inputs": [[5, 5, 5]], "expected": [5]}
                ],
                "test_cases": [
                    {"inputs": [[3, 1, 2, 3, 1]], "expected": [1, 2, 3]},
                    {"inputs": [[5, 5, 5]], "expected": [5]},
                    {"inputs": [[10, 20, 30]], "expected": [10, 20, 30]},
                    {"inputs": [[-1, -5, -1, 0]], "expected": [-5, -1, 0]}
                ],
                "explanation": "Return sorted(list(set(nums)))."
            },
            {
                "question_type": "code",
                "title": "Array Flatten Deep 1 Level",
                "difficulty": "Easy",
                "function_name": "flatten_once",
                "function_name_java": "flattenOnce",
                "question_text": "Given a 2D array of strings `nested`, return a single 1D array of strings containing all elements concatenated in order.",
                "input_format": "List of lists of strings `nested`",
                "output_format": "List of strings",
                "constraints": "0 <= len(nested) <= 100",
                "examples": [
                    {"input": "nested = [['a', 'b'], ['c']]", "output": "['a', 'b', 'c']"}
                ],
                "starter_code": "def flatten_once(nested: list) -> list:\n    pass\n",
                "starter_code_java": "import java.util.*;\n\npublic class Solution {\n    public String[] flattenOnce(String[][] nested) {\n        return new String[0];\n    }\n}\n",
                "sample_test_cases": [
                    {"inputs": [[["a", "b"], ["c"]]], "expected": ["a", "b", "c"]},
                    {"inputs": [[[]]], "expected": []}
                ],
                "test_cases": [
                    {"inputs": [[["a", "b"], ["c"]]], "expected": ["a", "b", "c"]},
                    {"inputs": [[[]]], "expected": []},
                    {"inputs": [[["1"], ["2", "3"]]], "expected": ["1", "2", "3"]},
                    {"inputs": [[["x", "y", "z"]]], "expected": ["x", "y", "z"]}
                ],
                "explanation": "Flatten 2D array into 1D."
            }
        ]
    },

    # 14. NoSQL & Distributed Key-Value Document Stores
    {
        "title": "NoSQL & Distributed Key-Value Document Stores",
        "category_name": "Distributed Databases & NoSQL",
        "category_icon": "Layers",
        "description": "Distributed NoSQL architectures: DynamoDB partition vs sort keys, CAP theorem trade-offs, MongoDB aggregation pipelines, eventual consistency, and secondary indexing patterns.",
        "difficulty": "INTERMEDIATE",
        "duration_minutes": 60,
        "questions": [
            {
                "question_type": "mcq",
                "title": "DynamoDB Partition Key vs Sort Key",
                "question_text": "In Amazon DynamoDB, what is the role of the Partition (Hash) Key versus the Sort (Range) Key?",
                "options": [
                    "The partition key determines which physical storage node hosts the item via a hash function; the sort key determines how items with the same partition key are ordered on that node",
                    "The sort key encrypts the data",
                    "The partition key is only used during backups",
                    "Both keys perform identical string comparisons"
                ],
                "correct_option_index": 0,
                "explanation": "Partition keys distribute items uniformly across cluster partitions; sort keys allow efficient range queries (e.g. BETWEEN, >) within that partition."
            },
            {
                "question_type": "mcq",
                "title": "The CAP Theorem Trade-Off",
                "question_text": "According to Brewer's CAP Theorem, when an unavoidable network partition (P) occurs between distributed database nodes, what choice must the system make?",
                "options": [
                    "It must trade off between Consistency (returning errors rather than stale data) or Availability (serving reads even if data is temporarily stale)",
                    "It automatically provisions 1,000 more servers",
                    "It converts relational tables into JSON files",
                    "It shuts down all power in the data center"
                ],
                "correct_option_index": 0,
                "explanation": "Since network partitions are unavoidable in distributed systems, a system can only guarantee either strict consistency (CP) or high availability (AP)."
            },
            {
                "question_type": "mcq",
                "title": "Eventual Consistency & Read After Write",
                "question_text": "Why might a client immediately read stale data after a successful write in an eventually consistent distributed store (e.g. Cassandra or DynamoDB with standard reads)?",
                "options": [
                    "The read request was routed to a replica node that has not yet received the asynchronous replication gossip update from the write coordinator node",
                    "The database hard drive crashed",
                    "The data was corrupted by malware",
                    "NoSQL databases cannot read data"
                ],
                "correct_option_index": 0,
                "explanation": "Asynchronous replication introduces a brief replication lag before all quorum replicas achieve consistency."
            },
            {
                "question_type": "mcq",
                "title": "MongoDB Document Embedding vs Referencing",
                "question_text": "When is embedding child documents inside a parent MongoDB document preferred over normalizing with `_id` references?",
                "options": [
                    "When child data is small, bounded, and almost always accessed together with the parent (e.g. a user's address list), enabling atomic single-document reads without joins",
                    "When the child array grows infinitely to millions of items",
                    "When the child document exceeds the 16MB document size limit",
                    "When relational foreign keys are strictly required"
                ],
                "correct_option_index": 0,
                "explanation": "Embedding provides 1:1 or 1:few atomic reads and avoids multitable joins, provided the array remains bounded within MongoDB's 16MB limit."
            },
            {
                "question_type": "mcq",
                "title": "Secondary Index Write Amplification",
                "question_text": "What is the primary operational trade-off of adding multiple Global Secondary Indexes (GSIs) to a NoSQL table?",
                "options": [
                    "GSIs increase query flexibility but incur write amplification, consuming extra Write Capacity Units (WCUs) and storage for every item inserted or updated",
                    "GSIs prevent primary key lookups",
                    "GSIs can only store boolean values",
                    "GSIs disable table backups"
                ],
                "correct_option_index": 0,
                "explanation": "Every write or update to the base table must be asynchronously replicated to all affected GSIs, multiplying write I/O and cloud cost."
            },
            # 5 Coding Challenges
            {
                "question_type": "code",
                "title": "DynamoDB Composite Key Generator",
                "difficulty": "Easy",
                "function_name": "build_composite_key",
                "function_name_java": "buildCompositeKey",
                "question_text": "Given an entity prefix `entity_type` (e.g. 'USER') and an entity identifier `id_val` (e.g. '12345'), return the composite key string formatted as 'PREFIX#ID' (e.g. 'USER#12345').",
                "input_format": "String `entity_type`, String `id_val`",
                "output_format": "String composite key",
                "constraints": "1 <= len <= 50",
                "examples": [
                    {"input": "entity_type = 'ORDER', id_val = '999'", "output": "'ORDER#999'"}
                ],
                "starter_code": "def build_composite_key(entity_type: str, id_val: str) -> str:\n    pass\n",
                "starter_code_java": "public class Solution {\n    public String buildCompositeKey(String entityType, String idVal) {\n        return entityType + \"#\" + idVal;\n    }\n}\n",
                "sample_test_cases": [
                    {"inputs": ["ORDER", "999"], "expected": "ORDER#999"},
                    {"inputs": ["USER", "42"], "expected": "USER#42"}
                ],
                "test_cases": [
                    {"inputs": ["ORDER", "999"], "expected": "ORDER#999"},
                    {"inputs": ["USER", "42"], "expected": "USER#42"},
                    {"inputs": ["TENANT", "acme_corp"], "expected": "TENANT#acme_corp"},
                    {"inputs": ["ITEM", "001"], "expected": "ITEM#001"}
                ],
                "explanation": "Return f'{entity_type}#{id_val}'."
            },
            {
                "question_type": "code",
                "title": "JSON Document Property Matcher",
                "difficulty": "Easy",
                "function_name": "matches_query",
                "function_name_java": "matchesQuery",
                "question_text": "Given a list of document key-value pairs `doc` (where each item is [key_string, value_string]) and target filter strings `filter_key` and `filter_val`, return True if the document contains a pair matching both filter_key and filter_val, otherwise False.",
                "input_format": "List of pairs `doc`, String `filter_key`, String `filter_val`",
                "output_format": "Boolean",
                "constraints": "1 <= len(doc) <= 100",
                "examples": [
                    {"input": "doc = [['status', 'active'], ['role', 'admin']], filter_key = 'status', filter_val = 'active'", "output": "True"}
                ],
                "starter_code": "def matches_query(doc: list, filter_key: str, filter_val: str) -> bool:\n    pass\n",
                "starter_code_java": "import java.util.*;\n\npublic class Solution {\n    public boolean matchesQuery(List<List<String>> doc, String filterKey, String filterVal) {\n        return false;\n    }\n}\n",
                "sample_test_cases": [
                    {"inputs": [[["status", "active"], ["role", "admin"]], "status", "active"], "expected": True},
                    {"inputs": [[["status", "pending"]], "status", "active"], "expected": False}
                ],
                "test_cases": [
                    {"inputs": [[["status", "active"], ["role", "admin"]], "status", "active"], "expected": True},
                    {"inputs": [[["status", "pending"]], "status", "active"], "expected": False},
                    {"inputs": [[["type", "order"], ["amount", "100"]], "amount", "100"], "expected": True},
                    {"inputs": [[], "any", "val"], "expected": False}
                ],
                "explanation": "Check if [filter_key, filter_val] in doc."
            },
            {
                "question_type": "code",
                "title": "Sharded Partition Assignment",
                "difficulty": "Easy",
                "function_name": "calc_shard_id",
                "function_name_java": "calcShardId",
                "question_text": "Given an integer user ID `user_id` and total number of shards `num_shards`, return the assigned shard ID as: (user_id * 31) % num_shards.",
                "input_format": "int `user_id`, int `num_shards`",
                "output_format": "Integer shard ID",
                "constraints": "user_id >= 0, num_shards >= 1",
                "examples": [
                    {"input": "user_id = 10, num_shards = 4", "output": "2"}
                ],
                "starter_code": "def calc_shard_id(user_id: int, num_shards: int) -> int:\n    pass\n",
                "starter_code_java": "public class Solution {\n    public int calcShardId(int userId, int numShards) {\n        return (userId * 31) % numShards;\n    }\n}\n",
                "sample_test_cases": [
                    {"inputs": [10, 4], "expected": 2},
                    {"inputs": [5, 2], "expected": 1}
                ],
                "test_cases": [
                    {"inputs": [10, 4], "expected": 2},
                    {"inputs": [5, 2], "expected": 1},
                    {"inputs": [100, 8], "expected": 4},
                    {"inputs": [0, 5], "expected": 0}
                ],
                "explanation": "Compute (user_id * 31) % num_shards."
            },
            {
                "question_type": "code",
                "title": "Document Array Unwind",
                "difficulty": "Medium",
                "function_name": "unwind_tags",
                "function_name_java": "unwindTags",
                "question_text": "Simulate MongoDB `$unwind`: given an integer `doc_id` and a list of tag strings `tags`, return a list of pairs where each pair is [doc_id, tag]. If tags is empty, return an empty list.",
                "input_format": "int `doc_id`, List of strings `tags`",
                "output_format": "List of pairs [doc_id, tag]",
                "constraints": "0 <= len(tags) <= 100",
                "examples": [
                    {"input": "doc_id = 101, tags = ['react', 'node']", "output": "[[101, 'react'], [101, 'node']]"}
                ],
                "starter_code": "def unwind_tags(doc_id: int, tags: list) -> list:\n    pass\n",
                "starter_code_java": "import java.util.*;\n\npublic class Solution {\n    public List<List<Object>> unwindTags(int docId, String[] tags) {\n        return new ArrayList<>();\n    }\n}\n",
                "sample_test_cases": [
                    {"inputs": [101, ["react", "node"]], "expected": [[101, "react"], [101, "node"]]},
                    {"inputs": [202, []], "expected": []}
                ],
                "test_cases": [
                    {"inputs": [101, ["react", "node"]], "expected": [[101, "react"], [101, "node"]]},
                    {"inputs": [202, []], "expected": []},
                    {"inputs": [500, ["single"]], "expected": [[500, "single"]]},
                    {"inputs": [1, ["a", "b", "c"]], "expected": [[1, "a"], [1, "b"], [1, "c"]]}
                ],
                "explanation": "Return [[doc_id, tag] for tag in tags]."
            },
            {
                "question_type": "code",
                "title": "Inverted Index Keyword Search",
                "difficulty": "Medium",
                "function_name": "search_inverted_index",
                "function_name_java": "searchInvertedIndex",
                "question_text": "Given a list of index postings where each item is [keyword_string, list_of_doc_ids] (e.g. [['nosql', [1, 3]], ['redis', [2, 3]]]) and a query string `search_term`, return the sorted list of matching doc IDs. If the search term is not found, return an empty list [].",
                "input_format": "List of pairs `postings`, String `search_term`",
                "output_format": "List of integers",
                "constraints": "1 <= len(postings) <= 100",
                "examples": [
                    {"input": "postings = [['nosql', [1, 3]], ['redis', [2, 3]]], search_term = 'nosql'", "output": "[1, 3]"}
                ],
                "starter_code": "def search_inverted_index(postings: list, search_term: str) -> list:\n    pass\n",
                "starter_code_java": "import java.util.*;\n\npublic class Solution {\n    public int[] searchInvertedIndex(List<List<Object>> postings, String searchTerm) {\n        return new int[0];\n    }\n}\n",
                "sample_test_cases": [
                    {"inputs": [[["nosql", [1, 3]], ["redis", [2, 3]]], "nosql"], "expected": [1, 3]},
                    {"inputs": [[["sql", [10]]], "graphql"], "expected": []}
                ],
                "test_cases": [
                    {"inputs": [[["nosql", [1, 3]], ["redis", [2, 3]]], "nosql"], "expected": [1, 3]},
                    {"inputs": [[["sql", [10]]], "graphql"], "expected": []},
                    {"inputs": [[["db", [5, 2, 8]]], "db"], "expected": [2, 5, 8]},
                    {"inputs": [[["a", [1]], ["b", [2]]], "b"], "expected": [2]}
                ],
                "explanation": "Find entry matching search_term and return sorted list of doc IDs."
            }
        ]
    }
]

def seed():
    print(f"Starting seed of {len(COURSES_DATA)} New Trending Courses...")
    courses_created = 0
    questions_created = 0

    for cdata in COURSES_DATA:
        category, _ = AssessmentCategory.objects.get_or_create(
            name=cdata["category_name"],
            defaults={"icon_name": cdata.get("category_icon", "Code")}
        )

        assessment, created = Assessment.objects.get_or_create(
            title=cdata["title"],
            defaults={
                "category": category,
                "description": cdata["description"],
                "duration_minutes": cdata.get("duration_minutes", 60),
                "passing_score": 70,
                "difficulty": cdata.get("difficulty", Assessment.Difficulty.INTERMEDIATE),
                "is_active": True
            }
        )

        if not created:
            # Update duration to 60 if not already
            if assessment.duration_minutes != 60:
                assessment.duration_minutes = 60
                assessment.save()
            # Clear old questions for clean re-seed
            assessment.questions.all().delete()
            print(f"Refreshed existing assessment: {assessment.title}")
        else:
            courses_created += 1
            print(f"Created new assessment: {assessment.title}")

        for idx, qdata in enumerate(cdata["questions"]):
            order = idx + 1
            Question.objects.create(
                assessment=assessment,
                order=order,
                question_type=qdata.get("question_type", Question.QuestionType.MCQ),
                title=qdata.get("title", f"Question {order}"),
                difficulty=qdata.get("difficulty", "Medium" if qdata.get("question_type") == "code" else "Easy"),
                question_text=qdata.get("question_text", ""),
                input_format=qdata.get("input_format", ""),
                output_format=qdata.get("output_format", ""),
                constraints=qdata.get("constraints", ""),
                examples=qdata.get("examples", []),
                language="python",
                options=qdata.get("options", []),
                correct_option_index=qdata.get("correct_option_index", 0),
                starter_code=qdata.get("starter_code", ""),
                starter_code_java=qdata.get("starter_code_java", ""),
                function_name=qdata.get("function_name", "solution"),
                function_name_java=qdata.get("function_name_java", "solution"),
                sample_test_cases=qdata.get("sample_test_cases", []),
                test_cases=qdata.get("test_cases", []),
                explanation=qdata.get("explanation", "")
            )
            questions_created += 1

    print(f"\nDone! Created/Updated {len(COURSES_DATA)} courses ({courses_created} new) with {questions_created} total questions.")

if __name__ == "__main__":
    seed()
