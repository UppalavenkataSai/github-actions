"""Small Python application for the CI/CD training lab."""


def health_check() -> dict:
    """Return the application health status."""
    return {"status": "ok", "service": "freecodes-day5-day6"}


def add_numbers(first: int, second: int) -> int:
    """Return the sum of two integers."""
    return first + second
