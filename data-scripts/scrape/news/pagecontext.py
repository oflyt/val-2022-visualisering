from typing import Tuple, Union

from playwright.sync_api import Page, expect, sync_playwright, Locator, Playwright, Browser


def extend_playwright_with_custom_methods(timeout: int):
    def safe_locate(self: Union[Page, Locator], *args, **kwargs) -> Locator:
        found_element = self.locator(*args, **kwargs)
        found_element.is_visible(timeout=timeout)
        return found_element

    def safe_locate_many(self: Union[Page, Locator], *args, **kwargs) -> Locator:
        found_element = self.locator(*args, **kwargs)
        found_element.first.is_visible(timeout=timeout)
        return found_element

    setattr(Page, 'safe_locate', safe_locate)
    setattr(Page, 'safe_locate_many', safe_locate_many)
    setattr(Locator, 'safe_locate', safe_locate)
    setattr(Locator, 'safe_locate_many', safe_locate_many)


class PageContextManager:

    def __enter__(self, timeout: int = 10, **launch_kwargs) -> Page:
        # TODO: fix possibility to run headful through docker container
        self.playwright = sync_playwright().start()
        self.browser = self.playwright.firefox.launch(headless=False, slow_mo=50)
        self.page = self.browser.new_page()
        extend_playwright_with_custom_methods(timeout)
        return self.page

    def __exit__(self, exc_type, exc_value, exc_tb):
        self.page.close()
        self.browser.close()
        self.playwright.stop()
