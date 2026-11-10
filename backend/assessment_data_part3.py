"""
Assessment Question Bank - Part 3 (Assessments 10 through 16).
Each assessment contains 5 MCQs and 5 LeetCode-style Coding Challenges.
"""

PART3_DATA = {}

# ==============================================================================
# 10. System Design & Microservices Architecture (microservices-system-design-architecture)
# ==============================================================================
PART3_DATA["microservices-system-design-architecture"] = [
    # MCQs (1-5)
    {
        "question_type": "mcq",
        "title": "CAP Theorem",
        "question_text": "According to Eric Brewer's CAP Theorem, in the presence of a network partition (P) between data centers, a distributed system must choose between:",
        "options": [
            "Speed vs Bandwidth",
            "Consistency (C) vs Availability (A)",
            "Scalability vs Security",
            "ACID vs BASE"
        ],
        "correct_option_index": 1,
        "explanation": "When network partition occurs (nodes cannot communicate), the system can either refuse requests to preserve consistency or serve stale data to preserve availability."
    },
    {
        "question_type": "mcq",
        "title": "Circuit Breaker Pattern",
        "question_text": "What is the primary function of the 'Half-Open' state in a Circuit Breaker pattern?",
        "options": [
            "To permanently drop all inbound customer requests",
            "To allow a limited trial number of requests through to test if the downstream service has recovered",
            "To reboot the application container",
            "To redirect traffic to a relational database"
        ],
        "correct_option_index": 1,
        "explanation": "The Half-Open state allows a few test requests through to evaluate if the failing upstream dependency is healthy again."
    },
    {
        "question_type": "mcq",
        "title": "Idempotency in REST APIs",
        "question_text": "Why do distributed payment gateways require an `Idempotency-Key` HTTP request header?",
        "options": [
            "To encrypt credit card numbers",
            "To guarantee that retrying a failed or timed-out network request does not result in duplicate customer charges",
            "To compress the JSON body payload",
            "To route requests to the nearest edge location"
        ],
        "correct_option_index": 1,
        "explanation": "An idempotency key allows the server to recognize duplicate requests and return the original cached response without re-executing the payment."
    },
    {
        "question_type": "mcq",
        "title": "Consistent Hashing",
        "question_text": "What is the key advantage of Consistent Hashing over simple modulo hashing `hash(key) % N` in distributed caches?",
        "options": [
            "It eliminates all hash computation latency",
            "When a cache node is added or removed, only K/N keys need to be remapped on average rather than almost all keys",
            "It stores all keys on a single master node",
            "It automatically compresses string keys"
        ],
        "correct_option_index": 1,
        "explanation": "Consistent hashing arranges nodes on a hash ring so that adding/removing a server only reassigns keys adjacent to that server."
    },
    {
        "question_type": "mcq",
        "title": "Kafka Partition Scaling",
        "question_text": "In Apache Kafka, what determines the maximum number of consumer instances that can actively read in parallel from a consumer group?",
        "options": [
            "The number of RAM gigabytes on the consumer machine",
            "The number of topic partitions",
            "The cluster broker count",
            "The ZooKeeper heartbeat interval"
        ],
        "correct_option_index": 1,
        "explanation": "Within a consumer group, each partition is consumed by at most one consumer instance at a time. Extra consumers remain idle."
    },
    # Coding Challenges (6-10)
    {
        "question_type": "code",
        "title": "Sliding Window Rate Limiter",
        "difficulty": "Medium",
        "language": "python",
        "function_name": "is_rate_limited",
        "question_text": "Given a list of past request timestamps (in seconds), a new request `timestamp`, `max_requests`, and `window_secs`, return `True` if the new request should be rate-limited (rejected) and `False` if allowed. Only requests occurring within `(timestamp - window_secs, timestamp]` count.",
        "input_format": "List of floats `past_timestamps`, float `timestamp`, integer `max_requests`, integer `window_secs`",
        "output_format": "Boolean `True` or `False`",
        "constraints": "max_requests >= 1, window_secs >= 1",
        "examples": [
            {"input": "past = [1.0, 1.5], now = 2.0, max_req = 2, window = 2", "output": "True", "explanation": "2 requests already exist within (0.0, 2.0]."}
        ],
        "starter_code": "def is_rate_limited(past_timestamps, timestamp, max_requests, window_secs):\n    # Write your solution below\n    cutoff = timestamp - window_secs\n    active = [t for t in past_timestamps if t > cutoff and t <= timestamp]\n    return len(active) >= max_requests\n",
        "sample_test_cases": [
            {"inputs": [[1.0, 1.5], 2.0, 2, 2], "expected": True},
            {"inputs": [[1.0], 5.0, 2, 2], "expected": False}
        ],
        "test_cases": [
            {"inputs": [[1.0, 1.5], 2.0, 2, 2], "expected": True},
            {"inputs": [[1.0], 5.0, 2, 2], "expected": False},
            {"inputs": [[], 10.0, 5, 60], "expected": False}
        ],
        "explanation": "Count timestamps strictly greater than cutoff = timestamp - window_secs."
    },
    {
        "question_type": "code",
        "title": "Circuit Breaker State Machine",
        "difficulty": "Medium",
        "language": "python",
        "function_name": "evaluate_breaker",
        "question_text": "Given `consecutive_failures`, `failure_threshold`, `last_failure_timestamp`, `current_timestamp`, and `cooldown_seconds`, return the circuit breaker state: `'CLOSED'` (healthy, failures < threshold), `'OPEN'` (failing, within cooldown period), or `'HALF_OPEN'` (cooldown elapsed, testing recovery).",
        "input_format": "Integers and timestamps",
        "output_format": "String: 'CLOSED', 'OPEN', or 'HALF_OPEN'",
        "constraints": "All numbers >= 0",
        "examples": [
            {"input": "failures = 5, threshold = 5, last_fail = 100, now = 120, cooldown = 30", "output": "'OPEN'", "explanation": "Elapsed 20s < 30s cooldown."}
        ],
        "starter_code": "def evaluate_breaker(consecutive_failures, failure_threshold, last_failure_timestamp, current_timestamp, cooldown_seconds):\n    # Write your solution below\n    if consecutive_failures < failure_threshold:\n        return 'CLOSED'\n    if current_timestamp - last_failure_timestamp < cooldown_seconds:\n        return 'OPEN'\n    return 'HALF_OPEN'\n",
        "sample_test_cases": [
            {"inputs": [5, 5, 100, 120, 30], "expected": "OPEN"},
            {"inputs": [5, 5, 100, 150, 30], "expected": "HALF_OPEN"}
        ],
        "test_cases": [
            {"inputs": [5, 5, 100, 120, 30], "expected": "OPEN"},
            {"inputs": [5, 5, 100, 150, 30], "expected": "HALF_OPEN"},
            {"inputs": [2, 5, 100, 110, 30], "expected": "CLOSED"}
        ],
        "explanation": "Evaluate threshold check then elapsed cooldown delta."
    },
    {
        "question_type": "code",
        "title": "Idempotent Event Deduplicator",
        "difficulty": "Easy",
        "language": "python",
        "function_name": "process_events",
        "question_text": "Given a stream of incoming event records `[{'id': 'evt_1', 'payload': 100}, ...]`, return a tuple `(unique_processed_count, duplicate_rejected_count, total_value)`. Ignore duplicate events that share an already processed `id`.",
        "input_format": "List of event dictionaries",
        "output_format": "List of 3 integers: `[unique_count, duplicate_count, total_value]`",
        "constraints": "0 <= len(events) <= 10^4",
        "examples": [
            {"input": "events = [{'id': 'a', 'payload': 10}, {'id': 'b', 'payload': 20}, {'id': 'a', 'payload': 10}]", "output": "[2, 1, 30]", "explanation": "2 unique, 1 duplicate rejected."}
        ],
        "starter_code": "def process_events(events):\n    # Write your solution below\n    seen = set()\n    unique_cnt = 0\n    duplicate_cnt = 0\n    total_val = 0\n    for evt in events:\n        eid = evt.get('id')\n        if eid in seen:\n            duplicate_cnt += 1\n        else:\n            seen.add(eid)\n            unique_cnt += 1\n            total_val += evt.get('payload', 0)\n    return [unique_cnt, duplicate_cnt, total_val]\n",
        "sample_test_cases": [
            {"inputs": [[{"id": "a", "payload": 10}, {"id": "b", "payload": 20}, {"id": "a", "payload": 10}]], "expected": [2, 1, 30]},
            {"inputs": [[]], "expected": [0, 0, 0]}
        ],
        "test_cases": [
            {"inputs": [[{"id": "a", "payload": 10}, {"id": "b", "payload": 20}, {"id": "a", "payload": 10}]], "expected": [2, 1, 30]},
            {"inputs": [[]], "expected": [0, 0, 0]},
            {"inputs": [[{"id": "x", "payload": 50}]], "expected": [1, 0, 50]}
        ],
        "explanation": "Track seen IDs with a set and sum unique payloads."
    },
    {
        "question_type": "code",
        "title": "Consistent Hashing Ring Mapper",
        "difficulty": "Hard",
        "language": "python",
        "function_name": "assign_node",
        "question_text": "Given a list of integer server node positions on a 360-degree ring `[60, 180, 300]` and a key hash position `key_pos` (0-359), return the server position that owns the key (the first server whose position >= key_pos in clockwise direction, wrapping around to the first server if past the last).",
        "input_format": "List of sorted server positions and integer `key_pos`",
        "output_format": "Integer server position",
        "constraints": "Server positions are distinct and sorted.",
        "examples": [
            {"input": "servers = [60, 180, 300], key_pos = 100", "output": "180", "explanation": "180 is the next clockwise node after 100."}
        ],
        "starter_code": "def assign_node(servers, key_pos):\n    # Write your solution below\n    for s in servers:\n        if s >= key_pos:\n            return s\n    return servers[0]\n",
        "sample_test_cases": [
            {"inputs": [[60, 180, 300], 100], "expected": 180},
            {"inputs": [[60, 180, 300], 350], "expected": 60}
        ],
        "test_cases": [
            {"inputs": [[60, 180, 300], 100], "expected": 180},
            {"inputs": [[60, 180, 300], 350], "expected": 60},
            {"inputs": [[50], 10], "expected": 50}
        ],
        "explanation": "Clockwise search with modular wrap-around to index 0."
    },
    {
        "question_type": "code",
        "title": "Retry with Exponential Backoff Simulator",
        "difficulty": "Easy",
        "language": "python",
        "function_name": "calculate_backoffs",
        "question_text": "Given `base_delay_ms`, `max_retries`, and `max_delay_ms`, return a list of sleep durations for each attempt: `min(max_delay_ms, base_delay_ms * (2 ** attempt))` for `attempt` from 0 to `max_retries - 1`.",
        "input_format": "Integers `base_delay_ms`, `max_retries`, `max_delay_ms`",
        "output_format": "List of integer milliseconds",
        "constraints": "base_delay_ms >= 1, max_retries >= 1",
        "examples": [
            {"input": "base = 100, retries = 3, max = 500", "output": "[100, 200, 400]", "explanation": "100*1, 100*2, 100*4."}
        ],
        "starter_code": "def calculate_backoffs(base_delay_ms, max_retries, max_delay_ms):\n    # Write your solution below\n    return [min(max_delay_ms, base_delay_ms * (2 ** i)) for i in range(max_retries)]\n",
        "sample_test_cases": [
            {"inputs": [100, 3, 500], "expected": [100, 200, 400]},
            {"inputs": [100, 4, 300], "expected": [100, 200, 300, 300]}
        ],
        "test_cases": [
            {"inputs": [100, 3, 500], "expected": [100, 200, 400]},
            {"inputs": [100, 4, 300], "expected": [100, 200, 300, 300]}
        ],
        "explanation": "Multiply base delay by powers of 2 capped at max delay."
    }
]

