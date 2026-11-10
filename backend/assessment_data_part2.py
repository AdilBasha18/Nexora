"""
Assessment Question Bank - Part 2 (Assessments 3 through 9).
Each assessment contains 5 MCQs and 5 LeetCode-style Coding Challenges.
"""

PART2_DATA = {}

# ==============================================================================
# 3. Modern React & JavaScript Fundamentals (modern-react-javascript-fundamentals)
# ==============================================================================
PART2_DATA["modern-react-javascript-fundamentals"] = [
    # MCQs (1-5)
    {
        "question_type": "mcq",
        "title": "React useEffect Dependency Array",
        "question_text": "What happens in a React functional component if `useEffect` is passed an empty dependency array `[]`?",
        "options": [
            "The effect runs on every single render of the component",
            "The effect executes only once after the initial component mount",
            "The component throws a syntax error",
            "The component is unmounted immediately"
        ],
        "correct_option_index": 1,
        "explanation": "An empty dependency array `[]` signals to React that the effect doesn't depend on any reactive props or state, executing only once on mount."
    },
    {
        "question_type": "mcq",
        "title": "Virtual DOM Reconciliation",
        "question_text": "How does React's Virtual DOM reconciliation algorithm optimize browser UI updates?",
        "options": [
            "It re-renders the entire browser HTML document from scratch on every state update",
            "It creates an in-memory diff of the virtual tree against the previous render and applies only the minimum necessary changes to the real DOM",
            "It converts all JavaScript components into WebAssembly binaries",
            "It bypasses the browser rendering engine completely"
        ],
        "correct_option_index": 1,
        "explanation": "React compares the new Virtual DOM tree with the prior snapshot (diffing algorithm) and batches minimal real DOM mutations."
    },
    {
        "question_type": "mcq",
        "title": "JavaScript Closures",
        "question_text": "What is a closure in JavaScript?",
        "options": [
            "A syntax error caused by an unclosed curly brace",
            "A function combined with references to its lexical environment, allowing it to access outer variables even after the outer function has returned",
            "The process of terminating a Node.js process",
            "A built-in garbage collector method"
        ],
        "correct_option_index": 1,
        "explanation": "A closure retains access to variables from its outer lexical scope even when invoked outside that scope."
    },
    {
        "question_type": "mcq",
        "title": "Event Loop Microtasks",
        "question_text": "In the JavaScript event loop, when are Promise `.then()` callbacks (microtasks) executed relative to `setTimeout(..., 0)` (macrotasks)?",
        "options": [
            "After all macrotasks in the queue complete",
            "Immediately after the current execution context empties and before the next macrotask is dequeued",
            "Concurrently on a separate operating system thread",
            "At random intervals based on CPU load"
        ],
        "correct_option_index": 1,
        "explanation": "The microtask queue (Promise callbacks, queueMicrotask) is drained completely at the end of each task before the event loop advances to the next macrotask (timers/I/O)."
    },
    {
        "question_type": "mcq",
        "title": "React Keys in Lists",
        "question_text": "Why must you provide a unique `key` prop when rendering a dynamic list in React?",
        "options": [
            "To allow CSS selectors to style list items",
            "To help React identify which items have changed, been added, or been removed, preserving component state and minimizing re-renders",
            "To convert array items into localStorage keys",
            "To enable server-side database indexing"
        ],
        "correct_option_index": 1,
        "explanation": "Stable, unique keys allow React to track list item identity across renders, preventing subtle rendering bugs and unnecessary DOM mutations."
    },
    # Coding Challenges (6-10) - Real Node.js JavaScript Sandbox
    {
        "question_type": "code",
        "title": "Chunk Array",
        "difficulty": "Easy",
        "language": "javascript",
        "function_name": "chunk",
        "question_text": "Given an array `arr` and a chunk size `size`, return a chunked array. A chunked array contains the original elements in `arr`, but consists of subarrays each of length `size`. The length of the last subarray may be less than `size` if `arr.length` is not evenly divisible.",
        "input_format": "Array `arr` and positive integer `size`",
        "output_format": "2D Array of chunked subarrays",
        "constraints": "size >= 1, 0 <= arr.length <= 10^4",
        "examples": [
            {"input": "arr = [1, 2, 3, 4, 5], size = 2", "output": "[[1, 2], [3, 4], [5]]", "explanation": "Split into chunks of 2 with remainder [5]."}
        ],
        "starter_code": "function chunk(arr, size) {\n    // Write your solution below\n    const res = [];\n    for (let i = 0; i < arr.length; i += size) {\n        res.push(arr.slice(i, i + size));\n    }\n    return res;\n}\n",
        "sample_test_cases": [
            {"inputs": [[1, 2, 3, 4, 5], 2], "expected": [[1, 2], [3, 4], [5]]},
            {"inputs": [[1, 9, 6, 3, 2], 3], "expected": [[1, 9, 6], [3, 2]]}
        ],
        "test_cases": [
            {"inputs": [[1, 2, 3, 4, 5], 2], "expected": [[1, 2], [3, 4], [5]]},
            {"inputs": [[1, 9, 6, 3, 2], 3], "expected": [[1, 9, 6], [3, 2]]},
            {"inputs": [[], 1], "expected": []},
            {"inputs": [[1, 2, 3], 5], "expected": [[1, 2, 3]]}
        ],
        "explanation": "Iterate with step `size` and push `arr.slice(i, i + size)` into the result array."
    },
    {
        "question_type": "code",
        "title": "Deep Clone Object",
        "difficulty": "Medium",
        "language": "javascript",
        "function_name": "deepClone",
        "question_text": "Write a function `deepClone(obj)` that returns a deep copy of a JavaScript object or array. Modifying the copy should never mutate the original object.",
        "input_format": "JavaScript Object or Array `obj`",
        "output_format": "Deep copy of `obj`",
        "constraints": "Handles primitives, nested objects, and arrays.",
        "examples": [
            {"input": "obj = { a: 1, b: { c: 2 } }", "output": "{ a: 1, b: { c: 2 } }", "explanation": "Returns identical deep cloned structure."}
        ],
        "starter_code": "function deepClone(obj) {\n    // Write your solution below\n    if (obj === null || typeof obj !== 'object') return obj;\n    if (Array.isArray(obj)) return obj.map(deepClone);\n    const copy = {};\n    for (const key in obj) {\n        if (Object.prototype.hasOwnProperty.call(obj, key)) {\n            copy[key] = deepClone(obj[key]);\n        }\n    }\n    return copy;\n}\n",
        "sample_test_cases": [
            {"inputs": [{"a": 1, "b": {"c": 2}}], "expected": {"a": 1, "b": {"c": 2}}},
            {"inputs": [[1, [2, 3], {"x": 4}]], "expected": [1, [2, 3], {"x": 4}]}
        ],
        "test_cases": [
            {"inputs": [{"a": 1, "b": {"c": 2}}], "expected": {"a": 1, "b": {"c": 2}}},
            {"inputs": [[1, [2, 3], {"x": 4}]], "expected": [1, [2, 3], {"x": 4}]},
            {"inputs": [None], "expected": None},
            {"inputs": ["simple string"], "expected": "simple string"}
        ],
        "explanation": "Recursively clone nested arrays and object keys."
    },
    {
        "question_type": "code",
        "title": "Array Compact (Remove Falsy Values)",
        "difficulty": "Easy",
        "language": "javascript",
        "function_name": "compact",
        "question_text": "Given an array `arr`, return a new array with all falsy values removed. In JavaScript, falsy values are `false`, `0`, `\"\"`, `null`, `undefined`, and `NaN`.",
        "input_format": "Array `arr`",
        "output_format": "Filtered array containing only truthy elements",
        "constraints": "0 <= arr.length <= 10^4",
        "examples": [
            {"input": "arr = [0, 1, false, 2, '', 3, 'a']", "output": "[1, 2, 3, 'a']", "explanation": "0, false, and '' are removed."}
        ],
        "starter_code": "function compact(arr) {\n    // Write your solution below\n    return arr.filter(Boolean);\n}\n",
        "sample_test_cases": [
            {"inputs": [[0, 1, False, 2, "", 3, "a"]], "expected": [1, 2, 3, "a"]},
            {"inputs": [[None, 0, False, "hello"]], "expected": ["hello"]}
        ],
        "test_cases": [
            {"inputs": [[0, 1, False, 2, "", 3, "a"]], "expected": [1, 2, 3, "a"]},
            {"inputs": [[None, 0, False, "hello"]], "expected": ["hello"]},
            {"inputs": [[1, 2, 3]], "expected": [1, 2, 3]},
            {"inputs": [[]], "expected": []}
        ],
        "explanation": "Use `arr.filter(Boolean)` to filter for strictly truthy values."
    },
    {
        "question_type": "code",
        "title": "Flatten Array to Specified Depth",
        "difficulty": "Medium",
        "language": "javascript",
        "function_name": "flattenDepth",
        "question_text": "Write a function `flattenDepth(arr, depth)` that recursively flattens array `arr` up to `depth` times.",
        "input_format": "Array `arr` and non-negative integer `depth`",
        "output_format": "Flattened array",
        "constraints": "depth >= 0",
        "examples": [
            {"input": "arr = [1, [2, [3, [4]], 5]], depth = 1", "output": "[1, 2, [3, [4]], 5]", "explanation": "Flattens one level of nesting."}
        ],
        "starter_code": "function flattenDepth(arr, depth) {\n    // Write your solution below\n    if (depth <= 0) return arr.slice();\n    return arr.reduce((acc, val) => {\n        if (Array.isArray(val)) {\n            acc.push(...flattenDepth(val, depth - 1));\n        } else {\n            acc.push(val);\n        }\n        return acc;\n    }, []);\n}\n",
        "sample_test_cases": [
            {"inputs": [[1, [2, [3, [4]], 5]], 1], "expected": [1, 2, [3, [4]], 5]},
            {"inputs": [[1, [2, [3, [4]], 5]], 2], "expected": [1, 2, 3, [4], 5]}
        ],
        "test_cases": [
            {"inputs": [[1, [2, [3, [4]], 5]], 1], "expected": [1, 2, [3, [4]], 5]},
            {"inputs": [[1, [2, [3, [4]], 5]], 2], "expected": [1, 2, 3, [4], 5]},
            {"inputs": [[1, [2]], 0], "expected": [1, [2]]}
        ],
        "explanation": "Recursively unwrap sub-arrays decrementing depth until depth reaches 0."
    },
    {
        "question_type": "code",
        "title": "Function Execution Counter & Cache",
        "difficulty": "Hard",
        "language": "javascript",
        "function_name": "createMemoizedMultiplier",
        "question_text": "Write a function `createMemoizedMultiplier()` that returns a function `multiply(a, b)`. When called with pairs of numbers `(a, b)`, it caches and returns their product `a * b`. It must return the product directly. If called with identical arguments (e.g. `(2, 3)`), it returns the cached result without recalculating.",
        "input_format": "Function with arguments `(a, b)`",
        "output_format": "Integer product `a * b`",
        "constraints": "a, b are integers",
        "examples": [
            {"input": "multiply(3, 4)", "output": "12", "explanation": "3 * 4 = 12"}
        ],
        "starter_code": "function createMemoizedMultiplier() {\n    const cache = {};\n    return function(a, b) {\n        const key = `${a},${b}`;\n        if (cache[key] !== undefined) return cache[key];\n        const res = a * b;\n        cache[key] = res;\n        return res;\n    };\n}\n\n// Solution entry point\nfunction solution(a, b) {\n    const fn = createMemoizedMultiplier();\n    return fn(a, b);\n}\n",
        "sample_test_cases": [
            {"inputs": [6, 7], "expected": 42},
            {"inputs": [10, 0], "expected": 0}
        ],
        "test_cases": [
            {"inputs": [6, 7], "expected": 42},
            {"inputs": [10, 0], "expected": 0},
            {"inputs": [-5, 8], "expected": -40},
            {"inputs": [12, 12], "expected": 144}
        ],
        "explanation": "Use a closure with a dictionary cache keyed on arguments."
    }
]

