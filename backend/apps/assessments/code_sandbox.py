"""
Secure Multi-Language Code Execution Sandbox for Nexora Assessments.
Supports:
1. Python (isolated subprocess with python -I, dynamic UUID marker, timeout)
2. JavaScript (isolated subprocess with node.exe, dynamic UUID marker, timeout)
3. SQL (isolated in-memory SQLite sandbox with schema initialization and read-only query assertion)
"""

import sys
import subprocess
import tempfile
import time
import os
import json
import uuid
import re
import sqlite3

EXECUTION_TIMEOUT_SECONDS = 3.5

# ---------------------------------------------------------------------------
# Python Sandbox Template
# ---------------------------------------------------------------------------
PYTHON_WRAPPER_TEMPLATE = '''
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

# ---------------------------------------------------------------------------
# JavaScript Sandbox Template
# ---------------------------------------------------------------------------
JS_WRAPPER_TEMPLATE = '''
const marker = "__MARKER_PLACEHOLDER__";
const testCases = __TEST_CASES_PLACEHOLDER__;
let allPassed = true;
const results = [];

// Candidate Code
__USER_CODE_PLACEHOLDER__

for (let idx = 0; idx < testCases.length; idx++) {
    const tc = testCases[idx];
    const inp = tc.input_args || [];
    const expected = tc.expected_output;
    const fnName = tc.function_name || 'solution';

    try {
        let fn;
        try {
            fn = eval(fnName);
        } catch (e) {
            fn = undefined;
        }

        if (typeof fn !== 'function') {
            results.push({
                test_index: idx + 1,
                input: inp,
                passed: false,
                error: `Function '${fnName}' is not defined.`,
                actual: null,
                expected: expected
            });
            allPassed = false;
            continue;
        }

        const argsClone = JSON.parse(JSON.stringify(inp));
        const actual = fn(...argsClone);

        const isMatch = (actual === expected) || (JSON.stringify(actual) === JSON.stringify(expected));
        if (!isMatch) {
            allPassed = false;
        }

        results.push({
            test_index: idx + 1,
            input: inp,
            passed: Boolean(isMatch),
            actual: actual !== undefined ? actual : null,
            expected: expected,
            error: null
        });
    } catch (err) {
        allPassed = false;
        results.push({
            test_index: idx + 1,
            input: inp,
            passed: false,
            actual: null,
            expected: expected,
            error: (err && err.message) ? err.message : String(err)
        });
    }
}