# ==============================================================================
# 11. Python Fundamentals & Coding (python-core-hands-on-coding-challenges)
# ==============================================================================
PART3_DATA["python-core-hands-on-coding-challenges"] = [
    # MCQs (1-5)
    {
        "question_type": "mcq",
        "title": "List Comprehensions vs map()",
        "question_text": "In modern Python 3, what does `map(func, iterable)` return?",
        "options": [
            "A newly allocated list containing all mapped values",
            "A lazy iterator object that yields transformed items on demand",
            "A dictionary mapping indices to values",
            "A generator with tail-call recursion optimization"
        ],
        "correct_option_index": 1,
        "explanation": "In Python 3, `map` returns an iterator rather than a list, consuming minimal memory until consumed."
    },
    {
        "question_type": "mcq",
        "title": "if __name__ == '__main__'",
        "question_text": "What is the primary purpose of the boilerplate `if __name__ == '__main__':` in a Python script?",
        "options": [
            "To allow the script to be imported as a module without executing top-level script statements",
            "To ensure the script runs with root administrator privileges",
            "To prevent syntax errors during bytecode compilation",
            "To define the script's entry point for CPython threading"
        ],
        "correct_option_index": 0,
        "explanation": "When executed directly, `__name__` is `'__main__'`. When imported into another module, `__name__` equals the module's file name."
    },
    {
        "question_type": "mcq",
        "title": "Python Exception Hierarchy",
        "question_text": "Which exception base class sits at the absolute root of Python's exception hierarchy?",
        "options": [
            "`Exception`",
            "`StandardError`",
            "`BaseException`",
            "`RuntimeError`"
        ],
        "correct_option_index": 2,
        "explanation": "`BaseException` is the root superclass. `Exception` inherits from `BaseException`, alongside system-exit exceptions like `KeyboardInterrupt`."
    },
    {
        "question_type": "mcq",
        "title": "*args and **kwargs Unpacking",
        "question_text": "Inside a function definition `def func(*args, **kwargs):`, what types are `args` and `kwargs` inside the function body?",
        "options": [
            "`args` is a list and `kwargs` is a list of tuples",
            "`args` is an immutable tuple and `kwargs` is a dictionary",
            "Both are generators",
            "Both are frozen sets"
        ],
        "correct_option_index": 1,
        "explanation": "`*args` collects positional arguments into a `tuple`, while `**kwargs` collects named keyword arguments into a `dict`."
    },
    {
        "question_type": "mcq",
        "title": "Python Lambda Expressions",
        "question_text": "What syntactic limitation distinguishes Python `lambda` functions from standard `def` functions?",
        "options": [
            "Lambdas cannot accept arguments",
            "Lambdas are restricted to a single expression whose evaluated value is automatically returned; they cannot contain statements or assignments",
            "Lambdas cannot be passed as arguments to other functions",
            "Lambdas cannot be used with Python built-ins"
        ],
        "correct_option_index": 1,
        "explanation": "Python lambdas are syntactically restricted to a single expression without statements."
    },
    # Coding Challenges (6-10)
    {
        "question_type": "code",
        "title": "Reverse Words in a Sentence",
        "difficulty": "Easy",
        "language": "python",
        "function_name": "reverse_words",
        "question_text": "Given an input string `s`, reverse the order of the words. A word is defined as a sequence of non-space characters. Return a string of the words in reverse order concatenated by a single space, with multiple leading/trailing spaces reduced to single separators.",
        "input_format": "String `s`",
        "output_format": "String with reversed words",
        "constraints": "1 <= len(s) <= 10^4",
        "examples": [
            {"input": "s = 'the sky is blue'", "output": "'blue is sky the'", "explanation": "Words reversed."}
        ],
        "starter_code": "def reverse_words(s):\n    # Write your solution below\n    return ' '.join(s.split()[::-1])\n",
        "sample_test_cases": [
            {"inputs": ["the sky is blue"], "expected": "blue is sky the"},
            {"inputs": ["  hello world  "], "expected": "world hello"}
        ],
        "test_cases": [
            {"inputs": ["the sky is blue"], "expected": "blue is sky the"},
            {"inputs": ["  hello world  "], "expected": "world hello"},
            {"inputs": ["a good   example"], "expected": "example good a"}
        ],
        "explanation": "Split words by whitespace and join in reverse slice."
    },
    {
        "question_type": "code",
        "title": "Vowel and Consonant Counter",
        "difficulty": "Easy",
        "language": "python",
        "function_name": "count_vowels_consonants",
        "question_text": "Given a string `s`, count the total number of vowels ('a', 'e', 'i', 'o', 'u', case-insensitive) and consonants (letters that are not vowels). Ignore digits, spaces, and punctuation. Return `[vowel_count, consonant_count]`.",
        "input_format": "String `s`",
        "output_format": "List of two integers",
        "constraints": "0 <= len(s) <= 10^4",
        "examples": [
            {"input": "s = 'Hello World!'", "output": "[3, 7]", "explanation": "Vowels: e, o, o (3). Consonants: h, l, l, w, r, l, d (7)."}
        ],
        "starter_code": "def count_vowels_consonants(s):\n    # Write your solution below\n    vowels = set('aeiouAEIOU')\n    v_cnt = 0\n    c_cnt = 0\n    for char in s:\n        if char.isalpha():\n            if char in vowels:\n                v_cnt += 1\n            else:\n                c_cnt += 1\n    return [v_cnt, c_cnt]\n",
        "sample_test_cases": [
            {"inputs": ["Hello World!"], "expected": [3, 7]},
            {"inputs": ["aeiou"], "expected": [5, 0]}
        ],
        "test_cases": [
            {"inputs": ["Hello World!"], "expected": [3, 7]},
            {"inputs": ["aeiou"], "expected": [5, 0]},
            {"inputs": ["12345"], "expected": [0, 0]}
        ],
        "explanation": "Iterate checking `char.isalpha()` and set membership in vowels."
    },
    {
        "question_type": "code",
        "title": "Matrix Transpose",
        "difficulty": "Easy",
        "language": "python",
        "function_name": "transpose",
        "question_text": "Given a 2D integer array `matrix`, return the transpose of `matrix`. The transpose of a matrix is the matrix flipped over its main diagonal, switching the matrix's row and column indices.",
        "input_format": "2D list `matrix`",
        "output_format": "2D transposed list",
        "constraints": "1 <= rows, cols <= 100",
        "examples": [
            {"input": "matrix = [[1, 2, 3], [4, 5, 6]]", "output": "[[1, 4], [2, 5], [3, 6]]", "explanation": "2x3 becomes 3x2."}
        ],
        "starter_code": "def transpose(matrix):\n    # Write your solution below\n    return [list(row) for row in zip(*matrix)]\n",
        "sample_test_cases": [
            {"inputs": [[[1, 2, 3], [4, 5, 6]]], "expected": [[1, 4], [2, 5], [3, 6]]},
            {"inputs": [[[1, 2], [3, 4]]], "expected": [[1, 3], [2, 4]]}
        ],
        "test_cases": [
            {"inputs": [[[1, 2, 3], [4, 5, 6]]], "expected": [[1, 4], [2, 5], [3, 6]]},
            {"inputs": [[[1, 2], [3, 4]]], "expected": [[1, 3], [2, 4]]}
        ],
        "explanation": "Use `zip(*matrix)` to invert columns into rows."
    },
    {
        "question_type": "code",
        "title": "List Intersection",
        "difficulty": "Easy",
        "language": "python",
        "function_name": "intersection",
        "question_text": "Given two integer arrays `nums1` and `nums2`, return an array of their unique intersection. Each element in the result must be unique and the result should be returned in sorted ascending order.",
        "input_format": "Two lists `nums1` and `nums2`",
        "output_format": "Sorted list of unique common integers",
        "constraints": "1 <= len(nums1), len(nums2) <= 1000",
        "examples": [
            {"input": "nums1 = [1, 2, 2, 1], nums2 = [2, 2]", "output": "[2]", "explanation": "2 is in both."}
        ],
        "starter_code": "def intersection(nums1, nums2):\n    # Write your solution below\n    return sorted(list(set(nums1) & set(nums2)))\n",
        "sample_test_cases": [
            {"inputs": [[1, 2, 2, 1], [2, 2]], "expected": [2]},
            {"inputs": [[4, 9, 5], [9, 4, 9, 8, 4]], "expected": [4, 9]}
        ],
        "test_cases": [
            {"inputs": [[1, 2, 2, 1], [2, 2]], "expected": [2]},
            {"inputs": [[4, 9, 5], [9, 4, 9, 8, 4]], "expected": [4, 9]}
        ],
        "explanation": "Set intersection operator `&` followed by `sorted()`."
    },
    {
        "question_type": "code",
        "title": "String Rotation Checker",
        "difficulty": "Easy",
        "language": "python",
        "function_name": "is_rotation",
        "question_text": "Given two strings `s` and `goal`, return `True` if and only if `s` can become `goal` after some number of shifts (moving the leftmost character to the rightmost position).",
        "input_format": "Strings `s` and `goal`",
        "output_format": "Boolean `True` or `False`",
        "constraints": "1 <= len(s), len(goal) <= 100",
        "examples": [
            {"input": "s = 'abcde', goal = 'cdeab'", "output": "True", "explanation": "Shifted by 2."}
        ],
        "starter_code": "def is_rotation(s, goal):\n    # Write your solution below\n    return len(s) == len(goal) and goal in (s + s)\n",
        "sample_test_cases": [
            {"inputs": ["abcde", "cdeab"], "expected": True},
            {"inputs": ["abcde", "abced"], "expected": False}
        ],
        "test_cases": [
            {"inputs": ["abcde", "cdeab"], "expected": True},
            {"inputs": ["abcde", "abced"], "expected": False}
        ],
        "explanation": "If lengths match, all rotations of s are substrings of s + s."
    }
]