# ==============================================================================
# 4. Data Structures & Algorithms Core Concepts (data-structures-algorithms-core-concepts)
# ==============================================================================
PART2_DATA["data-structures-algorithms-core-concepts"] = [
    # MCQs (1-5)
    {
        "question_type": "mcq",
        "title": "Quicksort Worst-Case Complexity",
        "question_text": "What is the worst-case time complexity of standard Quicksort when using a naive first-element pivot on an already sorted array?",
        "options": [
            "O(log N)",
            "O(N log N)",
            "O(N^2)",
            "O(1)"
        ],
        "correct_option_index": 2,
        "explanation": "When the pivot is consistently the maximum or minimum element, Quicksort partitions the array into sizes 0 and N-1, degrading to O(N^2) comparisons."
    },
    {
        "question_type": "mcq",
        "title": "Min-Heap Operations",
        "question_text": "What is the time complexity of extracting the minimum element (`heappop`) from a binary min-heap with N elements?",
        "options": [
            "O(1)",
            "O(log N)",
            "O(N)",
            "O(N log N)"
        ],
        "correct_option_index": 1,
        "explanation": "Extracting the min requires replacing the root with the last leaf and sifting down through tree height, taking O(log N) time."
    },
    {
        "question_type": "mcq",
        "title": "Hash Table Collisions",
        "question_text": "Which collision resolution technique stores all elements hashing to the same bucket in a linked list or dynamic array at that bucket index?",
        "options": [
            "Linear probing",
            "Separate chaining",
            "Quadratic probing",
            "Double hashing"
        ],
        "correct_option_index": 1,
        "explanation": "Separate chaining resolves hash collisions by maintaining a linked list or collection of keys at each bucket slot."
    },
    {
        "question_type": "mcq",
        "title": "BFS vs DFS Graph Traversal",
        "question_text": "Which data structure is typically utilized to implement Breadth-First Search (BFS) on an unweighted graph to find the shortest path?",
        "options": [
            "LIFO Stack",
            "FIFO Queue",
            "Priority Queue",
            "Binary Search Tree"
        ],
        "correct_option_index": 1,
        "explanation": "BFS uses a First-In-First-Out (FIFO) queue to visit all neighbor vertices at distance d before moving to distance d+1."
    },
    {
        "question_type": "mcq",
        "title": "Amortized Time Complexity",
        "question_text": "Appending an element to a dynamic array (like Python list or C++ std::vector) has an amortized time complexity of:",
        "options": [
            "O(1)",
            "O(log N)",
            "O(N)",
            "O(N^2)"
        ],
        "correct_option_index": 0,
        "explanation": "Even though resizing and copying takes O(N), resizing occurs geometrically (doubling), making the amortized cost per append O(1)."
    },
    # Coding Challenges (6-10)
    {
        "question_type": "code",
        "title": "Binary Search",
        "difficulty": "Easy",
        "language": "python",
        "function_name": "binary_search",
        "question_text": "Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, then return its index. Otherwise, return -1 in O(log N) runtime.",
        "input_format": "Sorted list of integers `nums` and integer `target`",
        "output_format": "Integer index or -1",
        "constraints": "1 <= nums.length <= 10^4",
        "examples": [
            {"input": "nums = [-1, 0, 3, 5, 9, 12], target = 9", "output": "4", "explanation": "9 exists in nums and its index is 4."}
        ],
        "starter_code": "def binary_search(nums, target):\n    # Write your solution below\n    left, right = 0, len(nums) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if nums[mid] == target:\n            return mid\n        elif nums[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1\n",
        "sample_test_cases": [
            {"inputs": [[-1, 0, 3, 5, 9, 12], 9], "expected": 4},
            {"inputs": [[-1, 0, 3, 5, 9, 12], 2], "expected": -1}
        ],
        "test_cases": [
            {"inputs": [[-1, 0, 3, 5, 9, 12], 9], "expected": 4},
            {"inputs": [[-1, 0, 3, 5, 9, 12], 2], "expected": -1},
            {"inputs": [[5], 5], "expected": 0},
            {"inputs": [[1, 3, 5, 7, 9], 1], "expected": 0}
        ],
        "explanation": "Classic two-pointer binary search with mid index calculation."
    },
    {
        "question_type": "code",
        "title": "Valid Parentheses",
        "difficulty": "Easy",
        "language": "python",
        "function_name": "is_valid",
        "question_text": "Given a string `s` containing just the characters `'('`, `')'`, `'{'`, `'}'`, `'['` and `']'`, determine if the input string is valid. Open brackets must be closed by the same type of brackets in the correct order.",
        "input_format": "String `s`",
        "output_format": "Boolean `True` or `False`",
        "constraints": "1 <= len(s) <= 10^4",
        "examples": [
            {"input": "s = '()[]{}'", "output": "True", "explanation": "All brackets matched in order."},
            {"input": "s = '(]'", "output": "False", "explanation": "Mismatched closing bracket."}
        ],
        "starter_code": "def is_valid(s):\n    # Write your solution below\n    stack = []\n    mapping = {')': '(', '}': '{', ']': '['}\n    for char in s:\n        if char in mapping:\n            top = stack.pop() if stack else '#'\n            if mapping[char] != top:\n                return False\n        else:\n            stack.append(char)\n    return not stack\n",
        "sample_test_cases": [
            {"inputs": ["()[]{}"], "expected": True},
            {"inputs": ["(]"], "expected": False}
        ],
        "test_cases": [
            {"inputs": ["()[]{}"], "expected": True},
            {"inputs": ["(]"], "expected": False},
            {"inputs": ["([{}])"], "expected": True},
            {"inputs": ["["], "expected": False}
        ],
        "explanation": "Use a stack to push open brackets and pop matching pairs."
    },
    {
        "question_type": "code",
        "title": "Maximum Subarray (Kadane's Algorithm)",
        "difficulty": "Medium",
        "language": "python",
        "function_name": "max_sub_array",
        "question_text": "Given an integer array `nums`, find the subarray with the largest sum, and return its sum.",
        "input_format": "List of integers `nums`",
        "output_format": "Integer maximum subarray sum",
        "constraints": "1 <= nums.length <= 10^5, -10^4 <= nums[i] <= 10^4",
        "examples": [
            {"input": "nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]", "output": "6", "explanation": "The subarray [4, -1, 2, 1] has the largest sum 6."}
        ],
        "starter_code": "def max_sub_array(nums):\n    # Write your solution below\n    max_sum = current_sum = nums[0]\n    for x in nums[1:]:\n        current_sum = max(x, current_sum + x)\n        max_sum = max(max_sum, current_sum)\n    return max_sum\n",
        "sample_test_cases": [
            {"inputs": [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], "expected": 6},
            {"inputs": [[1]], "expected": 1}
        ],
        "test_cases": [
            {"inputs": [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], "expected": 6},
            {"inputs": [[1]], "expected": 1},
            {"inputs": [[5, 4, -1, 7, 8]], "expected": 23},
            {"inputs": [[-1, -2, -3]], "expected": -1}
        ],
        "explanation": "Kadane's algorithm maintains maximum sum ending at current index in O(N) time."
    },
    {
        "question_type": "code",
        "title": "Merge Two Sorted Arrays",
        "difficulty": "Easy",
        "language": "python",
        "function_name": "merge_sorted",
        "question_text": "Given two sorted integer lists `a` and `b`, merge them into a single sorted list in ascending order.",
        "input_format": "Two sorted lists of integers `a` and `b`",
        "output_format": "Single merged sorted list",
        "constraints": "0 <= len(a), len(b) <= 10^4",
        "examples": [
            {"input": "a = [1, 3, 5], b = [2, 4, 6]", "output": "[1, 2, 3, 4, 5, 6]", "explanation": "Sorted combination."}
        ],
        "starter_code": "def merge_sorted(a, b):\n    # Write your solution below\n    res = []\n    i = j = 0\n    while i < len(a) and j < len(b):\n        if a[i] <= b[j]:\n            res.append(a[i])\n            i += 1\n        else:\n            res.append(b[j])\n            j += 1\n    res.extend(a[i:])\n    res.extend(b[j:])\n    return res\n",
        "sample_test_cases": [
            {"inputs": [[1, 3, 5], [2, 4, 6]], "expected": [1, 2, 3, 4, 5, 6]},
            {"inputs": [[], [1]], "expected": [1]}
        ],
        "test_cases": [
            {"inputs": [[1, 3, 5], [2, 4, 6]], "expected": [1, 2, 3, 4, 5, 6]},
            {"inputs": [[], [1]], "expected": [1]},
            {"inputs": [[10, 20], [5, 15, 25]], "expected": [5, 10, 15, 20, 25]}
        ],
        "explanation": "Two-pointer merge step from Merge Sort algorithm in O(N + M) time."
    },
    {
        "question_type": "code",
        "title": "Longest Substring Without Repeating Characters",
        "difficulty": "Medium",
        "language": "python",
        "function_name": "length_of_longest_substring",
        "question_text": "Given a string `s`, find the length of the longest substring without repeating characters.",
        "input_format": "String `s`",
        "output_format": "Integer length",
        "constraints": "0 <= len(s) <= 5 * 10^4",
        "examples": [
            {"input": "s = 'abcabcbb'", "output": "3", "explanation": "The answer is 'abc', with length 3."}
        ],
        "starter_code": "def length_of_longest_substring(s):\n    # Write your solution below\n    char_map = {}\n    left = 0\n    max_len = 0\n    for right, char in enumerate(s):\n        if char in char_map and char_map[char] >= left:\n            left = char_map[char] + 1\n        char_map[char] = right\n        max_len = max(max_len, right - left + 1)\n    return max_len\n",
        "sample_test_cases": [
            {"inputs": ["abcabcbb"], "expected": 3},
            {"inputs": ["bbbbb"], "expected": 1}
        ],
        "test_cases": [
            {"inputs": ["abcabcbb"], "expected": 3},
            {"inputs": ["bbbbb"], "expected": 1},
            {"inputs": ["pwwkew"], "expected": 3},
            {"inputs": [""], "expected": 0}
        ],
        "explanation": "Sliding window with hash map storing last seen index of each character."
    }
]

