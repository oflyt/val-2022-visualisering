# TODO: port


from selenium.webdriver.common.by import By

from app import webdriver
from app.politics.timeutils import to_datetime


class Locators:
    @staticmethod
    def news_feed():
        return {"by": By.XPATH, "value": './/ol[contains(@class, "sap-search__result")]'}

    @staticmethod
    def news_items():
        return {"by": By.XPATH, "value": './/li[contains(@class, "sap-search__result-item")]'}

    @staticmethod
    def href():
        return {"by": By.XPATH, "value": './/a'}

    @staticmethod
    def title():
        return {"by": By.XPATH, "value": './/a'}

    @staticmethod
    def description():
        return {"by": By.XPATH, "value": './/p[contains(@class, "normal")]'}

    @staticmethod
    def date():
        return {"by": By.XPATH, "value": './/div[contains(@class, "sap-search__meta")]/span[2]'}


def main():
    driver = webdriver.initiate_selenium_driver(timeout=30)
    driver.get("https://www.socialdemokraterna.se/nyheter")
    news_items = driver \
        .safe_find_element(**Locators.news_feed()) \
        .safe_find_children(driver, **Locators.news_items())
    for news_item in news_items:
        info = {
            "url": news_item.safe_find_child(driver, **Locators.href()).get_attribute('href'),
            "title": news_item.safe_find_child(driver, **Locators.title()).text,
            "description": news_item.safe_find_child(driver, **Locators.description()).text,
            "date": to_datetime(news_item.safe_find_child(driver, **Locators.date()).text),
        }
        print(info)


if __name__ == '__main__':
    main()