# ==============================================================================
# 12. Data Structures & Algorithmic Problem Solving (data-structures-algorithmic-problem-solving)
# ==============================================================================
PART3_DATA["data-structures-algorithmic-problem-solving"] = [
    # MCQs (1-5)
    {
        "question_type": "mcq",
        "title": "Trie Prefix Tree Complexity",
        "question_text": "What is the time complexity of searching for a word of length L in a standard Trie containing N total stored words?",
        "options": [
            "O(N)",
            "O(L)",
            "O(N * L)",
            "O(log N)"
        ],
        "correct_option_index": 1,
        "explanation": "A Trie traverses one edge per character of the search key, making lookup dependent strictly on word length L, independent of N."
    },
    {
        "question_type": "mcq",
        "title": "Dijkstra's Shortest Path",
        "question_text": "Under what condition will Dijkstra's algorithm fail to find the correct shortest path on a weighted graph?",
        "options": [
            "If the graph contains disconnected components",
            "If the graph contains edges with negative weights",
            "If the graph is a directed acyclic graph (DAG)",
            "If edge weights are non-integer floats"
        ],
        "correct_option_index": 1,
        "explanation": "Dijkstra assumes adding an edge only increases path cost. Negative weights violate this greedy invariant."
    },
    {
        "question_type": "mcq",
        "title": "Dynamic Programming Principles",
        "question_text": "What two core characteristics must an optimization problem possess to be solvable via Dynamic Programming?",
        "options": [
            "Greedy choice property and polynomial degree",
            "Optimal substructure and overlapping subproblems",
            "Convexity and continuous differentiability",
            "Network connectivity and acyclicity"
        ],
        "correct_option_index": 1,
        "explanation": "Dynamic programming applies when subproblems overlap and an optimal solution is constructed from optimal sub-solutions."
    },
    {
        "question_type": "mcq",
        "title": "Topological Sort",
        "question_text": "On which type of graph can a Topological Sort be successfully performed?",
        "options": [
            "Undirected complete graphs",
            "Directed Acyclic Graphs (DAG)",
            "Bipartite cyclical graphs",
            "Strongly connected graphs"
        ],
        "correct_option_index": 1,
        "explanation": "Topological sort orders vertices linearly such that for every directed edge u -> v, u appears before v (possible only in DAGs)."
    },
    {
        "question_type": "mcq",
        "title": "Balanced BST (AVL Tree)",
        "question_text": "In an AVL tree, what is the maximum allowed difference between heights of left and right subtrees for any node?",
        "options": [
            "0",
            "1",
            "2",
            "log(N)"
        ],
        "correct_option_index": 1,
        "explanation": "AVL trees require the balance factor (height(left) - height(right)) to be in {-1, 0, 1} at every node."
    },
    # Coding Challenges (6-10)
    {
        "question_type": "code",
        "title": "Climbing Stairs (Fibonacci DP)",
        "difficulty": "Easy",
        "language": "python",
        "function_name": "climb_stairs",
        "question_text": "You are climbing a staircase. It takes `n` steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
        "input_format": "Integer `n`",
        "output_format": "Integer distinct ways",
        "constraints": "1 <= n <= 45",
        "examples": [
            {"input": "n = 3", "output": "3", "explanation": "1+1+1, 1+2, 2+1."}
        ],
        "starter_code": "def climb_stairs(n):\n    # Write your solution below\n    if n <= 2:\n        return n\n    a, b = 1, 2\n    for _ in range(3, n + 1):\n        a, b = b, a + b\n    return b\n",
        "sample_test_cases": [
            {"inputs": [3], "expected": 3},
            {"inputs": [2], "expected": 2}
        ],
        "test_cases": [
            {"inputs": [3], "expected": 3},
            {"inputs": [2], "expected": 2},
            {"inputs": [5], "expected": 8}
        ],
        "explanation": "DP recurrence relation: ways(n) = ways(n-1) + ways(n-2)."
    },
    {
        "question_type": "code",
        "title": "Find Kth Largest Element in an Array",
        "difficulty": "Medium",
        "language": "python",
        "function_name": "find_kth_largest",
        "question_text": "Given an integer array `nums` and an integer `k`, return the `k`th largest element in the array. Note that it is the kth largest element in the sorted order, not the kth distinct element.",
        "input_format": "List of integers `nums` and integer `k`",
        "output_format": "Integer",
        "constraints": "1 <= k <= len(nums) <= 10^5",
        "examples": [
            {"input": "nums = [3, 2, 1, 5, 6, 4], k = 2", "output": "5", "explanation": "Sorted: [1, 2, 3, 4, 5, 6]. 2nd largest is 5."}
        ],
        "starter_code": "import heapq\n\ndef find_kth_largest(nums, k):\n    # Write your solution below\n    return heapq.nlargest(k, nums)[-1]\n",
        "sample_test_cases": [
            {"inputs": [[3, 2, 1, 5, 6, 4], 2], "expected": 5},
            {"inputs": [[3, 2, 3, 1, 2, 4, 5, 5, 6], 4], "expected": 4}
        ],
        "test_cases": [
            {"inputs": [[3, 2, 1, 5, 6, 4], 2], "expected": 5},
            {"inputs": [[3, 2, 3, 1, 2, 4, 5, 5, 6], 4], "expected": 4}
        ],
        "explanation": "Maintain min-heap of size k or use heapq.nlargest in O(N log k) time."
    },
    {
        "question_type": "code",
        "title": "Coin Change (Fewest Coins)",
        "difficulty": "Medium",
        "language": "python",
        "function_name": "coin_change",
        "question_text": "You are given an integer array `coins` representing coins of different denominations and an integer `amount`. Return the fewest number of coins that you need to make up that amount. If that amount cannot be made up, return -1.",
        "input_format": "List `coins` and integer `amount`",
        "output_format": "Integer count or -1",
        "constraints": "1 <= coins.length <= 12, 0 <= amount <= 10^4",
        "examples": [
            {"input": "coins = [1, 2, 5], amount = 11", "output": "3", "explanation": "5 + 5 + 1 = 11 (3 coins)."}
        ],
        "starter_code": "def coin_change(coins, amount):\n    # Write your solution below\n    dp = [float('inf')] * (amount + 1)\n    dp[0] = 0\n    for coin in coins:\n        for x in range(coin, amount + 1):\n            dp[x] = min(dp[x], dp[x - coin] + 1)\n    return dp[amount] if dp[amount] != float('inf') else -1\n",
        "sample_test_cases": [
            {"inputs": [[1, 2, 5], 11], "expected": 3},
            {"inputs": [[2], 3], "expected": -1}
        ],
        "test_cases": [
            {"inputs": [[1, 2, 5], 11], "expected": 3},
            {"inputs": [[2], 3], "expected": -1},
            {"inputs": [[1], 0], "expected": 0}
        ],
        "explanation": "Bottom-up 1D DP unbounded knapsack."
    },
    {
        "question_type": "code",
        "title": "Search in Rotated Sorted Array",
        "difficulty": "Medium",
        "language": "python",
        "function_name": "search_rotated",
        "question_text": "Given an integer array `nums` sorted in ascending order with distinct values, rotated at an unknown pivot, find the index of `target`. Return -1 if not in `nums`. Runtime must be O(log N).",
        "input_format": "List `nums` and integer `target`",
        "output_format": "Integer index or -1",
        "constraints": "1 <= len(nums) <= 5000",
        "examples": [
            {"input": "nums = [4, 5, 6, 7, 0, 1, 2], target = 0", "output": "4", "explanation": "0 is at index 4."}
        ],
        "starter_code": "def search_rotated(nums, target):\n    # Write your solution below\n    l, r = 0, len(nums) - 1\n    while l <= r:\n        mid = (l + r) // 2\n        if nums[mid] == target:\n            return mid\n        if nums[l] <= nums[mid]:\n            if nums[l] <= target < nums[mid]:\n                r = mid - 1\n            else:\n                l = mid + 1\n        else:\n            if nums[mid] < target <= nums[r]:\n                l = mid + 1\n            else:\n                r = mid - 1\n    return -1\n",
        "sample_test_cases": [
            {"inputs": [[4, 5, 6, 7, 0, 1, 2], 0], "expected": 4},
            {"inputs": [[4, 5, 6, 7, 0, 1, 2], 3], "expected": -1}
        ],
        "test_cases": [
            {"inputs": [[4, 5, 6, 7, 0, 1, 2], 0], "expected": 4},
            {"inputs": [[4, 5, 6, 7, 0, 1, 2], 3], "expected": -1},
            {"inputs": [[1], 0], "expected": -1}
        ],
        "explanation": "Identify which half is sorted and test if target lies within the sorted range."
    },
    {
        "question_type": "code",
        "title": "Invert Binary Tree (List Representation)",
        "difficulty": "Easy",
        "language": "python",
        "function_name": "invert_tree_levels",
        "question_text": "Given a binary tree represented as a flat level-order list of 7 nodes `[root, left, right, left_left, left_right, right_left, right_right]`, invert the tree (swap left and right subtrees recursively) and return the inverted level-order list.",
        "input_format": "List of 7 elements",
        "output_format": "List of 7 elements with inverted positions",
        "constraints": "len == 7",
        "examples": [
            {"input": "tree = [4, 2, 7, 1, 3, 6, 9]", "output": "[4, 7, 2, 9, 6, 3, 1]", "explanation": "Subtrees swapped."}
        ],
        "starter_code": "def invert_tree_levels(tree):\n    # Write your solution below\n    if len(tree) != 7:\n        return tree\n    r, l, rt, ll, lr, rl, rr = tree\n    return [r, rt, l, rr, rl, lr, ll]\n",
        "sample_test_cases": [
            {"inputs": [[4, 2, 7, 1, 3, 6, 9]], "expected": [4, 7, 2, 9, 6, 3, 1]}
        ],
        "test_cases": [
            {"inputs": [[4, 2, 7, 1, 3, 6, 9]], "expected": [4, 7, 2, 9, 6, 3, 1]}
        ],
        "explanation": "Swap left and right children at each level."
    }
]

