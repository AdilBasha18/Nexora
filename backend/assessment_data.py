"""
Assessment Question Bank for Nexora.
Each assessment contains exactly 10 questions:
- Questions 1 to 5: High-yield domain MCQs with explanations
- Questions 6 to 10: LeetCode-style Coding Challenges with full test cases, visible sample tests, and starter code
"""

ASSESSMENTS_DATA = {}

# ==============================================================================
# 1. Python Core & OOP Proficiency (python-core-oop-proficiency)
# ==============================================================================
ASSESSMENTS_DATA["python-core-oop-proficiency"] = [
    # MCQs (1-5)
    {
        "question_type": "mcq",
        "title": "Python GIL & Concurrency",
        "question_text": "What is the primary role of Python's Global Interpreter Lock (GIL) in CPython?",
        "options": [
            "It prevents Python code from executing on 64-bit systems",
            "It synchronizes thread execution so only one native thread executes Python bytecode at any moment",
            "It automatically optimizes recursive function calls into tail calls",
            "It compiles Python source code into native machine assembly"
        ],
        "correct_option_index": 1,
        "explanation": "The Global Interpreter Lock (GIL) is a mutex used by CPython to prevent race conditions and ensure thread-safe memory management. Only one thread can execute Python bytecode at a time."
    },
    {
        "question_type": "mcq",
        "title": "Mutable Default Arguments",
        "question_text": "What happens when a mutable object (such as a list `def append_item(x, lst=[])`) is used as a default parameter in Python?",
        "options": [
            "Python raises a `TypeError` at compile time",
            "A fresh empty list is instantiated every time the function is called without the parameter",
            "The default list is created once at function definition and is shared across subsequent calls",
            "The list is garbage collected immediately upon function return"
        ],
        "correct_option_index": 2,
        "explanation": "In Python, default arguments are evaluated once when the function is defined, not each time it is called. Using a mutable object causes state to persist across calls."
    },
    {
        "question_type": "mcq",
        "title": "Generators & Memory Efficiency",
        "question_text": "How do generator functions using `yield` differ from functions that return a list in Python?",
        "options": [
            "Generators store all generated elements in RAM simultaneously",
            "Generators yield elements lazily one at a time via the iterator protocol without storing the entire sequence in memory",
            "Generators cannot be iterated over using a `for` loop",
            "Generators run on a separate background operating system process"
        ],
        "correct_option_index": 1,
        "explanation": "Generators produce items one at a time on demand (`lazy evaluation`), making them memory-efficient when handling large data sequences."
    },
    {
        "question_type": "mcq",
        "title": "Python __slots__ Optimization",
        "question_text": "What is the primary purpose of defining `__slots__` inside a Python class?",
        "options": [
            "To permit multiple inheritance from abstract base classes",
            "To restrict instance attributes to a fixed set, avoiding the overhead of `__dict__` and reducing memory footprint",
            "To automatically encrypt all class member variables",
            "To define database table primary keys in Django models"
        ],
        "correct_option_index": 1,
        "explanation": "Defining `__slots__` prevents the creation of an instance `__dict__` for each object, drastically decreasing memory consumption for millions of instances."
    },
    {
        "question_type": "mcq",
        "title": "Python Decorators",
        "question_text": "In Python, what is a decorator conceptually?",
        "options": [
            "A visual theme applied to the command-line interface",
            "A higher-order function that takes another function as an argument and extends or modifies its behavior",
            "A specialized syntax for defining C extensions",
            "A database migration trigger"
        ],
        "correct_option_index": 1,
        "explanation": "A decorator is a callable that accepts another function, wraps it to add functionality (such as logging or authentication), and returns a modified callable."
    },
    # Coding Challenges (6-10)
    {
        "question_type": "code",
        "title": "Two Sum / Target Index Finder",
        "difficulty": "Easy",
        "language": "python",
        "function_name": "two_sum",
        "question_text": "Given an array of integers `nums` and an integer `target`, return the indices of the two numbers such that they add up to `target`. You may assume each input would have exactly one solution, and you may not use the same element twice.",
        "input_format": "List of integers `nums` and integer `target`",
        "output_format": "List of two integer indices `[i, j]` in ascending order",
        "constraints": "2 <= len(nums) <= 10^4, -10^9 <= nums[i] <= 10^9",
        "examples": [
            {"input": "nums = [2, 7, 11, 15], target = 9", "output": "[0, 1]", "explanation": "nums[0] + nums[1] = 2 + 7 = 9"},
            {"input": "nums = [3, 2, 4], target = 6", "output": "[1, 2]", "explanation": "nums[1] + nums[2] = 2 + 4 = 6"}
        ],
        "starter_code": "def two_sum(nums, target):\n    # Write your solution below\n    pass\n",
        "sample_test_cases": [
            {"inputs": [[2, 7, 11, 15], 9], "expected": [0, 1]},
            {"inputs": [[3, 2, 4], 6], "expected": [1, 2]}
        ],
        "test_cases": [
            {"inputs": [[2, 7, 11, 15], 9], "expected": [0, 1]},
            {"inputs": [[3, 2, 4], 6], "expected": [1, 2]},
            {"inputs": [[3, 3], 6], "expected": [0, 1]},
            {"inputs": [[1, 5, 8, 12, 19], 20], "expected": [0, 4]}
        ],
        "explanation": "Use a hash map to store each number and its index. For each number, check if target - num exists in the hash map for O(n) time complexity."
    },
    {
        "question_type": "code",
        "title": "Valid Anagram",
        "difficulty": "Easy",
        "language": "python",
        "function_name": "is_anagram",
        "question_text": "Given two strings `s` and `t`, return `True` if `t` is an anagram of `s`, and `False` otherwise. An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.",
        "input_format": "Two strings `s` and `t`",
        "output_format": "Boolean `True` or `False`",
        "constraints": "1 <= len(s), len(t) <= 5 * 10^4",
        "examples": [
            {"input": "s = 'anagram', t = 'nagaram'", "output": "True", "explanation": "Both contain identical letter counts."},
            {"input": "s = 'rat', t = 'car'", "output": "False", "explanation": "'c' is not present in 'rat'."}
        ],
        "starter_code": "def is_anagram(s, t):\n    # Write your solution below\n    pass\n",
        "sample_test_cases": [
            {"inputs": ["anagram", "nagaram"], "expected": True},
            {"inputs": ["rat", "car"], "expected": False}
        ],
        "test_cases": [
            {"inputs": ["anagram", "nagaram"], "expected": True},
            {"inputs": ["rat", "car"], "expected": False},
            {"inputs": ["listen", "silent"], "expected": True},
            {"inputs": ["a", "ab"], "expected": False}
        ],
        "explanation": "Compare the character frequency counts or sorted representations of both strings in O(n) time."
    },
    {
        "question_type": "code",
        "title": "Word Frequency Counter",
        "difficulty": "Medium",
        "language": "python",
        "function_name": "word_frequencies",
        "question_text": "Given a sentence string `text`, return a dictionary where keys are unique lowercase words and values are their occurrence counts. Ignore punctuation marks (.,!?).",
        "input_format": "String `text`",
        "output_format": "Dictionary mapping lowercase words to integer frequencies",
        "constraints": "1 <= len(text) <= 10^5",
        "examples": [
            {"input": "text = 'Hello world! Hello Python.'", "output": "{'hello': 2, 'world': 1, 'python': 1}", "explanation": "Words are lowercased and stripped of punctuation."}
        ],
        "starter_code": "def word_frequencies(text):\n    # Write your solution below\n    pass\n",
        "sample_test_cases": [
            {"inputs": ["Hello world! Hello Python."], "expected": {"hello": 2, "world": 1, "python": 1}},
            {"inputs": ["Code, test, repeat, code."], "expected": {"code": 2, "test": 1, "repeat": 1}}
        ],
        "test_cases": [
            {"inputs": ["Hello world! Hello Python."], "expected": {"hello": 2, "world": 1, "python": 1}},
            {"inputs": ["Code, test, repeat, code."], "expected": {"code": 2, "test": 1, "repeat": 1}},
            {"inputs": ["one two three"], "expected": {"one": 1, "two": 1, "three": 1}}
        ],
        "explanation": "Strip punctuation using string cleaning or regex, split on whitespace, and build counts using collections.Counter or dict."
    },
    {
        "question_type": "code",
        "title": "Flatten Deeply Nested List",
        "difficulty": "Medium",
        "language": "python",
        "function_name": "flatten_list",
        "question_text": "Given a nested list containing integers and sub-lists to arbitrary depth, return a single flattened list with all integer values in their original order.",
        "input_format": "A nested list `nested`",
        "output_format": "A flat 1D list of integers",
        "constraints": "0 <= elements <= 1000",
        "examples": [
            {"input": "nested = [1, [2, [3, 4], 5], 6]", "output": "[1, 2, 3, 4, 5, 6]", "explanation": "All nested layers are unwrapped."}
        ],
        "starter_code": "def flatten_list(nested):\n    # Write your solution below\n    pass\n",
        "sample_test_cases": [
            {"inputs": [[1, [2, [3, 4], 5], 6]], "expected": [1, 2, 3, 4, 5, 6]},
            {"inputs": [[[1], [2]], [3]], "expected": [1, 2, 3]}
        ],
        "test_cases": [
            {"inputs": [[1, [2, [3, 4], 5], 6]], "expected": [1, 2, 3, 4, 5, 6]},
            {"inputs": [[[1], [2]], [3]], "expected": [1, 2, 3]},
            {"inputs": [[]], "expected": []},
            {"inputs": [[10, [20, [30]]]], "expected": [10, 20, 30]}
        ],
        "explanation": "Use recursion or an explicit stack to traverse nested lists and collect scalars."
    },
    {
        "question_type": "code",
        "title": "Bank Account Transaction Engine",
        "difficulty": "Hard",
        "language": "python",
        "function_name": "process_transactions",
        "question_text": "Write a transaction processor that takes an `initial_balance` and a list of transactions `[('deposit', amount), ('withdraw', amount), ...]`. Return a tuple `(final_balance, successful_transactions, rejected_transactions)`. A withdrawal is rejected if amount > current balance.",
        "input_format": "Integer `initial_balance` and list of transaction tuples",
        "output_format": "List of values `[final_balance, successful_count, rejected_count]`",
        "constraints": "initial_balance >= 0, amount > 0",
        "examples": [
            {"input": "initial_balance = 100, transactions = [('deposit', 50), ('withdraw', 200), ('withdraw', 30)]", "output": "[120, 2, 1]", "explanation": "100 + 50 = 150. Withdraw 200 fails. Withdraw 30 leaves 120."}
        ],
        "starter_code": "def process_transactions(initial_balance, transactions):\n    # Write your solution below\n    pass\n",
        "sample_test_cases": [
            {"inputs": [100, [["deposit", 50], ["withdraw", 200], ["withdraw", 30]]], "expected": [120, 2, 1]},
            {"inputs": [500, [["withdraw", 100], ["withdraw", 100]]], "expected": [300, 2, 0]}
        ],
        "test_cases": [
            {"inputs": [100, [["deposit", 50], ["withdraw", 200], ["withdraw", 30]]], "expected": [120, 2, 1]},
            {"inputs": [500, [["withdraw", 100], ["withdraw", 100]]], "expected": [300, 2, 0]},
            {"inputs": [50, [["withdraw", 100]]], "expected": [50, 0, 1]},
            {"inputs": [0, [["deposit", 1000], ["withdraw", 250]]], "expected": [750, 2, 0]}
        ],
        "explanation": "Iterate through transaction operations maintaining current balance and counting accepted/rejected actions."
    }
]

