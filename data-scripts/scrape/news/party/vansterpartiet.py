# TODO: port

from selenium.webdriver.common.by import By

from app import webdriver


class Locators:
    @staticmethod
    def news_feed():
        return {"by": By.XPATH, "value": './/ul[starts-with(@class, "SearchHits")]'}

    @staticmethod
    def news_items():
        return {"by": By.XPATH, "value": './/li[starts-with(@class, "SearchTeaser")]'}

    @staticmethod
    def href():
        return {"by": By.XPATH, "value": './/a'}

    @staticmethod
    def title():
        return {"by": By.XPATH, "value": './/a'}

    @staticmethod
    def description():
        return {"by": By.XPATH, "value": './/div[starts-with(@class, "SearchTeaser-module--excerpt")]'}

    @staticmethod
    def date():
        return {"by": By.XPATH, "value": './/time'}


def main():
    driver = webdriver.initiate_selenium_driver(timeout=30)
    driver.get("https://www.vansterpartiet.se/nyheter")
    news_items = driver \
        .safe_find_element(**Locators.news_feed()) \
        .safe_find_children(driver, **Locators.news_items())
    for news_item in news_items:
        info = {
            "url": news_item.safe_find_child(driver, **Locators.href()).get_attribute('href'),
            "title": news_item.safe_find_child(driver, **Locators.title()).text,
            "description": news_item.safe_find_child(driver, **Locators.description()).text,
            "date": news_item.safe_find_child(driver, **Locators.date()).get_attribute('datetime'),
        }
        print(info)


if __name__ == '__main__':
    main()
