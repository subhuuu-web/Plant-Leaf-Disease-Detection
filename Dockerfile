# Use a lightweight Python base image
FROM python:3.10-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the requirements file from the backend folder
COPY crop_realated_backend/requirements.txt .

# Install dependencies (updating pip is always recommended)
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend files into the current working directory (/app)
COPY crop_realated_backend/ .

# Hugging Face Spaces exposes port 7860
EXPOSE 7860

# Command to run your FastAPI application using uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
