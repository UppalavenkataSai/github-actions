from app import app


def test_home_returns_success():
    response = app.test_client().get("/")
    assert response.status_code == 200
    assert response.json["message"] == "Task Tracker API is running"


def test_tasks_returns_list():
    response = app.test_client().get("/tasks")
    assert response.status_code == 200
    assert isinstance(response.json, list)
    assert len(response.json) == 2
