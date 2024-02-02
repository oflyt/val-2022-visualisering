# TODO: port

from selenium.common import TimeoutException
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

from app import webdriver
from app.politics.timeutils import to_datetime_m


class Locators:
    @staticmethod
    def news_feed():
        return {"by": By.XPATH, "value": './/div[contains(@class, "site-main__current--articles")]/ul'}

    @staticmethod
    def news_items():
        return {"by": By.XPATH, "value": './li'}

    @staticmethod
    def href():
        return {"by": By.XPATH, "value": './/h2/a'}

    @staticmethod
    def title():
        return {"by": By.XPATH, "value": './/h2/a'}

    @staticmethod
    def description():
        return {"by": By.XPATH, "value": './/span[contains(@class, "excerpt_part")]'}

    @staticmethod
    def date():
        return {"by": By.XPATH, "value": './/div[contains(@class, "article-info")]/p'}


def main():
    def options_override(options: Options):
        options.add_argument("--window-size=1920,1080")
        options.add_argument("--headless")
        options.add_argument("--disable-gpu")
        options.add_argument(
            "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36")

    driver = webdriver.initiate_selenium_driver(timeout=30, options_override=options_override)
    driver.get("https://moderaterna.se/nyheter/")
    news_items = driver \
        .safe_find_element(**Locators.news_feed()) \
        .safe_find_children(driver, **Locators.news_items())
    for news_item in news_items:
        try:
            info = {
                "url": news_item.safe_find_child(driver, **Locators.href()).get_attribute('href'),
                "title": news_item.safe_find_child(driver, **Locators.title()).text,
                "description": news_item.safe_find_child(driver, **Locators.description()).text,
                "date": to_datetime_m(news_item.safe_find_child(driver, **Locators.date()).text),
            }
            print(info)
        except TimeoutException as e:
            print(news_item.get_attribute('innerHTML'))
            raise e


if __name__ == '__main__':
    main()