# ==============================================================================
# 5. Data Science & ML Foundations (data-science-ml-foundations)
# ==============================================================================
PART2_DATA["data-science-ml-foundations"] = [
    # MCQs (1-5)
    {
        "question_type": "mcq",
        "title": "Bias-Variance Tradeoff",
        "question_text": "A machine learning model with extremely high variance and low bias typically suffers from:",
        "options": [
            "Underfitting the training dataset",
            "Overfitting the training data and poor generalization to unseen test data",
            "Excessive regularization penalty",
            "Insufficient training epochs"
        ],
        "correct_option_index": 1,
        "explanation": "High variance means the model fits noise in the training set (overfitting), failing to generalize."
    },
    {
        "question_type": "mcq",
        "title": "L1 vs L2 Regularization",
        "question_text": "What distinctive feature makes L1 Regularization (Lasso) suitable for feature selection compared to L2 (Ridge)?",
        "options": [
            "L1 shrinks less important feature weights strictly to zero, effectively producing a sparse model",
            "L1 prevents gradient descent from converging",
            "L1 works only on unsupervised neural networks",
            "L1 squares weight coefficients"
        ],
        "correct_option_index": 0,
        "explanation": "L1 penalty (|w|) forces non-informative feature coefficients to zero, creating sparse feature selection."
    },
    {
        "question_type": "mcq",
        "title": "Precision vs Recall Tradeoff",
        "question_text": "In a cancer detection diagnosis system where missing a positive case is critical, which metric should be prioritized?",
        "options": [
            "High Precision",
            "High Recall (Sensitivity)",
            "Low F1-Score",
            "High Specificity at the cost of Sensitivity"
        ],
        "correct_option_index": 1,
        "explanation": "High Recall minimizes False Negatives (missed positive disease cases)."
    },
    {
        "question_type": "mcq",
        "title": "ROC-AUC Curve",
        "question_text": "What does an Area Under the ROC Curve (AUC) of 0.5 represent for a binary classifier?",
        "options": [
            "A perfect model with zero false positives",
            "Performance equivalent to random guessing",
            "Severe underfitting requiring GPU hardware",
            "A model that inverts class labels"
        ],
        "correct_option_index": 1,
        "explanation": "An AUC of 0.5 represents a diagonal line where True Positive Rate equals False Positive Rate (random coin toss)."
    },
    {
        "question_type": "mcq",
        "title": "Principal Component Analysis (PCA)",
        "question_text": "In Principal Component Analysis (PCA), how are principal components selected?",
        "options": [
            "By maximizing the mutual information with the target label",
            "Along directions of maximum variance orthogonal to all preceding components",
            "By eliminating rows with missing values",
            "By computing cross-entropy loss"
        ],
        "correct_option_index": 1,
        "explanation": "PCA identifies orthogonal axes of maximum variance via eigenvectors of the covariance matrix."
    },
    # Coding Challenges (6-10)
    {
        "question_type": "code",
        "title": "Min-Max Feature Scaler",
        "difficulty": "Easy",
        "language": "python",
        "function_name": "min_max_scale",
        "question_text": "Given a list of numbers `data`, return the min-max normalized list where each value is scaled to the range [0.0, 1.0]. Formula: `(x - min) / (max - min)`. If all numbers are equal, return a list of 0.0s.",
        "input_format": "List of floats or ints `data`",
        "output_format": "List of scaled floats rounded to 2 decimal places",
        "constraints": "1 <= len(data) <= 1000",
        "examples": [
            {"input": "data = [10, 20, 30]", "output": "[0.0, 0.5, 1.0]", "explanation": "(10-10)/20 = 0, (20-10)/20 = 0.5, (30-10)/20 = 1.0"}
        ],
        "starter_code": "def min_max_scale(data):\n    # Write your solution below\n    mn, mx = min(data), max(data)\n    if mn == mx:\n        return [0.0] * len(data)\n    return [round((x - mn) / (mx - mn), 2) for x in data]\n",
        "sample_test_cases": [
            {"inputs": [[10, 20, 30]], "expected": [0.0, 0.5, 1.0]},
            {"inputs": [[5, 5, 5]], "expected": [0.0, 0.0, 0.0]}
        ],
        "test_cases": [
            {"inputs": [[10, 20, 30]], "expected": [0.0, 0.5, 1.0]},
            {"inputs": [[5, 5, 5]], "expected": [0.0, 0.0, 0.0]},
            {"inputs": [[0, 100]], "expected": [0.0, 1.0]}
        ],
        "explanation": "Compute min and max, then apply min-max scaling formula with zero-division safeguard."
    },
    {
        "question_type": "code",
        "title": "Mean Squared Error Calculator",
        "difficulty": "Easy",
        "language": "python",
        "function_name": "mean_squared_error",
        "question_text": "Given two lists `y_true` and `y_pred` of identical length, compute the Mean Squared Error (MSE). Return the float rounded to 2 decimal places.",
        "input_format": "Lists `y_true` and `y_pred`",
        "output_format": "Float rounded to 2 decimals",
        "constraints": "len(y_true) == len(y_pred) >= 1",
        "examples": [
            {"input": "y_true = [3, -0.5, 2, 7], y_pred = [2.5, 0.0, 2, 8]", "output": "0.38", "explanation": "Average squared difference is 0.375 -> rounded to 0.38"}
        ],
        "starter_code": "def mean_squared_error(y_true, y_pred):\n    # Write your solution below\n    diffs = [(yt - yp) ** 2 for yt, yp in zip(y_true, y_pred)]\n    return round(sum(diffs) / len(diffs), 2)\n",
        "sample_test_cases": [
            {"inputs": [[3, -0.5, 2, 7], [2.5, 0.0, 2, 8]], "expected": 0.38},
            {"inputs": [[1, 2, 3], [1, 2, 3]], "expected": 0.0}
        ],
        "test_cases": [
            {"inputs": [[3, -0.5, 2, 7], [2.5, 0.0, 2, 8]], "expected": 0.38},
            {"inputs": [[1, 2, 3], [1, 2, 3]], "expected": 0.0},
            {"inputs": [[10, 20], [12, 18]], "expected": 4.0}
        ],
        "explanation": "Sum (y_true - y_pred)^2 and divide by length."
    },
    {
        "question_type": "code",
        "title": "Missing Value Mean Imputer",
        "difficulty": "Medium",
        "language": "python",
        "function_name": "impute_mean",
        "question_text": "Given a list of numbers where missing values are represented by `-1`, replace each `-1` with the arithmetic mean of all valid non-negative values. Return values rounded to 1 decimal place.",
        "input_format": "List of numbers with -1 as missing sentinel",
        "output_format": "List of floats rounded to 1 decimal place",
        "constraints": "At least one non-missing value present.",
        "examples": [
            {"input": "data = [10, -1, 30, -1]", "output": "[10.0, 20.0, 30.0, 20.0]", "explanation": "Mean of 10 and 30 is 20.0."}
        ],
        "starter_code": "def impute_mean(data):\n    # Write your solution below\n    valid = [x for x in data if x != -1]\n    avg = round(sum(valid) / len(valid), 1) if valid else 0.0\n    return [round(float(x), 1) if x != -1 else avg for x in data]\n",
        "sample_test_cases": [
            {"inputs": [[10, -1, 30, -1]], "expected": [10.0, 20.0, 30.0, 20.0]},
            {"inputs": [[5, 5]], "expected": [5.0, 5.0]}
        ],
        "test_cases": [
            {"inputs": [[10, -1, 30, -1]], "expected": [10.0, 20.0, 30.0, 20.0]},
            {"inputs": [[5, 5]], "expected": [5.0, 5.0]},
            {"inputs": [[-1, 100]], "expected": [100.0, 100.0]}
        ],
        "explanation": "Filter valid non-sentinel values, calculate mean, and substitute missing entries."
    },
    {
        "question_type": "code",
        "title": "Euclidean Distance",
        "difficulty": "Easy",
        "language": "python",
        "function_name": "euclidean_distance",
        "question_text": "Given two N-dimensional coordinate vectors `p1` and `p2`, calculate the Euclidean distance between them: `sqrt(sum((p1[i] - p2[i])^2))`. Return float rounded to 2 decimal places.",
        "input_format": "Two coordinate lists `p1` and `p2`",
        "output_format": "Float rounded to 2 decimals",
        "constraints": "len(p1) == len(p2)",
        "examples": [
            {"input": "p1 = [0, 0], p2 = [3, 4]", "output": "5.0", "explanation": "sqrt(3^2 + 4^2) = 5.0"}
        ],
        "starter_code": "import math\n\ndef euclidean_distance(p1, p2):\n    # Write your solution below\n    return round(math.sqrt(sum((a - b) ** 2 for a, b in zip(p1, p2))), 2)\n",
        "sample_test_cases": [
            {"inputs": [[0, 0], [3, 4]], "expected": 5.0},
            {"inputs": [[1, 2, 3], [1, 2, 3]], "expected": 0.0}
        ],
        "test_cases": [
            {"inputs": [[0, 0], [3, 4]], "expected": 5.0},
            {"inputs": [[1, 2, 3], [1, 2, 3]], "expected": 0.0},
            {"inputs": [[1, 1], [4, 5]], "expected": 5.0}
        ],
        "explanation": "Sum of squared coordinate differences square-rooted."
    },
    {
        "question_type": "code",
        "title": "Classification Metric Evaluator (Precision, Recall, F1)",
        "difficulty": "Medium",
        "language": "python",
        "function_name": "evaluate_metrics",
        "question_text": "Given binary lists `y_true` and `y_pred` consisting of 0s and 1s, compute `[precision, recall, f1]`. Return list of floats rounded to 2 decimal places. If denominator is 0, metric is 0.0.",
        "input_format": "Lists `y_true` and `y_pred` of 0s and 1s",
        "output_format": "List of 3 floats `[precision, recall, f1]`",
        "constraints": "len(y_true) == len(y_pred) >= 1",
        "examples": [
            {"input": "y_true = [1, 1, 0, 0], y_pred = [1, 0, 0, 1]", "output": "[0.5, 0.5, 0.5]", "explanation": "TP=1, FP=1, FN=1."}
        ],
        "starter_code": "def evaluate_metrics(y_true, y_pred):\n    # Write your solution below\n    tp = sum(1 for yt, yp in zip(y_true, y_pred) if yt == 1 and yp == 1)\n    fp = sum(1 for yt, yp in zip(y_true, y_pred) if yt == 0 and yp == 1)\n    fn = sum(1 for yt, yp in zip(y_true, y_pred) if yt == 1 and yp == 0)\n    prec = tp / (tp + fp) if (tp + fp) > 0 else 0.0\n    rec = tp / (tp + fn) if (tp + fn) > 0 else 0.0\n    f1 = (2 * prec * rec) / (prec + rec) if (prec + rec) > 0 else 0.0\n    return [round(prec, 2), round(rec, 2), round(f1, 2)]\n",
        "sample_test_cases": [
            {"inputs": [[1, 1, 0, 0], [1, 0, 0, 1]], "expected": [0.5, 0.5, 0.5]},
            {"inputs": [[1, 1, 1], [1, 1, 1]], "expected": [1.0, 1.0, 1.0]}
        ],
        "test_cases": [
            {"inputs": [[1, 1, 0, 0], [1, 0, 0, 1]], "expected": [0.5, 0.5, 0.5]},
            {"inputs": [[1, 1, 1], [1, 1, 1]], "expected": [1.0, 1.0, 1.0]},
            {"inputs": [[0, 0], [1, 1]], "expected": [0.0, 0.0, 0.0]}
        ],
        "explanation": "Compute True Positives, False Positives, False Negatives and derive precision, recall, and harmonic mean F1."
    }
]

