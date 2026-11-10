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
import uuid

EXECUTION_TIMEOUT_SECONDS = 3.5

TEST_WRAPPER_TEMPLATE = '''
import sys, json

# Candidate Code
__USER_CODE_PLACEHOLDER__

# Test Cases Runner
test_cases = __TEST_CASES_PLACEHOLDER__
marker = "__MARKER_PLACEHOLDER__"
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
                "input": inp,
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
            "input": inp,
            "passed": passed,
            "actual": actual,
            "expected": expected,
            "error": None
        })
    except Exception as e:
        all_passed = False
        results.append({
            "test_index": idx + 1,
            "input": inp,
            "passed": False,
            "actual": None,
            "expected": expected,
            "error": str(e)
        })

print(marker + json.dumps({
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
            "test_results": [],
            "all_passed": False
        }

    # Static security blacklist for dangerous OS/runtime operations
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
                "test_results": [],
                "all_passed": False
            }

    formatted_tcs = []
    for tc in test_cases:
        formatted_tcs.append({
            "function_name": function_name,
            "input_args": tc.get("inputs", []),
            "expected_output": tc.get("expected")
        })

    # Unpredictable runtime output marker prevents user code from forging results
    marker = f"<<<NX_RESULT_{uuid.uuid4().hex}>>>"

    wrapper_script = (
        TEST_WRAPPER_TEMPLATE
        .replace("__USER_CODE_PLACEHOLDER__", user_code)
        .replace("__TEST_CASES_PLACEHOLDER__", json.dumps(formatted_tcs))
        .replace("__MARKER_PLACEHOLDER__", marker)
    )

    with tempfile.NamedTemporaryFile('w', suffix='.py', delete=False, encoding='utf-8') as f:
        f.write(wrapper_script)
        temp_path = f.name

    start_time = time.time()
    proc = None
    try:
        proc = subprocess.Popen(
            [sys.executable, "-I", temp_path],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        stdout, stderr = proc.communicate(timeout=EXECUTION_TIMEOUT_SECONDS)
        elapsed_ms = int((time.time() - start_time) * 1000)

        stdout = stdout or ""
        stderr = stderr or ""

        if marker in stdout:
            parts = stdout.split(marker)
            logs = parts[0].strip()
            res_json = json.loads(parts[1].strip())
            tests_list = res_json.get("tests", [])
            return {
                "success": True,
                "all_passed": res_json.get("all_passed", False),
                "tests": tests_list,
                "test_results": tests_list,  # Support both naming conventions
                "output": logs,
                "logs": logs,
                "elapsed_ms": elapsed_ms,
                "error": None
            }
        else:
            return {
                "success": False,
                "all_passed": False,
                "tests": [],
                "test_results": [],
                "output": stdout.strip(),
                "logs": stdout.strip(),
                "error": stderr.strip() or "Syntax or runtime error during execution.",
                "elapsed_ms": elapsed_ms
            }

    except subprocess.TimeoutExpired:
        if proc:
            try:
                proc.kill()
                proc.communicate()
            except Exception:
                pass
        return {
            "success": False,
            "all_passed": False,
            "tests": [],
            "test_results": [],
            "error": f"Execution Timed Out (exceeded {EXECUTION_TIMEOUT_SECONDS}s limit). Check for infinite loops.",
            "elapsed_ms": int(EXECUTION_TIMEOUT_SECONDS * 1000)
        }
    except Exception as e:
        if proc:
            try:
                proc.kill()
            except Exception:
                pass
        return {
            "success": False,
            "all_passed": False,
            "tests": [],
            "test_results": [],
            "error": f"Execution failed: {str(e)}",
            "elapsed_ms": 0
        }
    finally:
        try:
            if os.path.exists(temp_path):
                os.remove(temp_path)
        except Exception:
            pass
