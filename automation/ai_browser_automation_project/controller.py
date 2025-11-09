import asyncio, json, logging
from playwright.async_api import async_playwright
from llm_client import ask_plan
from tools import PlaywrightTools
from validator import validate_plan
from state_manager import init_db, save_checkpoint

logging.basicConfig(level=logging.INFO)

async def main():
    await init_db()
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        ctx = await browser.new_context()
        tools = PlaywrightTools(ctx)

        state = {"tabs": {}, "goal": "Collect top 5 Hacker News titles and check related stock tickers."}

        r1 = await tools.open_tab("https://news.ycombinator.com", "hn")
        r2 = await tools.open_tab("https://finance.yahoo.com", "yf")
        state["tabs"] = {"hn": r1, "yf": r2}

        await save_checkpoint("initial", state)

        plan_json = ask_plan(state, "Plan steps to extract headlines from hn and find mentions of stock tickers on finance.yahoo")
        ok, validated = validate_plan(plan_json)
        if not ok:
            logging.error("Plan validation failed: %s", validated)
            await browser.close()
            return

        for action in validated.actions:
            fn = action.fn
            args = action.args
            try:
                if fn == "extract_text":
                    out = await tools.extract_text(args["tab_id"], args["selector"])
                elif fn == "switch_tab":
                    out = await tools.switch_tab(args["tab_id"])
                elif fn == "open_tab":
                    out = await tools.open_tab(args["url"], args.get("tab_id"))
                elif fn == "snapshot":
                    out = await tools.snapshot(args["tab_id"])
                else:
                    out = {"error": "unknown fn"}
                logging.info("Action result: %s", out)
                state["last_action"] = {"fn": fn, "args": args, "result": out}
                await save_checkpoint("post-action", state)
            except Exception as e:
                logging.exception("Action failed: %s", e)
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