# ==============================================================================
# 6. Logical Aptitude & Quantitative Reasoning (general-logical-aptitude-quantitative-reasoning)
# ==============================================================================
PART2_DATA["general-logical-aptitude-quantitative-reasoning"] = [
    # MCQs (1-5)
    {
        "question_type": "mcq",
        "title": "Speed, Time & Distance",
        "question_text": "A car travels from Town A to Town B at 60 km/h and returns along the same route at 40 km/h. What is the average speed for the entire round trip?",
        "options": [
            "50 km/h",
            "48 km/h",
            "52 km/h",
            "45 km/h"
        ],
        "correct_option_index": 1,
        "explanation": "Average speed for equal distances is the harmonic mean: 2 * (v1 * v2) / (v1 + v2) = (2 * 60 * 40) / 100 = 48 km/h."
    },
    {
        "question_type": "mcq",
        "title": "Probability of Independent Events",
        "question_text": "If two fair 6-sided dice are rolled simultaneously, what is the probability that the sum of the numbers is exactly 7?",
        "options": [
            "1/12",
            "1/6",
            "7/36",
            "5/36"
        ],
        "correct_option_index": 1,
        "explanation": "There are 6 winning combinations: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) out of 36 total outcomes -> 6/36 = 1/6."
    },
    {
        "question_type": "mcq",
        "title": "Permutations of Letters",
        "question_text": "In how many distinct ways can the letters of the word 'LEVEL' be arranged?",
        "options": [
            "120",
            "60",
            "30",
            "24"
        ],
        "correct_option_index": 2,
        "explanation": "Total letters = 5, with 'L' repeated twice and 'E' repeated twice: 5! / (2! * 2!) = 120 / 4 = 30."
    },
    {
        "question_type": "mcq",
        "title": "Work & Time Rates",
        "question_text": "Person A can complete a task in 6 days, and Person B can complete it in 12 days. Working together, how many days will they take?",
        "options": [
            "9 days",
            "4 days",
            "3 days",
            "5 days"
        ],
        "correct_option_index": 1,
        "explanation": "Combined rate per day = 1/6 + 1/12 = 3/12 = 1/4 task/day -> 4 days to finish."
    },
    {
        "question_type": "mcq",
        "title": "Clock Angle Problem",
        "question_text": "What is the angle between the hour hand and minute hand of an analog clock at 3:15?",
        "options": [
            "0 degrees",
            "7.5 degrees",
            "15 degrees",
            "22.5 degrees"
        ],
        "correct_option_index": 1,
        "explanation": "At 15 minutes, the hour hand has moved (15/60) * 30 degrees = 7.5 degrees past the 3 o'clock mark."
    },
    # Coding Challenges (6-10)
    {
        "question_type": "code",
        "title": "FizzBuzz Pattern Generator",
        "difficulty": "Easy",
        "language": "python",
        "function_name": "fizz_buzz",
        "question_text": "Given an integer `n`, return a string array `answer` (1-indexed) where: `answer[i] == 'FizzBuzz'` if `i` is divisible by 3 and 5; `'Fizz'` if `i` is divisible by 3; `'Buzz'` if `i` is divisible by 5; `str(i)` otherwise.",
        "input_format": "Integer `n`",
        "output_format": "List of strings",
        "constraints": "1 <= n <= 10^4",
        "examples": [
            {"input": "n = 5", "output": "['1', '2', 'Fizz', '4', 'Buzz']", "explanation": "3 is Fizz, 5 is Buzz."}
        ],
        "starter_code": "def fizz_buzz(n):\n    # Write your solution below\n    res = []\n    for i in range(1, n + 1):\n        if i % 15 == 0:\n            res.append('FizzBuzz')\n        elif i % 3 == 0:\n            res.append('Fizz')\n        elif i % 5 == 0:\n            res.append('Buzz')\n        else:\n            res.append(str(i))\n    return res\n",
        "sample_test_cases": [
            {"inputs": [5], "expected": ["1", "2", "Fizz", "4", "Buzz"]},
            {"inputs": [3], "expected": ["1", "2", "Fizz"]}
        ],
        "test_cases": [
            {"inputs": [5], "expected": ["1", "2", "Fizz", "4", "Buzz"]},
            {"inputs": [3], "expected": ["1", "2", "Fizz"]},
            {"inputs": [15], "expected": ["1", "2", "Fizz", "4", "Buzz", "Fizz", "7", "8", "Fizz", "Buzz", "11", "Fizz", "13", "14", "FizzBuzz"]}
        ],
        "explanation": "Iterate 1 to n checking modulo 15, 3, 5."
    },
    {
        "question_type": "code",
        "title": "Roman to Integer Converter",
        "difficulty": "Easy",
        "language": "python",
        "function_name": "roman_to_int",
        "question_text": "Given a Roman numeral string `s`, convert it to an integer. Symbol values: I=1, V=5, X=10, L=50, C=100, D=500, M=1000.",
        "input_format": "String `s`",
        "output_format": "Integer value",
        "constraints": "1 <= len(s) <= 15",
        "examples": [
            {"input": "s = 'LVIII'", "output": "58", "explanation": "L=50, V=5, III=3."}
        ],
        "starter_code": "def roman_to_int(s):\n    # Write your solution below\n    vals = {'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000}\n    total = 0\n    for i in range(len(s)):\n        if i + 1 < len(s) and vals[s[i]] < vals[s[i + 1]]:\n            total -= vals[s[i]]\n        else:\n            total += vals[s[i]]\n    return total\n",
        "sample_test_cases": [
            {"inputs": ["LVIII"], "expected": 58},
            {"inputs": ["MCMXCIV"], "expected": 1994}
        ],
        "test_cases": [
            {"inputs": ["LVIII"], "expected": 58},
            {"inputs": ["MCMXCIV"], "expected": 1994},
            {"inputs": ["III"], "expected": 3},
            {"inputs": ["IV"], "expected": 4}
        ],
        "explanation": "Subtract current symbol value if followed by a larger symbol, else add."
    },
    {
        "question_type": "code",
        "title": "Missing Number in Array",
        "difficulty": "Easy",
        "language": "python",
        "function_name": "missing_number",
        "question_text": "Given an array `nums` containing `n` distinct numbers in the range `[0, n]`, return the only number in the range that is missing from the array.",
        "input_format": "List of integers `nums`",
        "output_format": "Integer missing number",
        "constraints": "n == len(nums)",
        "examples": [
            {"input": "nums = [3, 0, 1]", "output": "2", "explanation": "2 is missing."}
        ],
        "starter_code": "def missing_number(nums):\n    # Write your solution below\n    n = len(nums)\n    expected_sum = n * (n + 1) // 2\n    return expected_sum - sum(nums)\n",
        "sample_test_cases": [
            {"inputs": [[3, 0, 1]], "expected": 2},
            {"inputs": [[0, 1]], "expected": 2}
        ],
        "test_cases": [
            {"inputs": [[3, 0, 1]], "expected": 2},
            {"inputs": [[0, 1]], "expected": 2},
            {"inputs": [[9, 6, 4, 2, 3, 5, 7, 0, 1]], "expected": 8}
        ],
        "explanation": "Use Gauss sum formula n*(n+1)/2 minus actual sum in O(N) time and O(1) space."
    },
    {
        "question_type": "code",
        "title": "Palindrome String Checker",
        "difficulty": "Easy",
        "language": "python",
        "function_name": "is_palindrome",
        "question_text": "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.",
        "input_format": "String `s`",
        "output_format": "Boolean `True` or `False`",
        "constraints": "1 <= len(s) <= 2 * 10^5",
        "examples": [
            {"input": "s = 'A man, a plan, a canal: Panama'", "output": "True", "explanation": "'amanaplanacanalpanama' is a palindrome."}
        ],
        "starter_code": "def is_palindrome(s):\n    # Write your solution below\n    clean = [c.lower() for c in s if c.isalnum()]\n    return clean == clean[::-1]\n",
        "sample_test_cases": [
            {"inputs": ["A man, a plan, a canal: Panama"], "expected": True},
            {"inputs": ["race a car"], "expected": False}
        ],
        "test_cases": [
            {"inputs": ["A man, a plan, a canal: Panama"], "expected": True},
            {"inputs": ["race a car"], "expected": False},
            {"inputs": [" "], "expected": True}
        ],
        "explanation": "Filter alphanumeric characters, lowercase, and compare with reversed slice."
    },
    {
        "question_type": "code",
        "title": "Prime Factors Counter",
        "difficulty": "Medium",
        "language": "python",
        "function_name": "prime_factors",
        "question_text": "Given a positive integer `n` (n >= 2), return a sorted list of its distinct prime factors.",
        "input_format": "Integer `n`",
        "output_format": "Sorted list of integers",
        "constraints": "2 <= n <= 10^7",
        "examples": [
            {"input": "n = 12", "output": "[2, 3]", "explanation": "Prime factors are 2 and 3."}
        ],
        "starter_code": "def prime_factors(n):\n    # Write your solution below\n    factors = set()\n    d = 2\n    while d * d <= n:\n        while n % d == 0:\n            factors.add(d)\n            n //= d\n        d += 1\n    if n > 1:\n        factors.add(n)\n    return sorted(list(factors))\n",
        "sample_test_cases": [
            {"inputs": [12], "expected": [2, 3]},
            {"inputs": [13], "expected": [13]}
        ],
        "test_cases": [
            {"inputs": [12], "expected": [2, 3]},
            {"inputs": [13], "expected": [13]},
            {"inputs": [100], "expected": [2, 5]}
        ],
        "explanation": "Trial division up to sqrt(n) collecting distinct prime divisors."
    }
]

