
FROM python:3.12-slim

# Update Debian security packages
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Create a non-root user
RUN groupadd --system appgroup && \
    useradd --system --gid appgroup --create-home appuser

# Copy application files with correct ownership
COPY --chown=appuser:appgroup . .

# Install application dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Run as non-root
USER appuser

# Keep your existing CMD here