# ==============================================================================
# 2. SQL Querying & Relational Architecture (sql-querying-relational-architecture)
# ==============================================================================
ASSESSMENTS_DATA["sql-querying-relational-architecture"] = [
    # MCQs (1-5)
    {
        "question_type": "mcq",
        "title": "SQL Indexing & B-Trees",
        "question_text": "Why do relational database management systems predominantly use B-Tree indexes for primary and secondary indexing?",
        "options": [
            "B-Trees execute all queries in O(1) time regardless of table cardinality",
            "B-Trees maintain sorted order and support both point lookups and range queries with O(log N) disk reads",
            "B-Trees compress all string columns into 4-byte integers",
            "B-Trees completely eliminate the need for ACID transaction logs"
        ],
        "correct_option_index": 1,
        "explanation": "B-Tree structures maintain sorted keys, providing efficient O(log N) search, insertion, and range queries (BETWEEN, >, <)."
    },
    {
        "question_type": "mcq",
        "title": "WHERE vs HAVING Clauses",
        "question_text": "What is the crucial operational distinction between the `WHERE` and `HAVING` clauses in SQL?",
        "options": [
            "`WHERE` filters rows before aggregation, while `HAVING` filters grouped rows after aggregation functions like `SUM()` or `COUNT()`",
            "`WHERE` works exclusively on numeric columns while `HAVING` works on strings",
            "`HAVING` can only be used with `UPDATE` statements",
            "`WHERE` executes after the `ORDER BY` statement"
        ],
        "correct_option_index": 0,
        "explanation": "`WHERE` filters individual rows prior to grouping, whereas `HAVING` filters the aggregated results created by `GROUP BY`."
    },
    {
        "question_type": "mcq",
        "title": "LEFT JOIN Nullability",
        "question_text": "In a `LEFT JOIN`, what does the database return for right-table columns when no matching record is found in the right table?",
        "options": [
            "The query terminates with a foreign key violation error",
            "Empty string `''` for text columns and `0` for numeric columns",
            "`NULL` values for all right-table columns",
            "The values from the immediately preceding row"
        ],
        "correct_option_index": 2,
        "explanation": "A `LEFT JOIN` retains all records from the left table and inserts `NULL` for missing right-table fields."
    },
    {
        "question_type": "mcq",
        "title": "ACID Isolation Levels",
        "question_text": "Which ACID isolation level guarantees complete prevention of dirty reads, non-repeatable reads, and phantom reads?",
        "options": [
            "Read Uncommitted",
            "Read Committed",
            "Repeatable Read",
            "Serializable"
        ],
        "correct_option_index": 3,
        "explanation": "`Serializable` is the strictest isolation level, ensuring execution results identical to serial (one-by-one) transaction execution."
    },
    {
        "question_type": "mcq",
        "title": "Database Normalization (3NF)",
        "question_text": "A relation is in Third Normal Form (3NF) if it is in 2NF and has no:",
        "options": [
            "Primary keys",
            "Transitive dependencies between non-prime attributes",
            "Foreign keys",
            "Compound indexes"
        ],
        "correct_option_index": 1,
        "explanation": "3NF requires removing transitive functional dependencies where a non-prime attribute determines another non-prime attribute."
    },
    # Coding Challenges (6-10) - Real SQLite In-Memory Sandboxed Queries
    {
        "question_type": "code",
        "title": "Second Highest Salary",
        "difficulty": "Medium",
        "language": "sql",
        "function_name": "query",
        "question_text": "Write an SQL query to report the second highest salary from the `Employee` table. If there is no second highest salary, the query should report `NULL`.\n\nTable: `Employee` (`id INT`, `salary INT`)",
        "input_format": "Table `Employee` with columns `id` and `salary`",
        "output_format": "Single column `SecondHighestSalary`",
        "constraints": "Table contains up to 10^4 rows.",
        "examples": [
            {"input": "Employee: [[1, 100], [2, 200], [3, 300]]", "output": "200", "explanation": "200 is the second highest salary after 300."}
        ],
        "starter_code": "-- Write your SQL query below\nSELECT MAX(salary) AS SecondHighestSalary \nFROM Employee \nWHERE salary < (SELECT MAX(salary) FROM Employee);\n",
        "sample_test_cases": [
            {
                "schema": "CREATE TABLE Employee (id INT, salary INT); INSERT INTO Employee VALUES (1, 100), (2, 200), (3, 300);",
                "expected": [{"secondhighestsalary": 200}],
                "inputs": ["Salaries: 100, 200, 300"]
            }
        ],
        "test_cases": [
            {
                "schema": "CREATE TABLE Employee (id INT, salary INT); INSERT INTO Employee VALUES (1, 100), (2, 200), (3, 300);",
                "expected": [{"secondhighestsalary": 200}],
                "inputs": ["Salaries: 100, 200, 300"]
            },
            {
                "schema": "CREATE TABLE Employee (id INT, salary INT); INSERT INTO Employee VALUES (1, 100);",
                "expected": [{"secondhighestsalary": None}],
                "inputs": ["Only 1 employee (expected NULL)"]
            },
            {
                "schema": "CREATE TABLE Employee (id INT, salary INT); INSERT INTO Employee VALUES (1, 500), (2, 500);",
                "expected": [{"secondhighestsalary": None}],
                "inputs": ["Duplicate max salaries (expected NULL)"]
            }
        ],
        "explanation": "Select the MAX salary strictly less than the overall MAX salary."
    },
    {
        "question_type": "code",
        "title": "Customers Who Never Order",
        "difficulty": "Easy",
        "language": "sql",
        "function_name": "query",
        "question_text": "Write an SQL query to report all customers who never placed an order.\n\nTables:\n- `Customers` (`id INT`, `name TEXT`)\n- `Orders` (`id INT`, `customerId INT`)",
        "input_format": "Tables `Customers` and `Orders`",
        "output_format": "Single column `Customers` containing customer names",
        "constraints": "IDs are positive integers.",
        "examples": [
            {"input": "Customers: [(1, 'Joe'), (2, 'Henry')], Orders: [(1, 1)]", "output": "['Henry']", "explanation": "Henry placed no orders."}
        ],
        "starter_code": "-- Write your SQL query below\nSELECT c.name AS Customers\nFROM Customers c\nLEFT JOIN Orders o ON c.id = o.customerId\nWHERE o.id IS NULL;\n",
        "sample_test_cases": [
            {
                "schema": "CREATE TABLE Customers (id INT, name TEXT); CREATE TABLE Orders (id INT, customerId INT); INSERT INTO Customers VALUES (1, 'Joe'), (2, 'Henry'), (3, 'Sam'), (4, 'Max'); INSERT INTO Orders VALUES (1, 3), (2, 1);",
                "expected": [{"customers": "Henry"}, {"customers": "Max"}],
                "inputs": ["Customers Joe, Henry, Sam, Max with orders from Sam & Joe"]
            }
        ],
        "test_cases": [
            {
                "schema": "CREATE TABLE Customers (id INT, name TEXT); CREATE TABLE Orders (id INT, customerId INT); INSERT INTO Customers VALUES (1, 'Joe'), (2, 'Henry'), (3, 'Sam'), (4, 'Max'); INSERT INTO Orders VALUES (1, 3), (2, 1);",
                "expected": [{"customers": "Henry"}, {"customers": "Max"}],
                "inputs": ["Standard customer and order dataset"]
            },
            {
                "schema": "CREATE TABLE Customers (id INT, name TEXT); CREATE TABLE Orders (id INT, customerId INT); INSERT INTO Customers VALUES (1, 'Alice'); INSERT INTO Orders VALUES (1, 1);",
                "expected": [],
                "inputs": ["All customers ordered"]
            }
        ],
        "explanation": "Use a LEFT JOIN between Customers and Orders and filter WHERE Orders.id IS NULL."
    },
    {
        "question_type": "code",
        "title": "Duplicate Emails",
        "difficulty": "Easy",
        "language": "sql",
        "function_name": "query",
        "question_text": "Write an SQL query to report all the duplicate emails in the `Person` table.\n\nTable: `Person` (`id INT`, `email TEXT`)",
        "input_format": "Table `Person` with columns `id` and `email`",
        "output_format": "Column `Email`",
        "constraints": "Emails are lowercase strings.",
        "examples": [
            {"input": "Person: [(1, 'a@b.com'), (2, 'c@d.com'), (3, 'a@b.com')]", "output": "['a@b.com']", "explanation": "'a@b.com' appears twice."}
        ],
        "starter_code": "-- Write your SQL query below\nSELECT email AS Email\nFROM Person\nGROUP BY email\nHAVING COUNT(email) > 1;\n",
        "sample_test_cases": [
            {
                "schema": "CREATE TABLE Person (id INT, email TEXT); INSERT INTO Person VALUES (1, 'a@b.com'), (2, 'c@d.com'), (3, 'a@b.com');",
                "expected": [{"email": "a@b.com"}],
                "inputs": ["Duplicate a@b.com in table"]
            }
        ],
        "test_cases": [
            {
                "schema": "CREATE TABLE Person (id INT, email TEXT); INSERT INTO Person VALUES (1, 'a@b.com'), (2, 'c@d.com'), (3, 'a@b.com');",
                "expected": [{"email": "a@b.com"}],
                "inputs": ["Standard duplicate test"]
            },
            {
                "schema": "CREATE TABLE Person (id INT, email TEXT); INSERT INTO Person VALUES (1, 'unique@test.com'), (2, 'other@test.com');",
                "expected": [],
                "inputs": ["No duplicates"]
            }
        ],
        "explanation": "GROUP BY email and filter with HAVING COUNT(email) > 1."
    },
    {
        "question_type": "code",
        "title": "Department Highest Salary",
        "difficulty": "Medium",
        "language": "sql",
        "function_name": "query",
        "question_text": "Write an SQL query to find employees who have the highest salary in each of the departments.\n\nTables:\n- `Employee` (`id INT`, `name TEXT`, `salary INT`, `departmentId INT`)\n- `Department` (`id INT`, `name TEXT`)",
        "input_format": "Tables `Employee` and `Department`",
        "output_format": "Columns: `Department`, `Employee`, `Salary`",
        "constraints": "Salaries are non-negative integers.",
        "examples": [
            {"input": "IT Dept has Max (90k) and Joe (85k)", "output": "IT, Max, 90000", "explanation": "Max earns highest in IT."}
        ],
        "starter_code": "-- Write your SQL query below\nSELECT d.name AS Department, e.name AS Employee, e.salary AS Salary\nFROM Employee e\nJOIN Department d ON e.departmentId = d.id\nWHERE (e.departmentId, e.salary) IN (\n    SELECT departmentId, MAX(salary) FROM Employee GROUP BY departmentId\n);\n",
        "sample_test_cases": [
            {
                "schema": "CREATE TABLE Department (id INT, name TEXT); CREATE TABLE Employee (id INT, name TEXT, salary INT, departmentId INT); INSERT INTO Department VALUES (1, 'IT'), (2, 'Sales'); INSERT INTO Employee VALUES (1, 'Joe', 85000, 1), (2, 'Henry', 80000, 2), (3, 'Sam', 60000, 2), (4, 'Max', 90000, 1);",
                "expected": [{"department": "IT", "employee": "Max", "salary": 90000}, {"department": "Sales", "employee": "Henry", "salary": 80000}],
                "inputs": ["IT and Sales departments with distinct top earners"]
            }
        ],
        "test_cases": [
            {
                "schema": "CREATE TABLE Department (id INT, name TEXT); CREATE TABLE Employee (id INT, name TEXT, salary INT, departmentId INT); INSERT INTO Department VALUES (1, 'IT'), (2, 'Sales'); INSERT INTO Employee VALUES (1, 'Joe', 85000, 1), (2, 'Henry', 80000, 2), (3, 'Sam', 60000, 2), (4, 'Max', 90000, 1);",
                "expected": [{"department": "IT", "employee": "Max", "salary": 90000}, {"department": "Sales", "employee": "Henry", "salary": 80000}],
                "inputs": ["Standard department data"]
            }
        ],
        "explanation": "Use a subquery to find MAX(salary) grouped by departmentId and match against employee records."
    },
    {
        "question_type": "code",
        "title": "High Volume Customer Spenders",
        "difficulty": "Medium",
        "language": "sql",
        "function_name": "query",
        "question_text": "Write an SQL query to return `customer_id` and total spent `total_spent` for all customers who have spent at least 150 across all completed orders.\n\nTable: `Orders` (`id INT`, `customer_id INT`, `amount INT`, `status TEXT`)",
        "input_format": "Table `Orders`",
        "output_format": "Columns: `customer_id`, `total_spent` ordered by `total_spent` DESC",
        "constraints": "Status can be 'completed' or 'pending'.",
        "examples": [
            {"input": "Customer 1 has two completed orders of 100 each (total 200)", "output": "1, 200", "explanation": "200 >= 150"}
        ],
        "starter_code": "-- Write your SQL query below\nSELECT customer_id, SUM(amount) AS total_spent\nFROM Orders\nWHERE status = 'completed'\nGROUP BY customer_id\nHAVING SUM(amount) >= 150\nORDER BY total_spent DESC;\n",
        "sample_test_cases": [
            {
                "schema": "CREATE TABLE Orders (id INT, customer_id INT, amount INT, status TEXT); INSERT INTO Orders VALUES (1, 10, 100, 'completed'), (2, 10, 80, 'completed'), (3, 20, 50, 'completed'), (4, 30, 200, 'pending');",
                "expected": [{"customer_id": 10, "total_spent": 180}],
                "inputs": ["Customer 10 spends 180 completed; customer 30 is pending"]
            }
        ],
        "test_cases": [
            {
                "schema": "CREATE TABLE Orders (id INT, customer_id INT, amount INT, status TEXT); INSERT INTO Orders VALUES (1, 10, 100, 'completed'), (2, 10, 80, 'completed'), (3, 20, 50, 'completed'), (4, 30, 200, 'pending');",
                "expected": [{"customer_id": 10, "total_spent": 180}],
                "inputs": ["Standard test case"]
            },
            {
                "schema": "CREATE TABLE Orders (id INT, customer_id INT, amount INT, status TEXT); INSERT INTO Orders VALUES (1, 1, 250, 'completed'), (2, 2, 300, 'completed');",
                "expected": [{"customer_id": 2, "total_spent": 300}, {"customer_id": 1, "total_spent": 250}],
                "inputs": ["Multiple qualifying spenders ordered descending"]
            }
        ],
        "explanation": "Filter WHERE status = 'completed', GROUP BY customer_id, and filter HAVING SUM(amount) >= 150."
    }
]

from assessment_data_part2 import PART2_DATA
from assessment_data_part3 import PART3_DATA

ASSESSMENTS_DATA.update(PART2_DATA)
ASSESSMENTS_DATA.update(PART3_DATA)