# ==============================================================================
# 7. Python Coding Challenges & Bug Hunting (python-coding-challenges-bug-hunting)
# ==============================================================================
PART2_DATA["python-coding-challenges-bug-hunting"] = [
    # MCQs (1-5)
    {
        "question_type": "mcq",
        "title": "Python Off-by-One Slicing",
        "question_text": "In Python, what is the output of `'developer'[1:5]`?",
        "options": [
            "'deve'",
            "'evel'",
            "'devel'",
            "'eve'"
        ],
        "correct_option_index": 1,
        "explanation": "Python slices are half-open `[start, stop)`: index 1 ('e'), 2 ('v'), 3 ('e'), 4 ('l') -> 'evel'."
    },
    {
        "question_type": "mcq",
        "title": "Float Precision Bug",
        "question_text": "Why does `0.1 + 0.2 == 0.3` evaluate to `False` in Python?",
        "options": [
            "Python does not support floating point numbers",
            "Floating point numbers are represented internally as binary fractions (IEEE 754), resulting in rounding differences",
            "The `+` operator concatenates float objects",
            "Python requires explicit casting with `float()`"
        ],
        "correct_option_index": 1,
        "explanation": "Binary floating-point arithmetic cannot represent numbers like 0.1 exactly, resulting in 0.30000000000000004 != 0.3."
    },
    {
        "question_type": "mcq",
        "title": "Shallow Copy Bug in Nested Lists",
        "question_text": "Given `a = [[1, 2]]` and `b = list(a)`. If you execute `b[0].append(3)`, what is `a`?",
        "options": [
            "`[[1, 2]]`",
            "`[[1, 2, 3]]`",
            "`[[1, 2], [3]]`",
            "Raises an AttributeError"
        ],
        "correct_option_index": 1,
        "explanation": "`list()` creates a shallow copy. The inner list reference is shared, so mutating it modifies `a` as well."
    },
    {
        "question_type": "mcq",
        "title": "Generator Exhaustion",
        "question_text": "What happens when you attempt to iterate over a Python generator a second time?",
        "options": [
            "It automatically restarts iteration from the beginning",
            "It immediately terminates yielding no elements (raises StopIteration)",
            "It throws an unhandled `GeneratorReplayException`",
            "It clears the variable from memory"
        ],
        "correct_option_index": 1,
        "explanation": "Generators are one-time iterators. Once exhausted, subsequent iterations yield nothing."
    },
    {
        "question_type": "mcq",
        "title": "Variable Scope (UnboundLocalError)",
        "question_text": "Why does calling `f()` raise `UnboundLocalError` in: `x = 10; def f(): print(x); x = 20`?",
        "options": [
            "Because `x` was not passed as a function argument",
            "Because the assignment `x = 20` marks `x` as local to the entire function, but `print(x)` executes before the assignment",
            "Because integers are immutable",
            "Because Python does not allow global variables"
        ],
        "correct_option_index": 1,
        "explanation": "Any assignment to a variable within a function marks it as a local variable for the entire scope unless explicitly declared `global`."
    },
    # Coding Challenges (6-10)
    {
        "question_type": "code",
        "title": "Contains Duplicate",
        "difficulty": "Easy",
        "language": "python",
        "function_name": "contains_duplicate",
        "question_text": "Given an integer array `nums`, return `True` if any value appears at least twice in the array, and return `False` if every element is distinct.",
        "input_format": "List of integers `nums`",
        "output_format": "Boolean `True` or `False`",
        "constraints": "1 <= len(nums) <= 10^5",
        "examples": [
            {"input": "nums = [1, 2, 3, 1]", "output": "True", "explanation": "1 appears at index 0 and 3."}
        ],
        "starter_code": "def contains_duplicate(nums):\n    # Write your solution below\n    return len(nums) != len(set(nums))\n",
        "sample_test_cases": [
            {"inputs": [[1, 2, 3, 1]], "expected": True},
            {"inputs": [[1, 2, 3, 4]], "expected": False}
        ],
        "test_cases": [
            {"inputs": [[1, 2, 3, 1]], "expected": True},
            {"inputs": [[1, 2, 3, 4]], "expected": False},
            {"inputs": [[1, 1, 1, 3, 3, 4, 3, 2, 4, 2]], "expected": True}
        ],
        "explanation": "Check if set cardinality differs from array length in O(N) time."
    },
    {
        "question_type": "code",
        "title": "Find First and Last Position in Sorted Array",
        "difficulty": "Medium",
        "language": "python",
        "function_name": "search_range",
        "question_text": "Given an array of integers `nums` sorted in non-decreasing order, find the starting and ending position of a given `target` value. If `target` is not found, return `[-1, -1]`. Runtime must be O(log N).",
        "input_format": "Sorted list `nums` and integer `target`",
        "output_format": "List of two indices `[start, end]`",
        "constraints": "0 <= len(nums) <= 10^5",
        "examples": [
            {"input": "nums = [5, 7, 7, 8, 8, 10], target = 8", "output": "[3, 4]", "explanation": "8 spans index 3 to 4."}
        ],
        "starter_code": "def search_range(nums, target):\n    # Write your solution below\n    def find_bound(is_first):\n        l, r = 0, len(nums) - 1\n        ans = -1\n        while l <= r:\n            mid = (l + r) // 2\n            if nums[mid] == target:\n                ans = mid\n                if is_first:\n                    r = mid - 1\n                else:\n                    l = mid + 1\n            elif nums[mid] < target:\n                l = mid + 1\n            else:\n                r = mid - 1\n        return ans\n    return [find_bound(True), find_bound(False)]\n",
        "sample_test_cases": [
            {"inputs": [[5, 7, 7, 8, 8, 10], 8], "expected": [3, 4]},
            {"inputs": [[5, 7, 7, 8, 8, 10], 6], "expected": [-1, -1]}
        ],
        "test_cases": [
            {"inputs": [[5, 7, 7, 8, 8, 10], 8], "expected": [3, 4]},
            {"inputs": [[5, 7, 7, 8, 8, 10], 6], "expected": [-1, -1]},
            {"inputs": [[1], 1], "expected": [0, 0]}
        ],
        "explanation": "Run two binary searches for the leftmost and rightmost index boundaries."
    },
    {
        "question_type": "code",
        "title": "Group Anagrams",
        "difficulty": "Medium",
        "language": "python",
        "function_name": "group_anagrams",
        "question_text": "Given an array of strings `strs`, group the anagrams together. You can return the answer in any order. For evaluation, return a list of groups where each group is sorted alphabetically, and the outer list is sorted by the first element of each group.",
        "input_format": "List of strings `strs`",
        "output_format": "Sorted 2D list of grouped strings",
        "constraints": "1 <= len(strs) <= 10^4",
        "examples": [
            {"input": "strs = ['eat', 'tea', 'tan', 'ate', 'nat', 'bat']", "output": "[['ate', 'eat', 'tea'], ['bat'], ['nat', 'tan']]", "explanation": "Sorted anagram groups."}
        ],
        "starter_code": "from collections import defaultdict\n\ndef group_anagrams(strs):\n    # Write your solution below\n    groups = defaultdict(list)\n    for s in strs:\n        key = ''.join(sorted(s))\n        groups[key].append(s)\n    res = [sorted(g) for g in groups.values()]\n    return sorted(res, key=lambda x: x[0])\n",
        "sample_test_cases": [
            {"inputs": [["eat", "tea", "tan", "ate", "nat", "bat"]], "expected": [["ate", "eat", "tea"], ["bat"], ["nat", "tan"]]},
            {"inputs": [[""]], "expected": [[""]]}
        ],
        "test_cases": [
            {"inputs": [["eat", "tea", "tan", "ate", "nat", "bat"]], "expected": [["ate", "eat", "tea"], ["bat"], ["nat", "tan"]]},
            {"inputs": [[""]], "expected": [[""]]},
            {"inputs": [["a"]], "expected": [["a"]]}
        ],
        "explanation": "Use sorted string representation as hash map key."
    },
    {
        "question_type": "code",
        "title": "Subarray Sum Equals K",
        "difficulty": "Medium",
        "language": "python",
        "function_name": "subarray_sum",
        "question_text": "Given an array of integers `nums` and an integer `k`, return the total number of subarrays whose sum equals to `k`.",
        "input_format": "List of integers `nums` and integer `k`",
        "output_format": "Integer count of qualifying subarrays",
        "constraints": "1 <= len(nums) <= 2 * 10^4",
        "examples": [
            {"input": "nums = [1, 1, 1], k = 2", "output": "2", "explanation": "[1, 1] at index 0..1 and 1..2."}
        ],
        "starter_code": "from collections import defaultdict\n\ndef subarray_sum(nums, k):\n    # Write your solution below\n    counts = defaultdict(int)\n    counts[0] = 1\n    curr_sum = 0\n    ans = 0\n    for x in nums:\n        curr_sum += x\n        ans += counts[curr_sum - k]\n        counts[curr_sum] += 1\n    return ans\n",
        "sample_test_cases": [
            {"inputs": [[1, 1, 1], 2], "expected": 2},
            {"inputs": [[1, 2, 3], 3], "expected": 2}
        ],
        "test_cases": [
            {"inputs": [[1, 1, 1], 2], "expected": 2},
            {"inputs": [[1, 2, 3], 3], "expected": 2},
            {"inputs": [[1, -1, 0], 0], "expected": 3}
        ],
        "explanation": "Prefix sum hash map counting occurrences of curr_sum - k in O(N) time."
    },
    {
        "question_type": "code",
        "title": "Peak Element Finder",
        "difficulty": "Medium",
        "language": "python",
        "function_name": "find_peak_element",
        "question_text": "A peak element is an element that is strictly greater than its neighbors. Given an integer array `nums`, find a peak element, and return its index.",
        "input_format": "List of integers `nums`",
        "output_format": "Integer index of a peak",
        "constraints": "1 <= len(nums) <= 1000",
        "examples": [
            {"input": "nums = [1, 2, 3, 1]", "output": "2", "explanation": "Index 2 is 3, greater than 2 and 1."}
        ],
        "starter_code": "def find_peak_element(nums):\n    # Write your solution below\n    l, r = 0, len(nums) - 1\n    while l < r:\n        mid = (l + r) // 2\n        if nums[mid] > nums[mid + 1]:\n            r = mid\n        else:\n            l = mid + 1\n    return l\n",
        "sample_test_cases": [
            {"inputs": [[1, 2, 3, 1]], "expected": 2},
            {"inputs": [[1, 2, 1, 3, 5, 6, 4]], "expected": 5}
        ],
        "test_cases": [
            {"inputs": [[1, 2, 3, 1]], "expected": 2},
            {"inputs": [[1]], "expected": 0}
        ],
        "explanation": "Binary search along slope gradient: if nums[mid] > nums[mid+1], peak exists on left half."
    }
]

