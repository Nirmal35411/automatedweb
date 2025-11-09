import asyncio, yaml, os, json
from playwright.async_api import async_playwright
from datetime import datetime
from rich.console import Console

console = Console()
CONFIG_PATH = 'config/config.yaml'
OUTPUT_DIR = 'outputs'

os.makedirs(OUTPUT_DIR, exist_ok=True)

async def run_task(task, browser):
    console.rule(f"[bold cyan]Running Task: {task.get('name')}")
    page = await browser.new_page()

    extracted_data = {}
    try:
        for step in task.get('steps', []):
            action = step.get('action')

            if action == 'open_tab':
                url = step.get('url')
                console.print(f'🌐 Opening: {url}')
                await page.goto(url)

            elif action == 'extract_data':
                selector = step.get('selector')
                console.print(f'🔍 Extracting data from selector: {selector}')
                try:
                    element = await page.query_selector(selector)
                    text = await element.inner_text() if element else None
                    extracted_data[selector] = text
                    console.print(f'[green]✅ Extracted:[/green] {text[:80] if text else None}')
                except Exception as e:
                    console.print(f'[red]❌ Extraction failed:[/red] {e}')

            elif action == 'save_state':
                timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
                out_path = os.path.join(OUTPUT_DIR, f"{task.get('name')}_{timestamp}.json")
                with open(out_path, 'w', encoding='utf-8') as f:
                    json.dump(extracted_data, f, indent=2, ensure_ascii=False)
                console.print(f'[blue]💾 Saved output →[/blue] {out_path}')

        console.print(f"[bold green]✔ Task complete: {task.get('name')}[/bold green]")
    except Exception as e:
        console.print(f"[bold red]Task failed:[/bold red] {e}")
    finally:
        await page.close()

async def main():
    with open(CONFIG_PATH, 'r', encoding='utf-8') as f:
        cfg = yaml.safe_load(f)
    tasks = cfg.get('tasks', [])
    if not tasks:
        console.print('[yellow]⚠ No tasks found in config.yaml[/yellow]')
        return

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        for task in tasks:
            await run_task(task, browser)
        await browser.close()

if __name__ == '__main__':
    asyncio.run(main())
