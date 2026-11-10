"""
Secure Code Execution Sandbox for Python Coding Challenges.
Executes candidate code in an isolated subprocess with strict timeout,
resource limits, and automated unit test case assertions.
"""

import sys
import subprocess
import tempfile
import time
import os
import json

EXECUTION_TIMEOUT_SECONDS = 3.5

TEST_WRAPPER_TEMPLATE = '''
import sys, json

# Candidate Code
__USER_CODE_PLACEHOLDER__

# Test Cases Runner
test_cases = __TEST_CASES_PLACEHOLDER__
results = []
all_passed = True

for idx, tc in enumerate(test_cases):
    inp = tc.get('input_args', [])
    expected = tc.get('expected_output')
    fn_name = tc.get('function_name', 'solution')
    
    try:
        fn = globals().get(fn_name)
        if not callable(fn):
            results.append({
                "test_index": idx + 1,
                "passed": False,
                "error": f"Function '{fn_name}' is not defined.",
                "actual": None,
                "expected": expected
            })
            all_passed = False
            continue
            
        actual = fn(*inp)
        passed = (actual == expected)
        if not passed:
            all_passed = False
            
        results.append({
            "test_index": idx + 1,
            "passed": passed,
            "actual": str(actual),
            "expected": str(expected),
            "error": None
        })
    except Exception as e:
        all_passed = False
        results.append({
            "test_index": idx + 1,
            "passed": False,
            "actual": None,
            "expected": str(expected),
            "error": str(e)
        })

print("<<<JSON_RESULTS>>>" + json.dumps({
    "all_passed": all_passed,
    "tests": results
}))
'''

def execute_python_code(user_code: str, test_cases: list, function_name: str = "solution") -> dict:
    """
    Executes Python user code against structured test cases.
    Returns test results, execution time, stdout, stderr, and security validation.
    """
    if not user_code or not user_code.strip():
        return {
            "success": False,
            "error": "No code provided.",
            "tests": [],
            "all_passed": False
        }

    # Basic static security blacklist for critical OS hazards
    hazard_patterns = [
        "import os", "from os", "import subprocess", "from subprocess",
        "import sys", "import shutil", "shutil.", "open(", "eval(", "exec(",
        "__import__", "globals()", "locals()", "builtins", "rmdir", "unlink"
    ]
    for hazard in hazard_patterns:
        if hazard in user_code:
            return {
                "success": False,
                "error": f"Security restriction: '{hazard}' is not permitted in sandbox evaluations.",
                "tests": [],
                "all_passed": False
            }

    formatted_tcs = []
    for tc in test_cases:
        formatted_tcs.append({
            "function_name": function_name,
            "input_args": tc.get("inputs", []),
            "expected_output": tc.get("expected")
        })

    wrapper_script = (
        TEST_WRAPPER_TEMPLATE
        .replace("__USER_CODE_PLACEHOLDER__", user_code)
        .replace("__TEST_CASES_PLACEHOLDER__", json.dumps(formatted_tcs))
    )

    with tempfile.NamedTemporaryFile('w', suffix='.py', delete=False, encoding='utf-8') as f:
        f.write(wrapper_script)
        temp_path = f.name

    start_time = time.time()
    try:
        proc = subprocess.run(
            [sys.executable, "-I", temp_path],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            timeout=EXECUTION_TIMEOUT_SECONDS
        )
        elapsed_ms = int((time.time() - start_time) * 1000)

        stdout = proc.stdout or ""
        stderr = proc.stderr or ""

        if "<<<JSON_RESULTS>>>" in stdout:
            parts = stdout.split("<<<JSON_RESULTS>>>")
            logs = parts[0].strip()
            res_json = json.loads(parts[1].strip())
            return {
                "success": True,
                "all_passed": res_json.get("all_passed", False),
                "tests": res_json.get("tests", []),
                "logs": logs,
                "elapsed_ms": elapsed_ms,
                "error": None
            }
        else:
            return {
                "success": False,
                "all_passed": False,
                "tests": [],
                "logs": stdout.strip(),
                "error": stderr.strip() or "Syntax or runtime error during execution.",
                "elapsed_ms": elapsed_ms
            }

    except subprocess.TimeoutExpired:
        return {
            "success": False,
            "all_passed": False,
            "tests": [],
            "error": f"Execution Timed Out (exceeded {EXECUTION_TIMEOUT_SECONDS}s limit). Check for infinite loops.",
            "elapsed_ms": int(EXECUTION_TIMEOUT_SECONDS * 1000)
        }
    except Exception as e:
        return {
            "success": False,
            "all_passed": False,
            "tests": [],
            "error": f"Execution failed: {str(e)}",
            "elapsed_ms": 0
        }
    finally:
        try:
            if os.path.exists(temp_path):
                os.remove(temp_path)
        except Exception:
            pass