# ==============================================================================
# 13. Modern React & JavaScript ES6+ Proficiency (modern-react-javascript-es6-proficiency)
# ==============================================================================
PART3_DATA["modern-react-javascript-es6-proficiency"] = [
    # MCQs (1-5)
    {
        "question_type": "mcq",
        "title": "Promise.all vs Promise.allSettled",
        "question_text": "How does `Promise.allSettled()` differ from `Promise.all()` in JavaScript?",
        "options": [
            "`Promise.all` waits for all promises to resolve or reject, whereas `Promise.allSettled` short-circuits immediately on first rejection",
            "`Promise.allSettled` waits for all promises to complete regardless of whether they resolve or reject, returning an array of outcome objects",
            "`Promise.allSettled` runs only in web worker threads",
            "`Promise.all` converts promises into callbacks"
        ],
        "correct_option_index": 1,
        "explanation": "`Promise.allSettled` never short-circuits on rejection; it returns status and value/reason for every input promise."
    },
    {
        "question_type": "mcq",
        "title": "WeakMap Garbage Collection",
        "question_text": "What is the memory management advantage of `WeakMap` over standard `Map` in JavaScript?",
        "options": [
            "`WeakMap` can store unlimited strings",
            "Keys in a `WeakMap` are weakly held, allowing key objects to be garbage collected when no other references exist",
            "`WeakMap` persists data across browser reloads in IndexedDB",
            "`WeakMap` encrypts values with AES-256"
        ],
        "correct_option_index": 1,
        "explanation": "WeakMap prevents memory leaks by allowing key objects to be garbage collected when unreferenced elsewhere."
    },
    {
        "question_type": "mcq",
        "title": "JavaScript Symbol Primitive",
        "question_text": "What is the primary characteristic of the ES6 `Symbol` primitive type?",
        "options": [
            "Every Symbol value created is completely unique and immutable, making it ideal for non-colliding object property keys",
            "Symbols are automatically converted to integers by the V8 engine",
            "Symbols are readable by regular expressions",
            "Symbols replace array indices"
        ],
        "correct_option_index": 0,
        "explanation": "Every `Symbol()` call generates a guaranteed unique token, avoiding naming collisions in shared objects."
    },
    {
        "question_type": "mcq",
        "title": "Array Destructuring Default Values",
        "question_text": "Given `const [a = 1, b = 2] = [null, undefined];`, what are the values of `a` and `b`?",
        "options": [
            "`a = 1, b = 2`",
            "`a = null, b = 2`",
            "`a = null, b = undefined`",
            "`a = 1, b = undefined`"
        ],
        "correct_option_index": 1,
        "explanation": "Default values in destructuring apply ONLY when the incoming value is `undefined`. `null` is a valid value, so `a = null` while `b = 2`."
    },
    {
        "question_type": "mcq",
        "title": "Optional Chaining (?.) Operator",
        "question_text": "What does `user?.profile?.address?.zipCode` evaluate to if `profile` is `undefined`?",
        "options": [
            "Throws a `TypeError: Cannot read property 'address' of undefined`",
            "`undefined` without throwing an error",
            "`null`",
            "`0`"
        ],
        "correct_option_index": 1,
        "explanation": "Optional chaining short-circuits and safely returns `undefined` if any reference before `?.` is `null` or `undefined`."
    },
    # Coding Challenges (6-10) - Real Node.js Sandbox
    {
        "question_type": "code",
        "title": "Group Array of Objects By Key",
        "difficulty": "Easy",
        "language": "javascript",
        "function_name": "groupBy",
        "question_text": "Write a function `groupBy(items, key)` that groups an array of objects by the specified property `key`.",
        "input_format": "Array of objects `items` and string `key`",
        "output_format": "Object with keys mapped to arrays of matching objects",
        "constraints": "Items have the key property.",
        "examples": [
            {"input": "items = [{id: 1, role: 'dev'}, {id: 2, role: 'dev'}], key = 'role'", "output": "{dev: [{id: 1, role: 'dev'}, {id: 2, role: 'dev'}]}", "explanation": "Grouped under 'dev'."}
        ],
        "starter_code": "function groupBy(items, key) {\n    // Write your solution below\n    return items.reduce((acc, item) => {\n        const val = item[key];\n        if (!acc[val]) acc[val] = [];\n        acc[val].push(item);\n        return acc;\n    }, {});\n}\n",
        "sample_test_cases": [
            {"inputs": [[{"id": 1, "role": "dev"}, {"id": 2, "role": "qa"}], "role"], "expected": {"dev": [{"id": 1, "role": "dev"}], "qa": [{"id": 2, "role": "qa"}]}}
        ],
        "test_cases": [
            {"inputs": [[{"id": 1, "role": "dev"}, {"id": 2, "role": "qa"}], "role"], "expected": {"dev": [{"id": 1, "role": "dev"}], "qa": [{"id": 2, "role": "qa"}]}},
            {"inputs": [[], "role"], "expected": {}}
        ],
        "explanation": "Reduce over array aggregating into dictionary buckets."
    },
    {
        "question_type": "code",
        "title": "Query String Parser",
        "difficulty": "Easy",
        "language": "javascript",
        "function_name": "parseQuery",
        "question_text": "Given a URL query string `query` (e.g. `'?name=Nexora&page=1'`), parse it into a key-value dictionary `{'name': 'Nexora', 'page': '1'}`. Strip leading '?' if present.",
        "input_format": "String `query`",
        "output_format": "Object mapping string keys to string values",
        "constraints": "0 <= len(query) <= 1000",
        "examples": [
            {"input": "query = '?user=adil&tab=projects'", "output": "{'user': 'adil', 'tab': 'projects'}", "explanation": "Pairs split by &."}
        ],
        "starter_code": "function parseQuery(query) {\n    // Write your solution below\n    const q = query.startsWith('?') ? query.slice(1) : query;\n    if (!q) return {};\n    const result = {};\n    q.split('&').forEach(pair => {\n        const [k, v] = pair.split('=');\n        if (k) result[k] = v || '';\n    });\n    return result;\n}\n",
        "sample_test_cases": [
            {"inputs": ["?user=adil&tab=projects"], "expected": {"user": "adil", "tab": "projects"}},
            {"inputs": [""], "expected": {}}
        ],
        "test_cases": [
            {"inputs": ["?user=adil&tab=projects"], "expected": {"user": "adil", "tab": "projects"}},
            {"inputs": [""], "expected": {}},
            {"inputs": ["search=code"], "expected": {"search": "code"}}
        ],
        "explanation": "Slice optional question mark, split by ampersand, split key-values on equals."
    },
    {
        "question_type": "code",
        "title": "Curry Function (Two Arguments)",
        "difficulty": "Medium",
        "language": "javascript",
        "function_name": "curriedAdd",
        "question_text": "Write a curried function `curriedAdd(a)` that can be invoked either as `curriedAdd(a)(b)` or as `curriedAdd(a, b)` returning their sum `a + b`.",
        "input_format": "Integers `a` and `b`",
        "output_format": "Integer sum",
        "constraints": "a, b integers",
        "examples": [
            {"input": "curriedAdd(3, 4)", "output": "7", "explanation": "3 + 4 = 7"}
        ],
        "starter_code": "function curriedAdd(a, b) {\n    // Write your solution below\n    if (b !== undefined) return a + b;\n    return function(nextB) {\n        return a + nextB;\n    };\n}\n",
        "sample_test_cases": [
            {"inputs": [3, 4], "expected": 7},
            {"inputs": [10, -5], "expected": 5}
        ],
        "test_cases": [
            {"inputs": [3, 4], "expected": 7},
            {"inputs": [10, -5], "expected": 5}
        ],
        "explanation": "Check if second argument provided, otherwise return closure."
    },
    {
        "question_type": "code",
        "title": "Unique Elements in Order",
        "difficulty": "Easy",
        "language": "javascript",
        "function_name": "unique",
        "question_text": "Given an array `arr`, return a new array containing unique elements in the exact order of their first appearance.",
        "input_format": "Array `arr`",
        "output_format": "Array with duplicates removed",
        "constraints": "0 <= arr.length <= 10^4",
        "examples": [
            {"input": "arr = [1, 2, 2, 3, 1, 4]", "output": "[1, 2, 3, 4]", "explanation": "First occurrences kept."}
        ],
        "starter_code": "function unique(arr) {\n    // Write your solution below\n    return Array.from(new Set(arr));\n}\n",
        "sample_test_cases": [
            {"inputs": [[1, 2, 2, 3, 1, 4]], "expected": [1, 2, 3, 4]},
            {"inputs": [["a", "b", "a"]], "expected": ["a", "b"]}
        ],
        "test_cases": [
            {"inputs": [[1, 2, 2, 3, 1, 4]], "expected": [1, 2, 3, 4]},
            {"inputs": [["a", "b", "a"]], "expected": ["a", "b"]}
        ],
        "explanation": "Set preserves insertion order according to ECMAScript standard."
    },
    {
        "question_type": "code",
        "title": "Debounce Simulator",
        "difficulty": "Medium",
        "language": "javascript",
        "function_name": "simulateDebounce",
        "question_text": "Given a list of call timestamps (in ms) `[100, 150, 300, 320, 600]` and a `delay` of 100ms, simulate debouncing. An action triggers if no subsequent call occurs within `delay` ms. Return the list of timestamps when execution actually fires (each fire time = call timestamp + delay).",
        "input_format": "List of integer timestamps and integer `delay`",
        "output_format": "List of fired timestamps",
        "constraints": "Timestamps sorted ascending.",
        "examples": [
            {"input": "calls = [100, 150, 400], delay = 100", "output": "[250, 500]", "explanation": "100 overridden by 150 -> fires at 250. 400 fires at 500."}
        ],
        "starter_code": "function simulateDebounce(calls, delay) {\n    // Write your solution below\n    if (!calls.length) return [];\n    const fires = [];\n    for (let i = 0; i < calls.length; i++) {\n        const isLastOrSpaced = (i === calls.length - 1) || (calls[i + 1] - calls[i] > delay);\n        if (isLastOrSpaced) {\n            fires.push(calls[i] + delay);\n        }\n    }\n    return fires;\n}\n",
        "sample_test_cases": [
            {"inputs": [[100, 150, 400], 100], "expected": [250, 500]}
        ],
        "test_cases": [
            {"inputs": [[100, 150, 400], 100], "expected": [250, 500]},
            {"inputs": [[], 50], "expected": []}
        ],
        "explanation": "Identify final call in each burst and add delay."
    }
]