# ==============================================================================
# 8. Generative AI & LLM Systems Engineering (generative-ai-llm-systems-engineering)
# ==============================================================================
PART2_DATA["generative-ai-llm-systems-engineering"] = [
    # MCQs (1-5)
    {
        "question_type": "mcq",
        "title": "Sampling Temperature",
        "question_text": "What is the mathematical and behavioural effect of setting the sampling `temperature` close to 0 (e.g., 0.0) during LLM text generation?",
        "options": [
            "It forces greedy decoding, always picking the token with highest logit probability and generating deterministic outputs",
            "It injects maximum randomness across the entire vocabulary distribution",
            "It halves the context window memory usage",
            "It disables token safety filters"
        ],
        "correct_option_index": 0,
        "explanation": "Dividing logits by temperature -> 0 sharpens the probability distribution so the top-1 token probability approaches 1 (greedy decoding)."
    },
    {
        "question_type": "mcq",
        "title": "Transformer Attention Complexity",
        "question_text": "Standard Multi-Head Self-Attention scales with sequence length N as:",
        "options": [
            "O(N)",
            "O(N log N)",
            "O(N^2)",
            "O(2^N)"
        ],
        "correct_option_index": 2,
        "explanation": "Computing the full attention matrix between Query and Key tokens (Q * K^T) requires N * N operations, scaling quadratically O(N^2)."
    },
    {
        "question_type": "mcq",
        "title": "Vector Embeddings Cosine Similarity",
        "question_text": "What does a Cosine Similarity score of 1.0 between two dense vector embeddings signify?",
        "options": [
            "The vectors are completely orthogonal (independent semantic meanings)",
            "The vectors point in exactly the same direction in semantic embedding space",
            "The vectors have identical magnitude lengths",
            "The vectors point in diametrically opposite directions"
        ],
        "correct_option_index": 1,
        "explanation": "Cosine similarity measures cos(theta). When theta = 0 degrees (same orientation), cos(0) = 1.0."
    },
    {
        "question_type": "mcq",
        "title": "RAG Chunking Strategy",
        "question_text": "Why is sliding-window chunk overlap (e.g. chunk size 500 tokens with 50-token overlap) critical when indexing documents for Retrieval-Augmented Generation (RAG)?",
        "options": [
            "To double the storage capacity of vector databases",
            "To preserve semantic context across chunk boundary breaks so sentences are not sliced in half",
            "To encrypt document metadata",
            "To enable GPU compilation of text"
        ],
        "correct_option_index": 1,
        "explanation": "Chunk overlap prevents losing crucial context or split sentences that occur directly at chunk splitting boundaries."
    },
    {
        "question_type": "mcq",
        "title": "Top-P (Nucleus) Sampling",
        "question_text": "How does Top-P (nucleus) sampling differ from Top-K sampling?",
        "options": [
            "Top-P dynamically selects the smallest set of tokens whose cumulative probability exceeds P, adapting to distribution shape",
            "Top-P always chooses exactly P tokens regardless of probability",
            "Top-P discards the highest probability token",
            "Top-P requires supervised fine-tuning"
        ],
        "correct_option_index": 0,
        "explanation": "Top-P adapts dynamically to model confidence by collecting tokens until cumulative probability mass reaches threshold P."
    },
    # Coding Challenges (6-10)
    {
        "question_type": "code",
        "title": "Cosine Similarity Vector Engine",
        "difficulty": "Easy",
        "language": "python",
        "function_name": "cosine_similarity",
        "question_text": "Given two 1D vector embeddings `vec_a` and `vec_b`, calculate their cosine similarity: `dot(a, b) / (norm(a) * norm(b))`. Return float rounded to 3 decimal places. If norm is 0, return 0.0.",
        "input_format": "Lists of floats `vec_a` and `vec_b`",
        "output_format": "Float rounded to 3 decimals",
        "constraints": "len(vec_a) == len(vec_b) >= 1",
        "examples": [
            {"input": "vec_a = [1, 2], vec_b = [2, 4]", "output": "1.0", "explanation": "Collinear vectors produce similarity 1.0."}
        ],
        "starter_code": "import math\n\ndef cosine_similarity(vec_a, vec_b):\n    # Write your solution below\n    dot = sum(a * b for a, b in zip(vec_a, vec_b))\n    norm_a = math.sqrt(sum(a * a for a in vec_a))\n    norm_b = math.sqrt(sum(b * b for b in vec_b))\n    if norm_a == 0 or norm_b == 0:\n        return 0.0\n    return round(dot / (norm_a * norm_b), 3)\n",
        "sample_test_cases": [
            {"inputs": [[1, 2], [2, 4]], "expected": 1.0},
            {"inputs": [[1, 0], [0, 1]], "expected": 0.0}
        ],
        "test_cases": [
            {"inputs": [[1, 2], [2, 4]], "expected": 1.0},
            {"inputs": [[1, 0], [0, 1]], "expected": 0.0},
            {"inputs": [[1, 2, 3], [4, 5, 6]], "expected": 0.975}
        ],
        "explanation": "Compute dot product divided by product of L2 norms."
    },
    {
        "question_type": "code",
        "title": "Text Chunker with Sliding Overlap",
        "difficulty": "Medium",
        "language": "python",
        "function_name": "chunk_words",
        "question_text": "Given a string `text`, split it into words and return a list of text chunks. Each chunk contains at most `chunk_size` words, with `overlap` words carried over to the next chunk. Words are joined by a single space.",
        "input_format": "String `text`, integers `chunk_size` and `overlap`",
        "output_format": "List of chunk strings",
        "constraints": "chunk_size > overlap >= 0",
        "examples": [
            {"input": "text = 'one two three four five', chunk_size = 3, overlap = 1", "output": "['one two three', 'three four five']", "explanation": "'three' overlaps into chunk 2."}
        ],
        "starter_code": "def chunk_words(text, chunk_size, overlap):\n    # Write your solution below\n    words = text.split()\n    if not words:\n        return []\n    step = chunk_size - overlap\n    chunks = []\n    for i in range(0, len(words), step):\n        ch = words[i:i + chunk_size]\n        if ch:\n            chunks.append(' '.join(ch))\n        if i + chunk_size >= len(words):\n            break\n    return chunks\n",
        "sample_test_cases": [
            {"inputs": ["one two three four five", 3, 1], "expected": ["one two three", "three four five"]},
            {"inputs": ["a b c d", 2, 0], "expected": ["a b", "c d"]}
        ],
        "test_cases": [
            {"inputs": ["one two three four five", 3, 1], "expected": ["one two three", "three four five"]},
            {"inputs": ["a b c d", 2, 0], "expected": ["a b", "c d"]},
            {"inputs": ["hello", 5, 1], "expected": ["hello"]}
        ],
        "explanation": "Step through word tokens with increment `chunk_size - overlap`."
    },
    {
        "question_type": "code",
        "title": "Softmax Logit Normalizer",
        "difficulty": "Easy",
        "language": "python",
        "function_name": "softmax",
        "question_text": "Given a list of model raw logits, compute their softmax probabilities: `exp(x_i) / sum(exp(x_j))`. For numerical stability, subtract `max(logits)` from each logit before exponentiating. Return list of floats rounded to 3 decimal places.",
        "input_format": "List of floats or ints `logits`",
        "output_format": "List of probability floats rounded to 3 decimals",
        "constraints": "1 <= len(logits) <= 100",
        "examples": [
            {"input": "logits = [2.0, 1.0, 0.1]", "output": "[0.659, 0.242, 0.099]", "explanation": "Exponentiated and normalized sum to 1.0."}
        ],
        "starter_code": "import math\n\ndef softmax(logits):\n    # Write your solution below\n    mx = max(logits)\n    exps = [math.exp(x - mx) for x in logits]\n    total = sum(exps)\n    return [round(e / total, 3) for e in exps]\n",
        "sample_test_cases": [
            {"inputs": [[2.0, 1.0, 0.1]], "expected": [0.659, 0.242, 0.099]},
            {"inputs": [[0.0, 0.0]], "expected": [0.5, 0.5]}
        ],
        "test_cases": [
            {"inputs": [[2.0, 1.0, 0.1]], "expected": [0.659, 0.242, 0.099]},
            {"inputs": [[0.0, 0.0]], "expected": [0.5, 0.5]},
            {"inputs": [[10.0]], "expected": [1.0]}
        ],
        "explanation": "Subtract max for numerical stability, exponentiate and normalize."
    },
    {
        "question_type": "code",
        "title": "Top-K Logit Filter",
        "difficulty": "Medium",
        "language": "python",
        "function_name": "top_k_indices",
        "question_text": "Given a list of logits and an integer `k`, return the indices of the top `k` largest logits sorted in descending order of their logit value.",
        "input_format": "List of numbers `logits` and integer `k`",
        "output_format": "List of `k` integer indices",
        "constraints": "1 <= k <= len(logits)",
        "examples": [
            {"input": "logits = [0.1, 0.9, 0.4, 0.8], k = 2", "output": "[1, 3]", "explanation": "0.9 (idx 1) and 0.8 (idx 3) are top 2."}
        ],
        "starter_code": "def top_k_indices(logits, k):\n    # Write your solution below\n    indexed = list(enumerate(logits))\n    indexed.sort(key=lambda x: x[1], reverse=True)\n    return [idx for idx, val in indexed[:k]]\n",
        "sample_test_cases": [
            {"inputs": [[0.1, 0.9, 0.4, 0.8], 2], "expected": [1, 3]},
            {"inputs": [[5.0, 10.0, 2.0], 1], "expected": [1]}
        ],
        "test_cases": [
            {"inputs": [[0.1, 0.9, 0.4, 0.8], 2], "expected": [1, 3]},
            {"inputs": [[5.0, 10.0, 2.0], 1], "expected": [1]},
            {"inputs": [[1, 2, 3], 3], "expected": [2, 1, 0]}
        ],
        "explanation": "Sort enumerated pairs by value descending and slice first k."
    },
    {
        "question_type": "code",
        "title": "Simple Text Tokenizer",
        "difficulty": "Easy",
        "language": "python",
        "function_name": "tokenize",
        "question_text": "Given a string `prompt`, convert it into lowercase tokens. Separate on whitespace and punctuation marks `.,!?`. Return list of non-empty token strings.",
        "input_format": "String `prompt`",
        "output_format": "List of token strings",
        "constraints": "1 <= len(prompt) <= 10^4",
        "examples": [
            {"input": "prompt = 'Translate: Hello, world!'", "output": "['translate', 'hello', 'world']", "explanation": "Punctuation stripped and lowercased."}
        ],
        "starter_code": "import re\n\ndef tokenize(prompt):\n    # Write your solution below\n    tokens = re.findall(r'[a-zA-Z0-9]+', prompt.lower())\n    return tokens\n",
        "sample_test_cases": [
            {"inputs": ["Translate: Hello, world!"], "expected": ["translate", "hello", "world"]},
            {"inputs": ["AI 2.0 is here."], "expected": ["ai", "2", "0", "is", "here"]}
        ],
        "test_cases": [
            {"inputs": ["Translate: Hello, world!"], "expected": ["translate", "hello", "world"]},
            {"inputs": ["AI 2.0 is here."], "expected": ["ai", "2", "0", "is", "here"]},
            {"inputs": ["!!!"], "expected": []}
        ],
        "explanation": "Extract alphanumeric words using regex."
    }
]

