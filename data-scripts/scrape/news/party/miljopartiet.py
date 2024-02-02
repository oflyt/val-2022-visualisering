# TODO: port

from selenium.webdriver.common.by import By

from app import webdriver


class Locators:
    @staticmethod
    def news_feed():
        return {"by": By.XPATH, "value": './/div[contains(@class, "post-feed__item-container")]'}

    @staticmethod
    def news_items():
        return {"by": By.XPATH, "value": './/a[contains(@class, "post-item")]'}

    @staticmethod
    def title():
        return {"by": By.XPATH, "value": './/h2[contains(@class, "post-item__item-title")]'}

    @staticmethod
    def date():
        return {"by": By.XPATH, "value": './/time'}


def main():
    driver = webdriver.initiate_selenium_driver(timeout=30)
    driver.get("https://www.mp.se/just-nu/")
    news_items = driver \
        .safe_find_element(**Locators.news_feed()) \
        .safe_find_children(driver, **Locators.news_items())
    for news_item in news_items:
        info = {
            "url": news_item.get_attribute('href'),
            "title": news_item.safe_find_child(driver, **Locators.title()).text,
            "description": "",
            "date": news_item.safe_find_child(driver, **Locators.date()).get_attribute('datetime'),
        }
        print(info)


if __name__ == '__main__':
    main()