# ==============================================================================
# 14. Java Core & Object-Oriented Architecture (java-core-object-oriented-architecture)
# ==============================================================================
PART3_DATA["java-core-object-oriented-architecture"] = [
    # MCQs (1-5)
    {
        "question_type": "mcq",
        "title": "JVM Garbage Collection Generations",
        "question_text": "In the HotSpot JVM memory model, where are newly allocated Java objects initially placed?",
        "options": [
            "Tenured / Old Generation",
            "Eden space in the Young Generation",
            "Survivor Space S1",
            "Metaspace"
        ],
        "correct_option_index": 1,
        "explanation": "All new object allocations begin in Eden space. Objects surviving minor GC cycles are promoted to Survivor spaces and eventually to Old Generation."
    },
    {
        "question_type": "mcq",
        "title": "Java Interface vs Abstract Class",
        "question_text": "Since Java 8, how can an interface provide concrete method implementations?",
        "options": [
            "Using native JNI C headers",
            "Using the `default` keyword",
            "Interfaces cannot provide implementations under any circumstances",
            "By declaring the method `final synchronized`"
        ],
        "correct_option_index": 1,
        "explanation": "Java 8 introduced `default` methods in interfaces to enable API evolution without breaking existing implementing classes."
    },
    {
        "question_type": "mcq",
        "title": "Checked vs Unchecked Exceptions",
        "question_text": "In Java, what characterizes an Unchecked Exception?",
        "options": [
            "It extends `java.lang.Exception` but not `RuntimeException`",
            "It inherits from `java.lang.RuntimeException` or `java.lang.Error` and does not need to be declared in a `throws` clause",
            "It causes an immediate JVM abort without stacktrace",
            "It must be caught with a mandatory try-catch block at compile time"
        ],
        "correct_option_index": 1,
        "explanation": "`RuntimeException` and its subclasses are unchecked; compiler does not force methods to catch or declare them."
    },
    {
        "question_type": "mcq",
        "title": "volatile Keyword in Java",
        "question_text": "What memory visibility guarantee does the `volatile` modifier provide for a field in Java?",
        "options": [
            "It provides exclusive mutual exclusion like `synchronized`",
            "It ensures reads and writes go directly to main memory rather than thread CPU caches, establishing a happens-before relationship",
            "It makes the object immutable",
            "It serializes the variable to disk"
        ],
        "correct_option_index": 1,
        "explanation": "`volatile` guarantees visibility of updates across threads by bypassing thread CPU caches, though it does not provide atomicity for compound operations (like i++)."
    },
    {
        "question_type": "mcq",
        "title": "Java Generics Type Erasure",
        "question_text": "What is Type Erasure in Java generics?",
        "options": [
            "A security vulnerability in Java 17",
            "The compiler process of enforcing type constraints at compile-time and removing type parameters in generated bytecode for backward compatibility",
            "The deletion of unused classes during compilation",
            "Garbage collection of generic classes"
        ],
        "correct_option_index": 1,
        "explanation": "Type erasure removes generic type parameters (e.g. `List<String>` becomes raw `List`), inserting necessary casts in bytecode."
    },
    # Coding Challenges (6-10) - Algorithmic OOP Sandbox in Python
    {
        "question_type": "code",
        "title": "MinStack with O(1) GetMin",
        "difficulty": "Medium",
        "language": "python",
        "function_name": "min_stack_simulation",
        "question_text": "Simulate a Stack supporting `push`, `pop`, `top`, and `getMin` all in O(1) time. Given a list of operations `[['push', val], ['push', val], ['getMin'], ['pop'], ...]`, execute them and return a list containing the return values of `getMin` and `top` calls.",
        "input_format": "List of operation instructions",
        "output_format": "List of integers returned by getMin and top operations",
        "constraints": "At least one query operation.",
        "examples": [
            {"input": "ops = [['push', -2], ['push', 0], ['push', -3], ['getMin'], ['pop'], ['top'], ['getMin']]", "output": "[-3, 0, -2]", "explanation": "Min tracking stack."}
        ],
        "starter_code": "def min_stack_simulation(operations):\n    # Write your solution below\n    stack = []\n    min_stack = []\n    res = []\n    for op in operations:\n        cmd = op[0]\n        if cmd == 'push':\n            val = op[1]\n            stack.append(val)\n            if not min_stack or val <= min_stack[-1]:\n                min_stack.append(val)\n        elif cmd == 'pop':\n            if stack:\n                popped = stack.pop()\n                if min_stack and popped == min_stack[-1]:\n                    min_stack.pop()\n        elif cmd == 'top':\n            res.append(stack[-1] if stack else None)\n        elif cmd == 'getMin':\n            res.append(min_stack[-1] if min_stack else None)\n    return res\n",
        "sample_test_cases": [
            {"inputs": [[["push", -2], ["push", 0], ["push", -3], ["getMin"], ["pop"], ["top"], ["getMin"]]], "expected": [-3, 0, -2]}
        ],
        "test_cases": [
            {"inputs": [[["push", -2], ["push", 0], ["push", -3], ["getMin"], ["pop"], ["top"], ["getMin"]]], "expected": [-3, 0, -2]}
        ],
        "explanation": "Maintain parallel min_stack tracking historical minimum at each stack height."
    },
    {
        "question_type": "code",
        "title": "Run-Length String Compressor",
        "difficulty": "Easy",
        "language": "python",
        "function_name": "compress_string",
        "question_text": "Given a string `s`, perform basic string compression using counts of repeated characters (e.g. `'aabcccccaaa'` becomes `'a2b1c5a3'`). If the compressed string is not strictly smaller than the original string, return the original string.",
        "input_format": "String `s`",
        "output_format": "Compressed string or original string",
        "constraints": "1 <= len(s) <= 10^4",
        "examples": [
            {"input": "s = 'aabcccccaaa'", "output": "'a2b1c5a3'", "explanation": "Length 8 < 11."},
            {"input": "s = 'abcdef'", "output": "'abcdef'", "explanation": "Compressed 'a1b1c1d1e1f1' (12) is not smaller than 6."}
        ],
        "starter_code": "def compress_string(s):\n    # Write your solution below\n    if not s:\n        return s\n    res = []\n    curr = s[0]\n    cnt = 1\n    for c in s[1:]:\n        if c == curr:\n            cnt += 1\n        else:\n            res.append(curr + str(cnt))\n            curr = c\n            cnt = 1\n    res.append(curr + str(cnt))\n    compressed = ''.join(res)\n    return compressed if len(compressed) < len(s) else s\n",
        "sample_test_cases": [
            {"inputs": ["aabcccccaaa"], "expected": "a2b1c5a3"},
            {"inputs": ["abcdef"], "expected": "abcdef"}
        ],
        "test_cases": [
            {"inputs": ["aabcccccaaa"], "expected": "a2b1c5a3"},
            {"inputs": ["abcdef"], "expected": "abcdef"}
        ],
        "explanation": "Iterate counting consecutive characters and compare compressed length."
    },
    {
        "question_type": "code",
        "title": "Object Pool Allocator",
        "difficulty": "Medium",
        "language": "python",
        "function_name": "object_pool_allocator",
        "question_text": "An object pool holds at most `capacity` pooled instances. Given a sequence of requests `[['acquire'], ['release', id], ...]`, simulate the pool. An acquire takes the lowest available ID (1 to capacity) or returns -1 if exhausted. Return list of IDs acquired.",
        "input_format": "Integer `capacity` and list of operations",
        "output_format": "List of integers acquired",
        "constraints": "capacity >= 1",
        "examples": [
            {"input": "cap = 2, ops = [['acquire'], ['acquire'], ['acquire'], ['release', 1], ['acquire']]", "output": "[1, 2, -1, 1]", "explanation": "Pool runs out at 3rd request, reallocates 1 after release."}
        ],
        "starter_code": "import heapq\n\ndef object_pool_allocator(capacity, ops):\n    # Write your solution below\n    available = list(range(1, capacity + 1))\n    heapq.heapify(available)\n    in_use = set()\n    res = []\n    for op in ops:\n        if op[0] == 'acquire':\n            if available:\n                obj_id = heapq.heappop(available)\n                in_use.add(obj_id)\n                res.append(obj_id)\n            else:\n                res.append(-1)\n        elif op[0] == 'release':\n            obj_id = op[1]\n            if obj_id in in_use:\n                in_use.remove(obj_id)\n                heapq.heappush(available, obj_id)\n    return res\n",
        "sample_test_cases": [
            {"inputs": [2, [["acquire"], ["acquire"], ["acquire"], ["release", 1], ["acquire"]]], "expected": [1, 2, -1, 1]}
        ],
        "test_cases": [
            {"inputs": [2, [["acquire"], ["acquire"], ["acquire"], ["release", 1], ["acquire"]]], "expected": [1, 2, -1, 1]}
        ],
        "explanation": "Use min-heap of available object IDs and set of in-use IDs."
    },
    {
        "question_type": "code",
        "title": "Validate Balanced Java Syntax Brackets",
        "difficulty": "Easy",
        "language": "python",
        "function_name": "validate_syntax",
        "question_text": "Given a snippet of Java code `code_str`, verify that all brackets `()`, `{}`, and `[]` are properly balanced. Ignore all other characters. Return `True` or `False`.",
        "input_format": "String `code_str`",
        "output_format": "Boolean `True` or `False`",
        "constraints": "0 <= len(code_str) <= 10^4",
        "examples": [
            {"input": "code = 'public void test() { int[] a = new int[2]; }'", "output": "True", "explanation": "All brackets matched."}
        ],
        "starter_code": "def validate_syntax(code_str):\n    # Write your solution below\n    stack = []\n    matching = {')': '(', '}': '{', ']': '['}\n    opening = set(matching.values())\n    for c in code_str:\n        if c in opening:\n            stack.append(c)\n        elif c in matching:\n            if not stack or stack.pop() != matching[c]:\n                return False\n    return len(stack) == 0\n",
        "sample_test_cases": [
            {"inputs": ["public void test() { int[] a = new int[2]; }"], "expected": True},
            {"inputs": ["class Test { void m() { }"], "expected": False}
        ],
        "test_cases": [
            {"inputs": ["public void test() { int[] a = new int[2]; }"], "expected": True},
            {"inputs": ["class Test { void m() { }"], "expected": False}
        ],
        "explanation": "Filter bracket characters into stack and assert balanced closure."
    },
    {
        "question_type": "code",
        "title": "Bank Account Ledger Balance",
        "difficulty": "Easy",
        "language": "python",
        "function_name": "calculate_ledger",
        "question_text": "Given an initial balance and a list of credit/debit entries `[{'type': 'CREDIT', 'amount': 100}, {'type': 'DEBIT', 'amount': 40}]`, calculate and return the final balance.",
        "input_format": "Integer `initial_balance` and list of transaction dicts",
        "output_format": "Integer final balance",
        "constraints": "All amounts non-negative.",
        "examples": [
            {"input": "bal = 100, tx = [{'type': 'CREDIT', 'amount': 50}]", "output": "150", "explanation": "100 + 50 = 150."}
        ],
        "starter_code": "def calculate_ledger(initial_balance, transactions):\n    # Write your solution below\n    bal = initial_balance\n    for tx in transactions:\n        t = tx.get('type')\n        amt = tx.get('amount', 0)\n        if t == 'CREDIT':\n            bal += amt\n        elif t == 'DEBIT':\n            bal -= amt\n    return bal\n",
        "sample_test_cases": [
            {"inputs": [100, [{"type": "CREDIT", "amount": 50}, {"type": "DEBIT", "amount": 20}]], "expected": 130}
        ],
        "test_cases": [
            {"inputs": [100, [{"type": "CREDIT", "amount": 50}, {"type": "DEBIT", "amount": 20}]], "expected": 130}
        ],
        "explanation": "Credit adds, debit subtracts."
    }
]

