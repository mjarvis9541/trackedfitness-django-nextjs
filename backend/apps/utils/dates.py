import calendar
import datetime


def get_week_range(date):
    """
    Takes a date and returns the start and end date of the week.
    """
    start = date - datetime.timedelta(days=date.weekday())
    end = start + datetime.timedelta(days=6)
    return (start, end)


def get_month_range(date):
    """
    Takes a date and returns the first monday and last sunday of the month.
    """
    month_range = calendar.monthrange(date.year, date.month)
    month_start = datetime.date(date.year, date.month, 1)
    month_end = datetime.date(date.year, date.month, month_range[1])
    first_monday = month_start - datetime.timedelta(days=month_start.weekday() % 7)
    last_sunday = month_end - datetime.timedelta(days=month_end.weekday() - 6 % 7)
    return (first_monday, last_sunday)
