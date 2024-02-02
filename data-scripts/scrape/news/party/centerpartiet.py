from news.timeutils import to_datetime_c
from news.pagecontext import PageContextManager


class Locators:
    @staticmethod
    def news_feed():
        return {"selector": 'xpath=.//div[contains(@class, "sol-article-list")]/ul[contains(@class, "sol-ul")]'}

    @staticmethod
    def news_items():
        return ['xpath=.//li']

    @staticmethod
    def href():
        return ['xpath=.//a']

    @staticmethod
    def title():
        return ['xpath=.//span[contains(@class, "sol-article-item-heading")]']

    @staticmethod
    def description():
        return ['xpath=.//span[contains(@class, "sol-article-item-desc")]']

    @staticmethod
    def date():
        return ['xpath=.//span[contains(@class, "sol-article-item-date")]']


def main():
    with PageContextManager({"headless": False}) as page:
        page.goto("https://www.centerpartiet.se/press/pressmeddelande")
        news_items = page \
            .safe_locate(**Locators.news_feed()) \
            .safe_locate_many(*Locators.news_items())
        for news_item in news_items.all():
            info = {
                "url": news_item.locator(*Locators.href()).get_attribute('href'),
                "title": news_item.locator(*Locators.title()).inner_text(),
                "description": news_item.locator(*Locators.description()).inner_text(),
                "date": to_datetime_c(news_item.locator(*Locators.date()).inner_text()),
            }
            print(info)


if __name__ == '__main__':
    main()