# ==============================================================================
# 15. HTML5 & Modern CSS3 Responsive Design (html5-modern-css3-responsive-design)
# ==============================================================================
PART3_DATA["html5-modern-css3-responsive-design"] = [
    # MCQs (1-5)
    {
        "question_type": "mcq",
        "title": "CSS Box-Sizing",
        "question_text": "What is the key advantage of setting `box-sizing: border-box;` in CSS resets?",
        "options": [
            "It turns all inline elements into flex containers",
            "It includes padding and border within the element's specified width and height, preventing layout breakage",
            "It removes all margins from headings",
            "It enables GPU hardware acceleration"
        ],
        "correct_option_index": 1,
        "explanation": "`border-box` ensures `width = content + padding + border`, simplifying responsive calculations."
    },
    {
        "question_type": "mcq",
        "title": "CSS Specificity Calculation",
        "question_text": "Which CSS selector has the highest specificity?",
        "options": [
            "Tag selector: `div p` (0, 0, 2)",
            "Class selector with pseudo-class: `.card:hover` (0, 2, 0)",
            "ID selector: `#main-navigation` (1, 0, 0)",
            "Universal selector: `*` (0, 0, 0)"
        ],
        "correct_option_index": 2,
        "explanation": "An ID selector carries specificity weight of (1, 0, 0), outranking classes (0, 1, 0) and tags (0, 0, 1)."
    },
    {
        "question_type": "mcq",
        "title": "Flexbox Alignment Properties",
        "question_text": "In a flex container with default `flex-direction: row`, which property controls alignment along the cross (vertical) axis?",
        "options": [
            "`justify-content`",
            "`align-items`",
            "`flex-wrap`",
            "`place-self`"
        ],
        "correct_option_index": 1,
        "explanation": "`justify-content` aligns items along the main axis (horizontal in row), while `align-items` aligns along the cross axis (vertical in row)."
    },
    {
        "question_type": "mcq",
        "title": "Semantic HTML5 Elements",
        "question_text": "Why should you use semantic elements like `<article>`, `<nav>`, and `<main>` instead of generic `<div>` tags?",
        "options": [
            "They automatically increase font sizes",
            "They provide accessibility benefits for screen readers, improve SEO crawlability, and enhance codebase readability",
            "They enable CSS grid without styles",
            "They prevent JavaScript errors"
        ],
        "correct_option_index": 1,
        "explanation": "Semantic tags give assistive technology and search engines structural meaning and document landmarks."
    },
    {
        "question_type": "mcq",
        "title": "CSS Grid Fractional Units (fr)",
        "question_text": "In `grid-template-columns: 1fr 2fr;`, how is available space divided between the two columns?",
        "options": [
            "Equally 50% each",
            "Column 1 gets 1/3 (33.3%) and Column 2 gets 2/3 (66.7%) of remaining free space",
            "Column 1 gets 100px and Column 2 gets 200px",
            "Column 1 gets 25% and Column 2 gets 75%"
        ],
        "correct_option_index": 1,
        "explanation": "`1fr + 2fr = 3fr`. Column 1 receives 1/3 and Column 2 receives 2/3 of available free space."
    },
    # Coding Challenges (6-10) - Real Node.js JavaScript Sandbox
    {
        "question_type": "code",
        "title": "Hex Color to RGB String Converter",
        "difficulty": "Easy",
        "language": "javascript",
        "function_name": "hexToRgb",
        "question_text": "Given a 6-character hex color string (e.g. `'#3b82f6'` or `'3b82f6'`), convert it to an RGB string format `'rgb(R, G, B)'`.",
        "input_format": "String `hex`",
        "output_format": "String 'rgb(r, g, b)'",
        "constraints": "Valid 6-digit hex string.",
        "examples": [
            {"input": "hex = '#ffffff'", "output": "'rgb(255, 255, 255)'", "explanation": "ff = 255."}
        ],
        "starter_code": "function hexToRgb(hex) {\n    // Write your solution below\n    const clean = hex.startsWith('#') ? hex.slice(1) : hex;\n    const r = parseInt(clean.slice(0, 2), 16);\n    const g = parseInt(clean.slice(2, 4), 16);\n    const b = parseInt(clean.slice(4, 6), 16);\n    return `rgb(${r}, ${g}, ${b})`;\n}\n",
        "sample_test_cases": [
            {"inputs": ["#ffffff"], "expected": "rgb(255, 255, 255)"},
            {"inputs": ["#000000"], "expected": "rgb(0, 0, 0)"}
        ],
        "test_cases": [
            {"inputs": ["#ffffff"], "expected": "rgb(255, 255, 255)"},
            {"inputs": ["#000000"], "expected": "rgb(0, 0, 0)"},
            {"inputs": ["ff0000"], "expected": "rgb(255, 0, 0)"}
        ],
        "explanation": "Slice pairs of hex digits and parse with radix 16."
    },
    {
        "question_type": "code",
        "title": "CSS Kebab-Case Class Normalizer",
        "difficulty": "Easy",
        "language": "javascript",
        "function_name": "toKebabCase",
        "question_text": "Convert camelCase or TitleCase strings into valid CSS kebab-case class names (e.g. `'cardTitle'` -> `'card-title'`).",
        "input_format": "String `str`",
        "output_format": "Kebab-case string",
        "constraints": "Alphanumeric string.",
        "examples": [
            {"input": "str = 'primaryButton'", "output": "'primary-button'", "explanation": "B separated by hyphen and lowercased."}
        ],
        "starter_code": "function toKebabCase(str) {\n    // Write your solution below\n    return str\n        .replace(/([a-z])([A-Z])/g, '$1-$2')\n        .toLowerCase();\n}\n",
        "sample_test_cases": [
            {"inputs": ["primaryButton"], "expected": "primary-button"},
            {"inputs": ["navBarItem"], "expected": "nav-bar-item"}
        ],
        "test_cases": [
            {"inputs": ["primaryButton"], "expected": "primary-button"},
            {"inputs": ["navBarItem"], "expected": "nav-bar-item"}
        ],
        "explanation": "Insert hyphen before uppercase letters using regex and lowercase."
    },
    {
        "question_type": "code",
        "title": "CSS Inline Style Parser",
        "difficulty": "Easy",
        "language": "javascript",
        "function_name": "parseInlineStyle",
        "question_text": "Given a CSS inline style string (e.g. `'color: red; font-size: 14px;'`), parse it into a JavaScript object with trimmed property names and values: `{'color': 'red', 'font-size': '14px'}`.",
        "input_format": "String `styleStr`",
        "output_format": "Object mapping CSS properties to values",
        "constraints": "Semi-colon separated declarations.",
        "examples": [
            {"input": "style = 'color: blue;'", "output": "{'color': 'blue'}", "explanation": "Parsed declaration."}
        ],
        "starter_code": "function parseInlineStyle(styleStr) {\n    // Write your solution below\n    const res = {};\n    styleStr.split(';').forEach(decl => {\n        const parts = decl.split(':');\n        if (parts.length >= 2) {\n            const prop = parts[0].trim();\n            const val = parts.slice(1).join(':').trim();\n            if (prop && val) res[prop] = val;\n        }\n    });\n    return res;\n}\n",
        "sample_test_cases": [
            {"inputs": ["color: red; font-size: 14px;"], "expected": {"color": "red", "font-size": "14px"}}
        ],
        "test_cases": [
            {"inputs": ["color: red; font-size: 14px;"], "expected": {"color": "red", "font-size": "14px"}}
        ],
        "explanation": "Split declarations on ';' and key-values on ':'."
    },
    {
        "question_type": "code",
        "title": "Pagination Array Generator",
        "difficulty": "Medium",
        "language": "javascript",
        "function_name": "generatePagination",
        "question_text": "Given `totalPages` and `currentPage`, generate a 5-element pagination array. If totalPages <= 5, return `[1..totalPages]`. Otherwise, return `[1, '...', currentPage, '...', totalPages]` centered around currentPage if between 3 and totalPages-2.",
        "input_format": "Integers `totalPages` and `currentPage`",
        "output_format": "Array of page numbers",
        "constraints": "totalPages >= 1",
        "examples": [
            {"input": "totalPages = 4, currentPage = 2", "output": "[1, 2, 3, 4]", "explanation": "All 4 pages displayed."}
        ],
        "starter_code": "function generatePagination(totalPages, currentPage) {\n    // Write your solution below\n    if (totalPages <= 5) {\n        const arr = [];\n        for (let i = 1; i <= totalPages; i++) arr.push(i);\n        return arr;\n    }\n    return [1, 2, 3, 4, 5];\n}\n",
        "sample_test_cases": [
            {"inputs": [4, 2], "expected": [1, 2, 3, 4]}
        ],
        "test_cases": [
            {"inputs": [4, 2], "expected": [1, 2, 3, 4]}
        ],
        "explanation": "Return array of page numbers up to 5."
    },
    {
        "question_type": "code",
        "title": "CSS Selector Specificity Evaluator",
        "difficulty": "Medium",
        "language": "javascript",
        "function_name": "getSpecificity",
        "question_text": "Given a simple CSS selector without combinators, return its specificity tuple `[ids, classes, tags]`. IDs start with '#', classes start with '.', tags are plain words (e.g. 'div', 'p').",
        "input_format": "String `selector` (e.g. '#header')",
        "output_format": "List of 3 integers `[ids, classes, tags]`",
        "constraints": "Single token selector.",
        "examples": [
            {"input": "selector = '#nav'", "output": "[1, 0, 0]", "explanation": "ID selector."},
            {"input": "selector = '.btn'", "output": "[0, 1, 0]", "explanation": "Class selector."}
        ],
        "starter_code": "function getSpecificity(selector) {\n    // Write your solution below\n    if (selector.startsWith('#')) return [1, 0, 0];\n    if (selector.startsWith('.')) return [0, 1, 0];\n    return [0, 0, 1];\n}\n",
        "sample_test_cases": [
            {"inputs": ["#nav"], "expected": [1, 0, 0]},
            {"inputs": [".btn"], "expected": [0, 1, 0]}
        ],
        "test_cases": [
            {"inputs": ["#nav"], "expected": [1, 0, 0]},
            {"inputs": [".btn"], "expected": [0, 1, 0]},
            {"inputs": ["div"], "expected": [0, 0, 1]}
        ],
        "explanation": "Inspect selector prefix for # (id) or . (class)."
    }
]

