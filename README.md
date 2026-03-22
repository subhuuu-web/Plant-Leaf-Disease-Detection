# Plant Disease Detection System

A complete web application designed to classify and detect plant diseases from images using a deep learning model.

## Project Structure

This project is organized into two main parts:

- **Frontend** (`crop_related_frontend/`): A modern web user interface built with React, Vite, Tailwind CSS, and TypeScript.
- **Backend API** (`crop_realated_backend/`): A machine learning REST API built with Python and FastAPI that predicts diseases based on image uploads.

## Running Locally

### 1. Start the Backend Server
1. Navigate to the backend directory:
   ```bash
   cd crop_realated_backend
   ```
2. Install the necessary Python packages (if you haven't already):
   ```bash
   pip install -r requirements.txt
   ```
3. Run the FastAPI development server:
   ```bash
   python main.py
   ```
   *The API will start running on http://localhost:8000.*

### 2. Start the Frontend Server
1. Navigate to the frontend directory:
   ```bash
   cd crop_related_frontend
   ```
2. Install the Node.js dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The web application will start on http://localhost:8080.*
