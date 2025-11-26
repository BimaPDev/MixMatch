# Use a lightweight Python image
FROM python:3.9-slim

# Keep Python from buffering stdout (so logs show up immediately)
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install dependencies first (Caching layer)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the code
COPY . .

# Run the worker
CMD ["python", "main.py"]