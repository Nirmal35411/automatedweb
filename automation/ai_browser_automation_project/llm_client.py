import subprocess, json, os

# Full path to Ollama executable on your system
OLLAMA_EXE = r"C:\Users\nirma\AppData\Local\Programs\Ollama\ollama.exe"
OLLAMA_MODEL = "mistral"

def run_local_llm(prompt: str, timeout: int = 60) -> str:
    """Run Ollama with full path and return its output."""
    if not os.path.exists(OLLAMA_EXE):
        raise FileNotFoundError(f"Ollama not found at {OLLAMA_EXE}. Please check the path.")
    
    cmd = [OLLAMA_EXE, "run", OLLAMA_MODEL, "--no-stream"]
    proc = subprocess.run(cmd, input=prompt.encode(), capture_output=True, timeout=timeout)
    out = proc.stdout.decode(errors="ignore").strip()
    
    if not out:
        err = proc.stderr.decode(errors="ignore").strip()
        raise RuntimeError(f"LLM returned empty. stderr: {err}")
    return out

def ask_plan(state, instruction: str):
    """Send state + instruction to the LLM and parse JSON response."""
    payload = {
        "state": state,
        "instruction": instruction,
        "schema": {
            "type": "object",
            "properties": {
                "actions": {"type": "array"},
                "confidence": {"type": "number"}
            }
        },
        "response_format": "json"
    }
    prompt = f"You are an automation planner. Input JSON: {json.dumps(payload)}. Return valid JSON output only."
    raw = run_local_llm(prompt)

    try:
        parsed = json.loads(raw)
    except Exception:
        start = raw.find('{')
        end = raw.rfind('}') + 1
        parsed = json.loads(raw[start:end])
    return parsed
