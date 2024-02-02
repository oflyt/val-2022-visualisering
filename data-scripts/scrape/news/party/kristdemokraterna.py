# TODO: port

import time

from selenium.common import TimeoutException
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

from app import webdriver
from app.politics.timeutils import to_datetime, to_datetime_sd, to_datetime_m, to_datetime_kd


class Locators:
    @staticmethod
    def news_feed():
        return {"by": By.XPATH, "value": './/ul[descendant::li[descendant::article]]'}

    @staticmethod
    def news_items():
        return {"by": By.XPATH, "value": './li'}

    @staticmethod
    def href():
        return {"by": By.XPATH, "value": './/a'}

    @staticmethod
    def title():
        return {"by": By.XPATH, "value": './/a'}

    @staticmethod
    def description():
        return {"by": By.XPATH, "value": './/p'}

    @staticmethod
    def datetime():
        return {"by": By.XPATH, "value": './/time'}


def main():
    driver = webdriver.initiate_selenium_driver(timeout=30)
    driver.get("https://kristdemokraterna.se/arkiv/nyheter")
    news_items = driver \
        .safe_find_element(**Locators.news_feed()) \
        .safe_find_children(driver, **Locators.news_items())
    for news_item in news_items:
        try:
            info = {
                "url": news_item.safe_find_child(driver, **Locators.href()).get_attribute('href'),
                "title": news_item.safe_find_child(driver, **Locators.title()).text,
                "description": news_item.safe_find_child(driver, **Locators.description()).text,
                "date": to_datetime_kd(news_item.safe_find_child(driver, **Locators.datetime()).get_attribute('datetime')),
            }
            print(info)
        except TimeoutException as e:
            print(news_item.get_attribute('innerHTML'))
            raise e


if __name__ == '__main__':
    main()
