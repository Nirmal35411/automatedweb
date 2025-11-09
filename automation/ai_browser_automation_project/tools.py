from playwright.async_api import Page
class PlaywrightTools:
    def __init__(self, context):
        self.context = context
        self.pages = {}

    async def open_tab(self, url: str, tab_id: str = None):
        page = await self.context.new_page()
        await page.goto(url, wait_until="networkidle")
        tid = tab_id or f"tab-{len(self.pages)+1}"
        self.pages[tid] = page
        return {"tab_id": tid, "url": page.url}

    async def switch_tab(self, tab_id: str):
        page = self.pages.get(tab_id)
        if page is None:
            raise ValueError("Unknown tab")
        return {"tab_id": tab_id, "url": page.url}

    async def extract_text(self, tab_id: str, selector: str, limit: int = 5):
        page = self.pages.get(tab_id)
        if not page:
            raise ValueError("Unknown tab")
        els = await page.locator(selector).all_inner_texts()
        return {"tab_id": tab_id, "selector": selector, "texts": els[:limit]}

    async def snapshot(self, tab_id: str):
        page = self.pages.get(tab_id)
        html = await page.content()
        url = page.url
        return {"tab_id": tab_id, "url": url, "html_head": html[:5000]}
