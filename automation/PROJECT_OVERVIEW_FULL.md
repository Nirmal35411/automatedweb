# ⚙️ WEB AUTOMATION FRAMEWORK — COMPLETE SYSTEM BLUEPRINT

**Author:** Nirmal Bajiya  
**Date:** November 2025  
**Environment:** Windows 10+, Python 3.13, PowerShell  
**Framework:** Playwright + YAML Config + Rich Console + (optional) Ollama AI Backend  
**Project Directory:** `C:\Users\nirma\Desktop\web automation\automation`

---

## 📁 PROJECT STRUCTURE

```
automation/
├── core/
│ └── config_autogen.py          # Interactive YAML task generator
│
├── config/
│ └── config.yaml                # Master automation configuration (tasks list)
│
├── outputs/                     # Auto-generated JSON files with extracted data
│
├── controller.py                # Main automation controller
│
└── README.md / PROJECT_OVERVIEW_FULL.md
```

---

## 🧭 HIGH-LEVEL OVERVIEW

This system is a **config-driven, AI-ready web automation framework**.

It uses:
- **Playwright** → to control Chromium browser programmatically
- **YAML (config.yaml)** → to describe automation tasks declaratively
- **Python (asyncio)** → for asynchronous task execution
- **Rich Console** → for structured, colorized logs and progress visualization
- **Optional LLM (Ollama / Mistral)** → for AI reasoning or summarization

The design ensures **no API keys, no subscriptions, no cloud cost**, and full **local execution** capability.

---

## 🔍 COMPONENT DETAILS

### 1️⃣ `core/config_autogen.py` — Interactive Task Builder

#### Purpose:
Creates or updates automation tasks inside `config/config.yaml` safely.  
Avoids manual YAML edits and human error.

#### How it works:
When run, it asks:

```
Task name:
URL to open:
CSS selector:
```

It then appends a structured entry to the YAML configuration.

#### Example Workflow:
```powershell
python core/config_autogen.py

Result in config/config.yaml:
tasks:
  - name: test
    steps:
      - action: open_tab
        url: "https://example.com"
      - action: extract_data
        selector: "h1"
      - action: save_state
```

#### Internal Logic:
```python
def add_task(name, url, selector):
    with open(CONFIG_PATH) as f:
        cfg = yaml.safe_load(f)
    new_task = {
        "name": name,
        "steps": [
            {"action": "open_tab", "url": url},
            {"action": "extract_data", "selector": selector},
            {"action": "save_state"}
        ]
    }
    cfg.setdefault("tasks", []).append(new_task)
    with open(CONFIG_PATH, "w") as f:
        yaml.safe_dump(cfg, f)
```

---

### 2️⃣ `config/config.yaml` — Task Definition File

#### Purpose:
Acts as the declarative control center of the automation.

#### Structure:
Each task has a name and an ordered list of steps.

#### Example:
```yaml
tasks:
  - name: test
    steps:
      - action: open_tab
        url: "https://example.com"
      - action: extract_data
        selector: "h1"
      - action: save_state
```

#### Supported Actions:

| Action | Description |
|--------|-------------|
| `open_tab` | Opens a browser tab at specified URL |
| `extract_data` | Extracts text using a CSS selector |
| `save_state` | Saves all extracted data to /outputs/ as JSON |
| `query_llm` | (future) Send extracted text to AI for reasoning/summarization |

---

### 3️⃣ `controller.py` — Automation Execution Engine

#### Purpose:
Executes each YAML-defined task asynchronously using Playwright.

#### Process Flow:
1. Loads all tasks from `config/config.yaml`
2. Opens Chromium browser
3. Sequentially performs defined steps:
   - Opens URL
   - Extracts elements via CSS selectors
   - Saves data in `/outputs/`
4. Displays detailed, colorized logs in terminal
5. Closes browser session cleanly

#### Key Code Flow:
```python
async with async_playwright() as p:
    browser = await p.chromium.launch(headless=False)
    for task in tasks:
        await run_task(task, browser)
    await browser.close()
```

#### Typical Output (Rich Console):
```
────────────────────────────── Running Task: test ──────────────────────────────
🌐 Opening: https://example.com
🔍 Extracting data from selector: h1
✅ Extracted: Example Domain
💾 Saved output → outputs/test_20251109_153300.json
✔ Task complete: test
```

---

### 4️⃣ `/outputs/` — Data Repository

#### Purpose:
Stores every automation run result as a timestamped JSON file.  
Each file contains extracted data keyed by CSS selectors.

#### Example:
```
Filename: outputs/test_20251109_153300.json
Content:
{
  "h1": "Example Domain"
}
```

---

## 🧠 (Optional) AI INTEGRATION — LLM-Aware Automation

**LLM Options:** Ollama (local), Perplexity Pro, OpenAI GPT-4o, Claude, or Gemini.

Once integrated, the automation can:
- Summarize extracted data
- Classify content
- Generate insights automatically
- Plan next actions intelligently

