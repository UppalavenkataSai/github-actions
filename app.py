from flask import Flask, jsonify

app = Flask(__name__)


@app.get("/")
def home():
    return jsonify({"message": "Task Tracker API is running"})


@app.get("/tasks")
def get_tasks():
    return jsonify(
        [
            {"id": 1, "title": "Learn GitHub Actions", "completed": False},
            {"id": 2, "title": "Build a CI pipeline", "completed": False},
        ]
    )


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
