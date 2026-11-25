FROM python:3.12-slim
WORKDIR /app
COPY src ./src
CMD ["python", "-c", "from src.app import health_check; print(health_check())"]
