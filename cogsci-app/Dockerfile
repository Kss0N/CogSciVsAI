
# Build an image with the Python 3.13 image
FROM python:3.13-slim-bookworm

# Set the working directory to `/app`
WORKDIR /app

# Set environment variables used by the `flask` command
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0

# Install `gcc` and other dependencies
# NOTE: required for pip install to work, we use debian so instead of apk, we use apt-get
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libc6-dev \
    linux-headers-amd64 \
    && rm -rf /var/lib/apt/lists/*

# Copy `requirements.txt`
COPY requirements.txt .

# Install the Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the current directory `.` in the project to the workdir `.` in the image
COPY . .

EXPOSE 5000

# Set the default command for the container to `flask run --debug`
CMD ["flask", "run", "--debug"]