#### Example Future YAML Extension:
```yaml
  - name: summarize_page
    steps:
      - action: open_tab
        url: "https://example.com"
      - action: extract_data
        selector: "p"
      - action: query_llm
        model: "mistral"
        prompt: "Summarize the extracted paragraph."
      - action: save_state
```

---

## 🧮 SOFTWARE DEPENDENCIES

| Library | Purpose |
|---------|---------|
| `playwright` | Controls Chromium browser |
| `pyyaml` | Parses YAML configuration files |
| `rich` | Pretty console output and colored logs |
| `asyncio` | Handles asynchronous execution |
| `json` | Writes extracted data |
| `datetime` | Creates unique timestamps for results |
| `ollama` (optional) | Enables local LLM integration |
| `chromium` | Headless browser used by Playwright |

---

## ⚙️ INSTALLATION & SETUP (WINDOWS)

Run these commands in PowerShell:

```powershell
# 1️⃣ Navigate to your folder
cd "C:\Users\nirma\Desktop\web automation\automation"

# 2️⃣ Install dependencies
pip install playwright pyyaml rich
python -m playwright install chromium

# 3️⃣ Initialize YAML config
mkdir config
echo tasks: [] > config\config.yaml

# 4️⃣ Create your first task
python core/config_autogen.py

# 5️⃣ Run automation
python controller.py
```

---

## 🧾 WORKFLOW SUMMARY

| Step | Command | Description | Output |
|------|---------|-------------|--------|
| 1 | `python core/config_autogen.py` | Add new automation task | Updates config.yaml |
| 2 | `python controller.py` | Execute automation | Runs browser automation |
| 3 | Open `/outputs/` | Review results | Extracted data in JSON |
| 4 | (optional) | Integrate AI | Summarize or analyze data |

---

## 🛡 ROBUSTNESS AND SAFETY LAYERS

| Layer | Safety Feature | Error Handling |
|-------|---|---|
| **Config** | Schema-checked YAML; invalid fields ignored | Skips faulty entries |
| **Controller** | Try/Except around every async step | Logs failures without stopping |
| **Outputs** | Timestamped filenames | Prevents overwrite conflicts |
| **Browser** | Auto-closed via context manager | No hanging sessions |
| **AI Layer** (future) | Sandboxed execution | Graceful failure fallback |

---

## 🧩 TECHNICAL DESIGN PRINCIPLES

- **Declarative Architecture:** Tasks are defined, not coded — YAML acts as the control layer
- **Atomic Execution:** Each task is independent; failures don't cascade
- **Full Local Autonomy:** No external APIs or billing required
- **Extensible Design:** New actions can be added via Python function mapping
- **Transparent Debugging:** All steps and failures are logged in real time

---

## 💡 POSSIBLE FUTURE EXTENSIONS

| Feature | Description |
|---------|-------------|
| **LLM Integration** | Add local (Ollama) or cloud (Perplexity/GPT) intelligence |
| **Streamlit Dashboard** | Web GUI for managing tasks visually |
| **Error Replay Engine** | Re-run failed steps automatically |
| **Task Chaining** | Pass data between multiple tasks |
| **Database Logging** | Save results to SQLite/PostgreSQL |
| **Scheduling** | Run periodically (via cron or Task Scheduler) |

---

## 🧰 DEBUGGING GUIDE

| Problem | Possible Cause | Fix |
|---------|---|---|
| `FileNotFoundError: config.yaml` | Config folder missing | `mkdir config && echo tasks: [] > config\config.yaml` |
| Protocol error (Page.navigate) | Wrong URL format | Ensure URL starts with `https://` |
| No Output Saved | Missing `save_state` step | Add it in `config.yaml` |
| Browser Not Launching | Playwright not installed properly | Re-run `python -m playwright install chromium` |

---

## 🧠 INTERACTION INTERFACE

You interact primarily via:

- **PowerShell terminal:** For running automation commands (`python controller.py`) and creating new tasks (`python core/config_autogen.py`)
- **VS Code (optional):** For inspecting logs, JSON outputs, and editing YAML configs

---

## 🧩 BROWSER ENGINE

**Default:** Chromium (installed automatically via Playwright)

**Alternative:** You can enable firefox or webkit by changing this line in `controller.py`:

```python
browser = await p.chromium.launch(headless=False)
```

Replace with:
```python
browser = await p.firefox.launch(headless=False)
```

---

## 🚀 TL;DR SUMMARY

- This system is a **config-driven, Playwright-based web automation framework** with AI-ready architecture
- It allows users to define automation tasks **declaratively in YAML**, execute them through a robust async controller, and store structured outputs **locally**
- It is **100% local, zero-cost, modular, and extensible** for AI integration

---

## 🏁 QUICK COMMAND CHEATSHEET

```powershell
# Create new automation task
python core/config_autogen.py

# Run automation
python controller.py

# View results
start outputs

# Edit config manually (optional)
notepad config\config.yaml
```

---

**End of File — PROJECT_OVERVIEW_FULL.md**