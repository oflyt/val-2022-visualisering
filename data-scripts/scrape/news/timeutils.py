import locale
from datetime import datetime


def to_datetime_sd(value: str) -> str:
    """
    Publicerat: mån 28/11 - 2022 -> 2023-12-28
    """
    return to_datetime(value.replace('Publicerat: ', ''), "%a %d/%m - %Y")


def to_datetime_m(value: str) -> str:
    """
    28 december, 2023 -> 2023-12-28
    """
    return to_datetime(value, "%d %B, %Y")


def to_datetime_kd(value: str) -> str:
    """
    2024-01-19T12:49:21.814Z -> 2024-01-19
    """
    return to_datetime(value, "%Y-%m-%dT%H:%M:%S.%fZ")


def to_datetime_c(value: str) -> str:
    """
    28 december 2023 11:16 -> 2023-12-28
    """
    return to_datetime(value, "%d %B %Y %H:%M")


def to_datetime(value: str, from_format: str = "%d %B %Y") -> str:
    """
    28 december 2023 -> 2023-12-28
    """
    try:
        prev_locale_string = locale.getlocale(locale.LC_TIME)
        locale.setlocale(locale.LC_TIME, "sv_SE")  # swedish
        date_value = datetime.strptime(value, from_format)
        date_value_str = datetime.strftime(date_value, "%Y-%m-%d")
        locale.setlocale(locale.LC_TIME, prev_locale_string)  # swedish
        return date_value_str
    except ValueError as e:
        raise ValueError("Failed to convert {}".format(value)) from e
