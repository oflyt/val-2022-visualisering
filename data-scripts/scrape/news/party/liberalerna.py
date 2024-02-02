# TODO: port

from selenium.common import TimeoutException
from selenium.webdriver.common.by import By

from app import webdriver
from app.politics.timeutils import to_datetime


class Locators:
    @staticmethod
    def news_feed():
        return {"by": By.XPATH, "value": './/div[contains(@class, "artclArchive-list")]'}

    @staticmethod
    def news_items():
        return {"by": By.XPATH, "value": './/article'}

    @staticmethod
    def href():
        return {"by": By.XPATH, "value": './/a'}

    @staticmethod
    def title():
        return {"by": By.XPATH, "value": './/h3[contains(@class, "artclCard-title")]/a'}

    @staticmethod
    def description():
        return {"by": By.XPATH, "value": './/p[contains(@class, "artclCard-excerpt")]'}

    @staticmethod
    def date():
        return {"by": By.XPATH, "value": './/div[contains(@class, "artclCard-date")]'}


def main():
    driver = webdriver.initiate_selenium_driver(timeout=30)
    driver.get("https://www.liberalerna.se/nyheter")
    news_items = driver \
        .safe_find_element(**Locators.news_feed()) \
        .safe_find_children(driver, **Locators.news_items())
    for news_item in news_items:
        try:
            info = {
                "url": news_item.safe_find_child(driver, **Locators.href()).get_attribute('href'),
                "title": news_item.safe_find_child(driver, **Locators.title()).text,
                "description": news_item.safe_find_child(driver, **Locators.description()).text,
                "date": to_datetime(news_item.safe_find_child(driver, **Locators.date()).text),
            }
            print(info)
        except TimeoutException as e:
            print(news_item.get_attribute('innerHTML'))
            raise e


if __name__ == '__main__':
    main()