# ==============================================================================
# 9. Cloud Infrastructure & Docker Mastery (cloud-infrastructure-docker-mastery)
# ==============================================================================
PART2_DATA["cloud-infrastructure-docker-mastery"] = [
    # MCQs (1-5)
    {
        "question_type": "mcq",
        "title": "Docker Layer Caching",
        "question_text": "Why should instructions that change infrequently (like `COPY package.json` and `RUN npm install`) appear before `COPY . .` in a Dockerfile?",
        "options": [
            "Because Docker ignores changes to package.json",
            "To leverage Docker's build cache so dependencies are not reinstalled on every application source code change",
            "Because npm commands must be first in any container",
            "To reduce image security vulnerabilities"
        ],
        "correct_option_index": 1,
        "explanation": "Docker invalidates cache layers from the first modified instruction downwards. Copying lockfiles first preserves the expensive dependency install cache."
    },
    {
        "question_type": "mcq",
        "title": "Kubernetes Pod vs Deployment",
        "question_text": "What is the key benefit of managing workloads via a Kubernetes `Deployment` rather than bare `Pods`?",
        "options": [
            "Pods cannot attach to networks",
            "Deployments provide declarative updates, rolling deployments, automatic pod replication, and self-healing",
            "Deployments compile containers into microVMs",
            "Pods require root administrator privileges on the host"
        ],
        "correct_option_index": 1,
        "explanation": "A Deployment controller ensures a specified number of Pod replicas remain running, automatically replacing failed pods and orchestrating zero-downtime rollouts."
    },
    {
        "question_type": "mcq",
        "title": "CIDR Subnet Math",
        "question_text": "How many total IP addresses are contained in a `/24` IPv4 CIDR block (e.g. `192.168.1.0/24`)?",
        "options": [
            "128",
            "256",
            "512",
            "1024"
        ],
        "correct_option_index": 1,
        "explanation": "A /24 block leaves 32 - 24 = 8 host bits: 2^8 = 256 total IP addresses (with 254 usable for hosts in standard networking)."
    },
    {
        "question_type": "mcq",
        "title": "Blue-Green Deployment",
        "question_text": "What is the primary operational architecture of a Blue-Green deployment strategy?",
        "options": [
            "Incrementally replacing 10% of servers at a time over several days",
            "Maintaining two identical production environments (Blue and Green), deploying the new version to Green, and instantly switching router traffic over",
            "Testing software exclusively in production without staging",
            "Running frontend on Blue servers and backend on Green servers"
        ],
        "correct_option_index": 1,
        "explanation": "Blue-Green keeps two identical production stacks, flipping router traffic to the new stack instantly with zero downtime and trivial rollback."
    },
    {
        "question_type": "mcq",
        "title": "Terraform State Locking",
        "question_text": "Why is remote state locking (e.g. with AWS DynamoDB or Terraform Cloud) required when running Terraform in a team?",
        "options": [
            "To compress the state file",
            "To prevent concurrent runs from corrupting the infrastructure state file with conflicting resource changes",
            "To automatically format HCL code",
            "To generate cloud provider billing reports"
        ],
        "correct_option_index": 1,
        "explanation": "State locking prevents multiple engineers or CI pipelines from modifying state concurrently, preventing corruption and race conditions."
    },
    # Coding Challenges (6-10)
    {
        "question_type": "code",
        "title": "Docker Image Tag Parser",
        "difficulty": "Easy",
        "language": "python",
        "function_name": "parse_image_tag",
        "question_text": "Given a full Docker image reference string `img_str` (e.g. `ghcr.io/org/app:v1.2` or `nginx`), parse it into a dictionary `{'registry': ..., 'repository': ..., 'tag': ...}`. If no registry is present, registry is `'docker.io'`. If no tag is present, tag defaults to `'latest'`.",
        "input_format": "String `img_str`",
        "output_format": "Dictionary with keys `registry`, `repository`, `tag`",
        "constraints": "Valid image naming string.",
        "examples": [
            {"input": "img_str = 'nginx:1.21'", "output": "{'registry': 'docker.io', 'repository': 'nginx', 'tag': '1.21'}", "explanation": "Default registry with explicit tag."}
        ],
        "starter_code": "def parse_image_tag(img_str):\n    # Write your solution below\n    tag = 'latest'\n    if ':' in img_str.split('/')[-1]:\n        parts = img_str.rsplit(':', 1)\n        img_str = parts[0]\n        tag = parts[1]\n    \n    slash_parts = img_str.split('/')\n    if len(slash_parts) > 1 and ('.' in slash_parts[0] or ':' in slash_parts[0] or slash_parts[0] == 'localhost'):\n        registry = slash_parts[0]\n        repo = '/'.join(slash_parts[1:])\n    else:\n        registry = 'docker.io'\n        repo = img_str\n        \n    return {'registry': registry, 'repository': repo, 'tag': tag}\n",
        "sample_test_cases": [
            {"inputs": ["nginx:1.21"], "expected": {"registry": "docker.io", "repository": "nginx", "tag": "1.21"}},
            {"inputs": ["ghcr.io/org/backend"], "expected": {"registry": "ghcr.io", "repository": "org/backend", "tag": "latest"}}
        ],
        "test_cases": [
            {"inputs": ["nginx:1.21"], "expected": {"registry": "docker.io", "repository": "nginx", "tag": "1.21"}},
            {"inputs": ["ghcr.io/org/backend"], "expected": {"registry": "ghcr.io", "repository": "org/backend", "tag": "latest"}},
            {"inputs": ["redis"], "expected": {"registry": "docker.io", "repository": "redis", "tag": "latest"}}
        ],
        "explanation": "Split tag at last colon after repo, check for registry domain in first component."
    },
    {
        "question_type": "code",
        "title": "IPv4 CIDR Validator",
        "difficulty": "Easy",
        "language": "python",
        "function_name": "is_valid_cidr",
        "question_text": "Given a string `cidr`, return `True` if it is a valid IPv4 CIDR block (e.g. `192.168.1.0/24`) and `False` otherwise. An IPv4 CIDR has 4 octets (0-255) separated by dots, followed by a slash and prefix length (0-32).",
        "input_format": "String `cidr`",
        "output_format": "Boolean `True` or `False`",
        "constraints": "1 <= len(cidr) <= 25",
        "examples": [
            {"input": "cidr = '10.0.0.0/16'", "output": "True", "explanation": "Valid prefix and octets."},
            {"input": "cidr = '10.0.0.256/24'", "output": "False", "explanation": "256 exceeds valid octet."}
        ],
        "starter_code": "def is_valid_cidr(cidr):\n    # Write your solution below\n    if '/' not in cidr:\n        return False\n    parts = cidr.split('/')\n    if len(parts) != 2:\n        return False\n    ip_str, mask_str = parts\n    if not mask_str.isdigit():\n        return False\n    mask = int(mask_str)\n    if not (0 <= mask <= 32):\n        return False\n    octets = ip_str.split('.')\n    if len(octets) != 4:\n        return False\n    for octet in octets:\n        if not octet.isdigit() or not (0 <= int(octet) <= 255):\n            return False\n        if len(octet) > 1 and octet.startswith('0'):\n            return False\n    return True\n",
        "sample_test_cases": [
            {"inputs": ["10.0.0.0/16"], "expected": True},
            {"inputs": ["10.0.0.256/24"], "expected": False}
        ],
        "test_cases": [
            {"inputs": ["10.0.0.0/16"], "expected": True},
            {"inputs": ["10.0.0.256/24"], "expected": False},
            {"inputs": ["192.168.1.1/33"], "expected": False},
            {"inputs": ["invalid"], "expected": False}
        ],
        "explanation": "Verify exactly 4 octets in 0..255 and prefix mask in 0..32."
    },
    {
        "question_type": "code",
        "title": "Service Health Aggregator",
        "difficulty": "Medium",
        "language": "python",
        "function_name": "aggregate_health",
        "question_text": "Given a list of microservice health check dictionaries `[{'service': 'auth', 'status': 'up', 'latency_ms': 45}, ...]`, return a summary dictionary: `{'healthy_count': int, 'unhealthy_count': int, 'avg_latency_ms': float}` (avg_latency rounded to 1 decimal across all services). A service is healthy only if `status == 'up'`.",
        "input_format": "List of service status dicts",
        "output_format": "Summary dictionary",
        "constraints": "At least 1 service provided.",
        "examples": [
            {"input": "services = [{'service': 'api', 'status': 'up', 'latency_ms': 50}, {'service': 'db', 'status': 'down', 'latency_ms': 150}]", "output": "{'healthy_count': 1, 'unhealthy_count': 1, 'avg_latency_ms': 100.0}", "explanation": "1 up, 1 down, average latency 100.0."}
        ],
        "starter_code": "def aggregate_health(services):\n    # Write your solution below\n    healthy = sum(1 for s in services if s.get('status') == 'up')\n    unhealthy = len(services) - healthy\n    latencies = [s.get('latency_ms', 0) for s in services]\n    avg_lat = round(sum(latencies) / len(latencies), 1) if latencies else 0.0\n    return {'healthy_count': healthy, 'unhealthy_count': unhealthy, 'avg_latency_ms': avg_lat}\n",
        "sample_test_cases": [
            {"inputs": [[{"service": "api", "status": "up", "latency_ms": 50}, {"service": "db", "status": "down", "latency_ms": 150}]], "expected": {"healthy_count": 1, "unhealthy_count": 1, "avg_latency_ms": 100.0}},
            {"inputs": [[{"service": "web", "status": "up", "latency_ms": 20}]], "expected": {"healthy_count": 1, "unhealthy_count": 0, "avg_latency_ms": 20.0}}
        ],
        "test_cases": [
            {"inputs": [[{"service": "api", "status": "up", "latency_ms": 50}, {"service": "db", "status": "down", "latency_ms": 150}]], "expected": {"healthy_count": 1, "unhealthy_count": 1, "avg_latency_ms": 100.0}},
            {"inputs": [[{"service": "web", "status": "up", "latency_ms": 20}]], "expected": {"healthy_count": 1, "unhealthy_count": 0, "avg_latency_ms": 20.0}}
        ],
        "explanation": "Iterate services counting status and computing average latency."
    },
    {
        "question_type": "code",
        "title": "Unflatten Flat Configuration Dict",
        "difficulty": "Medium",
        "language": "python",
        "function_name": "unflatten_config",
        "question_text": "Given a flattened dictionary where keys represent nested paths with dot notation (e.g. `{'server.port': 8080, 'server.host': '0.0.0.0', 'env': 'prod'}`), convert it into a nested dictionary structure.",
        "input_format": "Dictionary `flat_dict`",
        "output_format": "Nested dictionary",
        "constraints": "Keys are non-empty strings.",
        "examples": [
            {"input": "flat = {'app.name': 'Nexora', 'app.version': 1}", "output": "{'app': {'name': 'Nexora', 'version': 1}}", "explanation": "Nested under 'app'."}
        ],
        "starter_code": "def unflatten_config(flat_dict):\n    # Write your solution below\n    nested = {}\n    for key, value in flat_dict.items():\n        parts = key.split('.')\n        curr = nested\n        for p in parts[:-1]:\n            if p not in curr:\n                curr[p] = {}\n            curr = curr[p]\n        curr[parts[-1]] = value\n    return nested\n",
        "sample_test_cases": [
            {"inputs": [{"app.name": "Nexora", "app.version": 1}], "expected": {"app": {"name": "Nexora", "version": 1}}},
            {"inputs": [{"port": 3000}], "expected": {"port": 3000}}
        ],
        "test_cases": [
            {"inputs": [{"app.name": "Nexora", "app.version": 1}], "expected": {"app": {"name": "Nexora", "version": 1}}},
            {"inputs": [{"port": 3000}], "expected": {"port": 3000}},
            {"inputs": [{"a.b.c": 42}], "expected": {"a": {"b": {"c": 42}}}}
        ],
        "explanation": "Split key on dot and traverse/instantiate nested dictionaries."
    },
    {
        "question_type": "code",
        "title": "Cron Minute Expression Parser",
        "difficulty": "Easy",
        "language": "python",
        "function_name": "parse_cron_minutes",
        "question_text": "Given a cron minute field string (0-59), return a sorted list of matching integer minutes. It supports: `*` (every minute 0..59), single integers (e.g. `'15'`), commas (e.g. `'5,10'`), and step values (e.g. `'*/15'` -> `[0, 15, 30, 45]`).",
        "input_format": "String `expr`",
        "output_format": "Sorted list of integer minutes",
        "constraints": "Valid cron minute syntax.",
        "examples": [
            {"input": "expr = '*/20'", "output": "[0, 20, 40]", "explanation": "0, 20, 40 are <= 59."}
        ],
        "starter_code": "def parse_cron_minutes(expr):\n    # Write your solution below\n    if expr == '*':\n        return list(range(60))\n    if expr.startswith('*/'):\n        step = int(expr[2:])\n        return list(range(0, 60, step))\n    if ',' in expr:\n        return sorted([int(x) for x in expr.split(',')])\n    return [int(expr)]\n",
        "sample_test_cases": [
            {"inputs": ["*/20"], "expected": [0, 20, 40]},
            {"inputs": ["5,10"], "expected": [5, 10]}
        ],
        "test_cases": [
            {"inputs": ["*/20"], "expected": [0, 20, 40]},
            {"inputs": ["5,10"], "expected": [5, 10]},
            {"inputs": ["30"], "expected": [30]}
        ],
        "explanation": "Evaluate wildcard, step, list, or scalar minute intervals."
    }
]