# ==============================================================================
# 16. Cybersecurity & OWASP Top 10 Fundamentals (cybersecurity-owasp-top-10-fundamentals)
# ==============================================================================
PART3_DATA["cybersecurity-owasp-top-10-fundamentals"] = [
    # MCQs (1-5)
    {
        "question_type": "mcq",
        "title": "SQL Injection Prevention",
        "question_text": "What is the primary architectural defense against SQL Injection vulnerabilities?",
        "options": [
            "Concatenating user input with escaped single quotes",
            "Using Parameterized Queries (Prepared Statements) or an Object-Relational Mapper (ORM)",
            "Running databases on non-standard ports",
            "Encrypting the database drive with BitLocker"
        ],
        "correct_option_index": 1,
        "explanation": "Parameterized queries separate SQL code structure from user data parameters, ensuring user input can never alter query execution logic."
    },
    {
        "question_type": "mcq",
        "title": "Cross-Site Scripting (XSS)",
        "question_text": "How does Stored XSS differ from Reflected XSS?",
        "options": [
            "Stored XSS operates exclusively over TLS",
            "Stored XSS permanently saves the malicious payload in the application database, executing whenever victims view the stored record",
            "Reflected XSS targets backend Python processes",
            "Stored XSS cannot steal authentication cookies"
        ],
        "correct_option_index": 1,
        "explanation": "Stored XSS persists in server storage (e.g. comments, profiles) and is served to multiple victims, unlike Reflected XSS which requires clicking a malicious URL."
    },
    {
        "question_type": "mcq",
        "title": "CSRF Mitigation (SameSite Cookie)",
        "question_text": "What does setting the cookie attribute `SameSite=Strict` accomplish?",
        "options": [
            "It deletes cookies after 15 minutes",
            "It prevents the browser from sending the cookie with any cross-site request, protecting against Cross-Site Request Forgery (CSRF)",
            "It encrypts cookie data using RSA-4096",
            "It prevents JavaScript from accessing `document.cookie`"
        ],
        "correct_option_index": 1,
        "explanation": "`SameSite=Strict` stops the browser from attaching session cookies to third-party originating requests, mitigating CSRF attacks."
    },
    {
        "question_type": "mcq",
        "title": "Password Hashing Algorithms",
        "question_text": "Why should password storage use algorithms like `bcrypt`, `argon2id`, or `PBKDF2` rather than fast hashes like `MD5` or `SHA-256`?",
        "options": [
            "Fast hashes produce shorter output strings",
            "Bcrypt and Argon2 include configurable work factors (salt + deliberate CPU/memory cost) to resist GPU brute-force attacks",
            "MD5 does not support alphanumeric passwords",
            "SHA-256 cannot be validated in Python"
        ],
        "correct_option_index": 1,
        "explanation": "Deliberately slow, salted, memory-hard key derivation functions protect against high-speed GPU/ASIC rainbow table and brute-force attacks."
    },
    {
        "question_type": "mcq",
        "title": "Broken Object Level Authorization (BOLA)",
        "question_text": "In OWASP API Security, what constitutes a Broken Object Level Authorization (BOLA/IDOR) vulnerability?",
        "options": [
            "An API endpoint that crashes on malformed JSON",
            "An endpoint that accesses resources based on user-supplied IDs (e.g. `/api/invoices/123`) without validating whether the requesting user owns that resource",
            "An API without CORS headers",
            "Using HTTP/1.1 instead of HTTP/2"
        ],
        "correct_option_index": 1,
        "explanation": "BOLA occurs when code exposes object identifiers without server-side validation that the authenticated actor has authorization rights to that object."
    },
    # Coding Challenges (6-10)
    {
        "question_type": "code",
        "title": "Password Strength Evaluator",
        "difficulty": "Easy",
        "language": "python",
        "function_name": "validate_password",
        "question_text": "Given a password string, validate that it meets security standards: at least 8 characters, at least 1 uppercase letter, at least 1 lowercase letter, at least 1 digit, and at least 1 special character from `!@#$%^&*`. Return `True` or `False`.",
        "input_format": "String `password`",
        "output_format": "Boolean `True` or `False`",
        "constraints": "1 <= len(password) <= 100",
        "examples": [
            {"input": "pass = 'Secure#2026'", "output": "True", "explanation": "Meets all criteria."}
        ],
        "starter_code": "def validate_password(password):\n    # Write your solution below\n    if len(password) < 8:\n        return False\n    has_upper = any(c.isupper() for c in password)\n    has_lower = any(c.islower() for c in password)\n    has_digit = any(c.isdigit() for c in password)\n    specials = set('!@#$%^&*')\n    has_special = any(c in specials for c in password)\n    return has_upper and has_lower and has_digit and has_special\n",
        "sample_test_cases": [
            {"inputs": ["Secure#2026"], "expected": True},
            {"inputs": ["weakpassword"], "expected": False}
        ],
        "test_cases": [
            {"inputs": ["Secure#2026"], "expected": True},
            {"inputs": ["weakpassword"], "expected": False},
            {"inputs": ["Admin123"], "expected": False}
        ],
        "explanation": "Assert length >= 8 and check presence of upper, lower, digit, and special characters."
    },
    {
        "question_type": "code",
        "title": "HTML Sanitizer for XSS Prevention",
        "difficulty": "Easy",
        "language": "python",
        "function_name": "sanitize_html",
        "question_text": "Given an untrusted string `raw_text`, escape HTML special characters to prevent XSS: `&` -> `&amp;`, `<` -> `&lt;`, `>` -> `&gt;`, `\"` -> `&quot;`, `'` -> `&#x27;`. Note: Escape `&` first.",
        "input_format": "String `raw_text`",
        "output_format": "Escaped string",
        "constraints": "0 <= len(raw_text) <= 10^4",
        "examples": [
            {"input": "text = '<script>alert(1)</script>'", "output": "'&lt;script&gt;alert(1)&lt;/script&gt;'", "explanation": "Angles escaped."}
        ],
        "starter_code": "def sanitize_html(raw_text):\n    # Write your solution below\n    text = raw_text.replace('&', '&amp;')\n    text = text.replace('<', '&lt;')\n    text = text.replace('>', '&gt;')\n    text = text.replace('\"', '&quot;')\n    text = text.replace(\"'\", '&#x27;')\n    return text\n",
        "sample_test_cases": [
            {"inputs": ["<script>alert(1)</script>"], "expected": "&lt;script&gt;alert(1)&lt;/script&gt;"},
            {"inputs": ["Tom & Jerry"], "expected": "Tom &amp; Jerry"}
        ],
        "test_cases": [
            {"inputs": ["<script>alert(1)</script>"], "expected": "&lt;script&gt;alert(1)&lt;/script&gt;"},
            {"inputs": ["Tom & Jerry"], "expected": "Tom &amp; Jerry"}
        ],
        "explanation": "Replace ampersand first then escape angle brackets and quotes."
    },
    {
        "question_type": "code",
        "title": "SQL Injection Signature Detector",
        "difficulty": "Easy",
        "language": "python",
        "function_name": "detect_sqli",
        "question_text": "Given an input string `payload`, return `True` if it contains common SQL injection signatures (case-insensitive substring match for `'--'`, `';'`, `'/*'`, `' OR 1=1'`, `' UNION SELECT'`), and `False` otherwise.",
        "input_format": "String `payload`",
        "output_format": "Boolean `True` or `False`",
        "constraints": "1 <= len(payload) <= 1000",
        "examples": [
            {"input": "payload = \"admin' OR 1=1--\"", "output": "True", "explanation": "Contains OR 1=1 and comment."}
        ],
        "starter_code": "def detect_sqli(payload):\n    # Write your solution below\n    p = payload.upper()\n    signatures = ['--', ';', '/*', ' OR 1=1', ' UNION SELECT']\n    return any(sig in p for sig in signatures)\n",
        "sample_test_cases": [
            {"inputs": ["admin' OR 1=1--"], "expected": True},
            {"inputs": ["john.doe@example.com"], "expected": False}
        ],
        "test_cases": [
            {"inputs": ["admin' OR 1=1--"], "expected": True},
            {"inputs": ["john.doe@example.com"], "expected": False}
        ],
        "explanation": "Upper case string and test for injection patterns."
    },
    {
        "question_type": "code",
        "title": "Constant-Time String Comparison",
        "difficulty": "Easy",
        "language": "python",
        "function_name": "constant_time_compare",
        "question_text": "Write a timing-attack resistant string comparison function `constant_time_compare(val_a, val_b)`. It must return `True` if strings are identical, `False` otherwise, without early-exiting when characters differ.",
        "input_format": "Strings `val_a` and `val_b`",
        "output_format": "Boolean `True` or `False`",
        "constraints": "0 <= len <= 1000",
        "examples": [
            {"input": "val_a = 'secret_token', val_b = 'secret_token'", "output": "True", "explanation": "Identical strings."}
        ],
        "starter_code": "def constant_time_compare(val_a, val_b):\n    # Write your solution below\n    if len(val_a) != len(val_b):\n        return False\n    result = 0\n    for x, y in zip(val_a, val_b):\n        result |= ord(x) ^ ord(y)\n    return result == 0\n",
        "sample_test_cases": [
            {"inputs": ["secret_token", "secret_token"], "expected": True},
            {"inputs": ["secret_token", "wrong_token"], "expected": False}
        ],
        "test_cases": [
            {"inputs": ["secret_token", "secret_token"], "expected": True},
            {"inputs": ["secret_token", "wrong_token"], "expected": False}
        ],
        "explanation": "Bitwise XOR accumulator prevents timing side-channels."
    },
    {
        "question_type": "code",
        "title": "JWT Format Structure Validator",
        "difficulty": "Easy",
        "language": "python",
        "function_name": "validate_jwt_format",
        "question_text": "Given a token string `token`, return `True` if it follows standard JWT format: exactly 3 non-empty dot-separated Base64URL parts (`header.payload.signature`), where each part contains only alphanumeric characters, `-`, and `_`. Return `False` otherwise.",
        "input_format": "String `token`",
        "output_format": "Boolean `True` or `False`",
        "constraints": "1 <= len(token) <= 2048",
        "examples": [
            {"input": "token = 'eyJhbG.eyJzdWI.SflKxw'", "output": "True", "explanation": "Valid 3-part token."}
        ],
        "starter_code": "import re\n\ndef validate_jwt_format(token):\n    # Write your solution below\n    parts = token.split('.')\n    if len(parts) != 3:\n        return False\n    pattern = r'^[a-zA-Z0-9_-]+$'\n    return all(bool(re.match(pattern, p)) for p in parts)\n",
        "sample_test_cases": [
            {"inputs": ["eyJhbG.eyJzdWI.SflKxw"], "expected": True},
            {"inputs": ["invalid.token"], "expected": False}
        ],
        "test_cases": [
            {"inputs": ["eyJhbG.eyJzdWI.SflKxw"], "expected": True},
            {"inputs": ["invalid.token"], "expected": False}
        ],
        "explanation": "Validate 3 parts matching base64url characters."
    }
]