console.log(marker + JSON.stringify({
    all_passed: allPassed,
    tests: results
}));
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
            "all_passed": False,
            "elapsed_ms": 0
        }

    # Static security blacklist
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
                "all_passed": False,
                "elapsed_ms": 0
            }

    formatted_tcs = []
    for tc in test_cases:
        raw_inp = tc.get("inputs")
        if raw_inp is None:
            raw_inp = tc.get("input", [])
        if not isinstance(raw_inp, list):
            raw_inp = [raw_inp] if raw_inp is not None else []
        formatted_tcs.append({
            "function_name": function_name,
            "input_args": raw_inp,
            "expected_output": tc.get("expected")
        })

    marker = f"<<<NX_RESULT_{uuid.uuid4().hex}>>>"

    wrapper_script = (
        PYTHON_WRAPPER_TEMPLATE
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
                "test_results": tests_list,
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

def execute_javascript_code(user_code: str, test_cases: list, function_name: str = "solution") -> dict:
    """
    Executes JavaScript code in a Node.js isolated environment against test cases.
    """
    if not user_code or not user_code.strip():
        return {
            "success": False,
            "error": "No code provided.",
            "tests": [],
            "test_results": [],
            "all_passed": False,
            "elapsed_ms": 0
        }

    # Static JS blacklist
    js_hazards = [
        "child_process", "require('fs')", "require(\"fs\")", "process.exit",
        "process.env", "require('http')", "require('net')", "require('os')",
        "require('cluster')", "global.process"
    ]
    for hazard in js_hazards:
        if hazard in user_code:
            return {
                "success": False,
                "error": f"Security restriction: '{hazard}' is not permitted in sandbox evaluations.",
                "tests": [],
                "test_results": [],
                "all_passed": False,
                "elapsed_ms": 0
            }

    formatted_tcs = []
    for tc in test_cases:
        raw_inp = tc.get("inputs")
        if raw_inp is None:
            raw_inp = tc.get("input", [])
        if not isinstance(raw_inp, list):
            raw_inp = [raw_inp] if raw_inp is not None else []
        formatted_tcs.append({
            "function_name": function_name,
            "input_args": raw_inp,
            "expected_output": tc.get("expected")
        })

    marker = f"<<<NX_NODE_RESULT_{uuid.uuid4().hex}>>>"

    wrapper_script = (
        JS_WRAPPER_TEMPLATE
        .replace("__USER_CODE_PLACEHOLDER__", user_code)
        .replace("__TEST_CASES_PLACEHOLDER__", json.dumps(formatted_tcs))
        .replace("__MARKER_PLACEHOLDER__", marker)
    )

    with tempfile.NamedTemporaryFile('w', suffix='.js', delete=False, encoding='utf-8') as f:
        f.write(wrapper_script)
        temp_path = f.name

    start_time = time.time()
    proc = None
    try:
        proc = subprocess.Popen(
            ["node", temp_path],
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
                "test_results": tests_list,
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
                "error": stderr.strip() or "JavaScript runtime or syntax error.",
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
            "error": f"Execution Timed Out (exceeded {EXECUTION_TIMEOUT_SECONDS}s limit).",
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
            "error": f"Node execution failed: {str(e)}",
            "elapsed_ms": 0
        }
    finally:
        try:
            if os.path.exists(temp_path):
                os.remove(temp_path)
        except Exception:
            pass

def execute_sql_code(user_code: str, test_cases: list) -> dict:
    """
    Executes candidate SQL query against an in-memory SQLite sandbox.
    Asserts result sets against expected rows/columns.
    """
    if not user_code or not user_code.strip():
        return {
            "success": False,
            "error": "No SQL query provided.",
            "tests": [],
            "test_results": [],
            "all_passed": False,
            "elapsed_ms": 0
        }

    # Strip single-line comments (-- ...) and multi-line comments (/* ... */)
    cleaned = re.sub(r'--.*?(\r?\n|$)', ' ', user_code)
    cleaned = re.sub(r'/\*.*?\*/', ' ', cleaned, flags=re.DOTALL)
    clean_query = cleaned.strip().rstrip(';')

    if not clean_query:
        return {
            "success": False,
            "error": "Query contains no executable statements.",
            "tests": [],
            "test_results": [],
            "all_passed": False,
            "elapsed_ms": 0
        }

    upper_query = clean_query.upper().strip()
    if not (upper_query.startswith("SELECT") or upper_query.startswith("WITH")):
        return {
            "success": False,
            "error": "Security restriction: Only read-only queries starting with SELECT or WITH are permitted.",
            "tests": [],
            "test_results": [],
            "all_passed": False,
            "elapsed_ms": 0
        }

    disallowed_keywords = ["DROP", "DELETE", "UPDATE", "INSERT", "ALTER", "ATTACH", "DETACH", "PRAGMA", "VACUUM", "REINDEX"]
    for kw in disallowed_keywords:
        if re.search(r'\b' + kw + r'\b', upper_query):
            return {
                "success": False,
                "error": f"Security restriction: '{kw}' statement is not permitted in SQL challenges.",
                "tests": [],
                "test_results": [],
                "all_passed": False,
                "elapsed_ms": 0
            }

    start_time = time.time()
    results = []
    all_passed = True

    for idx, tc in enumerate(test_cases):
        schema_sql = tc.get("schema", "")
        expected = tc.get("expected", [])
        inp = tc.get("inputs", ["Default database state"])

        conn = None
        try:
            conn = sqlite3.connect(":memory:")
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()

            if schema_sql:
                cursor.executescript(schema_sql)

            cursor.execute(clean_query)
            fetched_rows = cursor.fetchall()

            # Normalize actual rows to list of dicts with lowercase keys
            actual_dicts = []
            actual_values = []
            for r in fetched_rows:
                d = {k.lower(): r[k] for k in r.keys()}
                actual_dicts.append(d)
                actual_values.append(list(r))

            # Normalize expected for comparison
            # expected can be list of dicts or list of lists/tuples or single values
            is_match = False

            if isinstance(expected, list):
                if len(expected) == 0 and len(fetched_rows) == 0:
                    is_match = True
                elif len(expected) > 0 and isinstance(expected[0], dict):
                    normalized_exp = [{k.lower(): v for k, v in exp_d.items()} for exp_d in expected]
                    is_match = (actual_dicts == normalized_exp)
                elif len(expected) > 0 and isinstance(expected[0], (list, tuple)):
                    is_match = (actual_values == [list(e) for e in expected])
                else:
                    # Single column list of values
                    single_col_actual = [r[0] for r in actual_values] if actual_values else []
                    is_match = (single_col_actual == expected) or (actual_values == expected)
            elif expected is not None:
                # single value scalar
                first_val = actual_values[0][0] if (actual_values and actual_values[0]) else None
                is_match = (first_val == expected)

            if not is_match:
                all_passed = False

            results.append({
                "test_index": idx + 1,
                "input": inp,
                "passed": is_match,
                "actual": actual_dicts if actual_dicts else actual_values,
                "expected": expected,
                "error": None
            })

        except sqlite3.Error as e:
            all_passed = False
            results.append({
                "test_index": idx + 1,
                "input": inp,
                "passed": False,
                "actual": None,
                "expected": expected,
                "error": f"SQL Error: {str(e)}"
            })
        except Exception as e:
            all_passed = False
            results.append({
                "test_index": idx + 1,
                "input": inp,
                "passed": False,
                "actual": None,
                "expected": expected,
                "error": f"Evaluation Exception: {str(e)}"
            })
        finally:
            if conn:
                try:
                    conn.close()
                except Exception:
                    pass

    elapsed_ms = int((time.time() - start_time) * 1000)

    return {
        "success": True,
        "all_passed": all_passed,
        "tests": results,
        "test_results": results,
        "output": f"Executed against {len(test_cases)} SQLite scenarios.",
        "logs": "",
        "elapsed_ms": elapsed_ms,
        "error": None
    }

def format_java_arg(arg):
    if arg is None:
        return "null"
    if isinstance(arg, bool):
        return "true" if arg else "false"
    if isinstance(arg, int):
        return str(arg)
    if isinstance(arg, float):
        return f"{arg}d"
    if isinstance(arg, str):
        clean = arg.replace('\\', '\\\\').replace('"', '\\"').replace('\n', '\\n')
        return f'"{clean}"'
    if isinstance(arg, list):
        if len(arg) == 0:
            return "new int[]{}"
        if all(isinstance(x, int) for x in arg):
            return f"new int[]{{{', '.join(str(x) for x in arg)}}}"
        if all(isinstance(x, str) for x in arg):
            return f"new String[]{{{', '.join(json.dumps(x) for x in arg)}}}"
    return json.dumps(arg)

def execute_java_code(user_code: str, test_cases: list, function_name: str = "solution") -> dict:
    """
    Executes Java user code in an isolated JDK 17 sandbox against test cases using Judge0.
    """
    import urllib.request
    
    if not user_code or not user_code.strip():
        return {
            "success": False,
            "error": "No Java code provided.",
            "tests": [],
            "test_results": [],
            "all_passed": False,
            "elapsed_ms": 0
        }

    # Clean user code: if they declare public class Solution, strip 'public ' so it compiles alongside public class Main
    clean_code = re.sub(r'\bpublic\s+class\s+', 'class ', user_code)

    # Wrap in class Solution if no class definition present
    if "class Solution" not in clean_code and "class " not in clean_code:
        clean_code = f"class Solution {{\n{clean_code}\n}}"

    class_match = re.search(r'\bclass\s+([A-Za-z0-9_]+)', clean_code)
    target_class = class_match.group(1) if class_match else "Solution"

    marker = f"NX_JAVA_RES_{uuid.uuid4().hex[:8]}"

    runner_body = []
    for idx, tc in enumerate(test_cases):
        raw_inp = tc.get("inputs")
        if raw_inp is None:
            raw_inp = tc.get("input", [])
        inp_args = raw_inp if isinstance(raw_inp, list) else [raw_inp] if raw_inp is not None else []
        expected = tc.get("expected")
        java_args = ", ".join(format_java_arg(a) for a in inp_args)
        expected_repr = format_java_arg(expected)
        t_idx = idx + 1

        runner_body.append(f"""
        try {{
            {target_class} _inst = new {target_class}();
            Object actualObj = _inst.{function_name}({java_args});
            Object expectedObj = {expected_repr};
            String actualStr = actualObj != null && actualObj.getClass().isArray() ? 
                (actualObj instanceof int[] ? Arrays.toString((int[]) actualObj) : Arrays.deepToString((Object[]) actualObj)) : 
                String.valueOf(actualObj);
            String expectedStr = expectedObj != null && expectedObj.getClass().isArray() ? 
                (expectedObj instanceof int[] ? Arrays.toString((int[]) expectedObj) : Arrays.deepToString((Object[]) expectedObj)) : 
                String.valueOf(expectedObj);
            
            boolean passed = false;
            if (actualObj instanceof int[] && expectedObj instanceof int[]) {{
                passed = Arrays.equals((int[]) actualObj, (int[]) expectedObj);
            }} else if (actualObj instanceof Object[] && expectedObj instanceof Object[]) {{
                passed = Arrays.deepEquals((Object[]) actualObj, (Object[]) expectedObj);
            }} else {{
                passed = Objects.equals(actualStr, expectedStr);
            }}
            if (!passed) allPassed = false;
            testsList.add(String.format("{{\\"test_index\\": %d, \\"passed\\": %b, \\"actual\\": %s, \\"expected\\": %s, \\"error\\": null}}", 
                {t_idx}, passed, escapeJson(actualStr), escapeJson(expectedStr)));
        }} catch (Throwable t) {{
            allPassed = false;
            String errMsg = t.getClass().getSimpleName() + ": " + (t.getMessage() != null ? t.getMessage() : "Exception");
            testsList.add(String.format("{{\\"test_index\\": %d, \\"passed\\": false, \\"actual\\": null, \\"expected\\": %s, \\"error\\": %s}}",
                {t_idx}, escapeJson(String.valueOf({expected_repr})), escapeJson(errMsg)));
        }}
        """)

    full_source = f"""
import java.util.*;
import java.io.*;

{clean_code}

public class Main {{
    private static String escapeJson(String s) {{
        if (s == null) return "null";
        return "\\"" + s.replace("\\\\", "\\\\\\\\").replace("\\"", "\\\\\\"").replace("\\n", "\\\\n") + "\\"";
    }}

    public static void main(String[] args) {{
        String marker = "{marker}";
        boolean allPassed = true;
        List<String> testsList = new ArrayList<>();

        {''.join(runner_body)}

        StringBuilder sb = new StringBuilder();
        sb.append(marker);
        sb.append("{{\\"all_passed\\": ").append(allPassed).append(", \\"tests\\": [");
        for (int i = 0; i < testsList.size(); i++) {{
            if (i > 0) sb.append(", ");
            sb.append(testsList.get(i));
        }}
        sb.append("]}}");
        System.out.println(sb.toString());
    }}
}}
"""

    payload = {
        'language_id': 91, # Java (JDK 17.0.6)
        'source_code': full_source,
        'stdin': ''
    }

    start_time = time.time()
    try:
        req = urllib.request.Request(
            'https://ce.judge0.com/submissions?base64_encoded=false&wait=true',
            data=json.dumps(payload).encode('utf-8'),
            headers={'Content-Type': 'application/json', 'User-Agent': 'NexoraApp/1.0'}
        )
        with urllib.request.urlopen(req, timeout=15) as resp:
            exec_res = json.loads(resp.read().decode())

        elapsed_ms = int((time.time() - start_time) * 1000)
        stdout = exec_res.get('stdout') or ''
        stderr = exec_res.get('stderr') or ''
        compile_output = exec_res.get('compile_output') or ''
        status_info = exec_res.get('status', {})

        if compile_output:
            return {
                "success": False,
                "all_passed": False,
                "tests": [],
                "test_results": [],
                "error": f"Java Compilation Error:\n{compile_output.strip()}",
                "elapsed_ms": elapsed_ms
            }

        if marker in stdout:
            parts = stdout.split(marker)
            logs = parts[0].strip()
            res_json = json.loads(parts[1].strip())
            tests = res_json.get("tests", [])
            return {
                "success": True,
                "all_passed": res_json.get("all_passed", False),
                "tests": tests,
                "test_results": tests,
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
                "error": stderr.strip() or stdout.strip() or f"Execution failed: {status_info.get('description', 'Unknown error')}",
                "elapsed_ms": elapsed_ms
            }

    except Exception as e:
        return {
            "success": False,
            "all_passed": False,
            "tests": [],
            "test_results": [],
            "error": f"Java sandbox error: {str(e)}",
            "elapsed_ms": int((time.time() - start_time) * 1000)
        }

def execute_code(language: str, user_code: str, test_cases: list, function_name: str = "solution") -> dict:
    """
    Unified execution dispatcher supporting Python, Java, JavaScript, and SQL.
    """
    lang = (language or "python").lower().strip()
    if lang in ["java"]:
        return execute_java_code(user_code, test_cases, function_name)
    elif lang in ["javascript", "js", "node"]:
        return execute_javascript_code(user_code, test_cases, function_name)
    elif lang in ["sql", "sqlite", "sqlite3"]:
        return execute_sql_code(user_code, test_cases)
    else:
        # Default Python (covers python, py, dsa, data_science, ml, etc.)
        return execute_python_code(user_code, test_cases, function_name)
