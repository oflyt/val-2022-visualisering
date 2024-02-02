# TODO: port

from selenium.common import TimeoutException
from selenium.webdriver.common.by import By

from app import webdriver
from app.politics.timeutils import to_datetime, to_datetime_sd


class Locators:
    @staticmethod
    def cookie_decline():
        return {"by": By.XPATH, "value": './/a[contains(text(), "Tillåt endast nödvändiga")]'}

    @staticmethod
    def news_feed():
        return {"by": By.XPATH, "value": './/div[contains(@class, "archive")]'}

    @staticmethod
    def news_items():
        return {"by": By.XPATH, "value": './/div[contains(@class, "archive__item") and contains(@class, "clickable-area")]'}

    @staticmethod
    def href():
        return {"by": By.XPATH, "value": './/a'}

    @staticmethod
    def title():
        return {"by": By.XPATH, "value": './/a'}

    @staticmethod
    def date():
        return {"by": By.XPATH, "value": './/span[contains(@class, "meta__date")]'}


def main():
    driver = webdriver.initiate_selenium_driver(timeout=30)
    driver.get("https://sd.se/nyheter/")
    driver.safe_find_element(**Locators.cookie_decline()).safe_click(driver)
    news_items = driver \
        .safe_find_element(**Locators.news_feed()) \
        .safe_find_children(driver, **Locators.news_items())
    for news_item in news_items:
        try:
            info = {
                "url": news_item.safe_find_child(driver, **Locators.href()).get_attribute('href'),
                "title": news_item.safe_find_child(driver, **Locators.title()).text,
                "description": "",
                "date": to_datetime_sd(news_item.safe_find_child(driver, **Locators.date()).text),
            }
            print(info)
        except TimeoutException as e:
            print(news_item.get_attribute('innerHTML'))
            raise e


if __name__ == '__main__':
    main()
