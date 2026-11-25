from src.app import add_numbers, health_check


def test_add_numbers():
    assert add_numbers(10, 20) == 30


def test_health_check():
    result = health_check()
    assert result["status"] == "ok"
    assert result["service"] == "freecodes-day5-day6"
