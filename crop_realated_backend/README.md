# Crop Disease Classification API

This is a PyTorch and FastAPI-based project designed to provide real-time classification of crop diseases from images. 
It uses a heavily customized EfficientNet-B0 architecture to predict and categorize plant leaf diseases based on a merged crop disease dataset.

## Table of Contents

- [Features](#features)
- [Architecture & Components](#architecture--components)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage (As an API Server)](#usage-as-an-api-server)
- [Usage (Single Local Image Inference)](#usage-single-local-image-inference)

## Features

- **High-Performance Base Model**: Leverages `EfficientNet-B0` architecture with a custom multi-layer classifier head.
- **RESTful API Endpoint**: Utilizes FastAPI for robust, asynchronous HTTP interactions.
- **Robust Preprocessing**: Uses standard ImageNet transformations (resizing to 224x224, tensor conversion, and normalization) and handles multiple image intake streams (bytes, PIL images, strings).
- **Graceful Error Handling / Thresholds**: Implements confidence thresholds (default: `0.6`) returning "Unknown or Uncertain" if prediction confidence is low.
- **Top-K Predictions**: Provides not only the best prediction but also the top-3 probabilities per inference.
- **GPU/CPU Agnostic**: The `ModelLoader` dynamically sets devices to CUDA if available, falling back securely to CPU otherwise.

## Architecture & Components

The application is structured logically to separate model manipulation, transformation logic, predictive formatting, and routing logic.

1. `main.py`: The entry point for the FastAPI server. It exposes a `POST /predict` route that processes an embedded `UploadFile` resolving it to base bytes to send to the pipeline.
2. `predictor.py` (`CropDiseasePredictor` class): Encapsulates inference operations. It handles top-k logic mapping output indices to class names, formatted beautifully with strings like "Tomato Early Blight".
3. `preprocessing.py` (`ImagePreprocessor` class): Consists of a chained method applying sequential PyTorch transformations to an image ensuring uniform dimensional limits. It universally maps images to RGB to prevent `mode` errors from single-channel matrices.
4. `model_loader.py` (`ModelLoader` class): Defines how the custom architecture rebuilds its classifier layer with Dropout and ReLU blocks. Once the graph is defined, it loads the `.pth` weights (`crop_disease_final.pth`).
5. `Requirements.txt`: Essential manifest declaring version-less module dependencies (FastAPI, PyTorch ecosystem, Uvicorn, Pillow, Python Multipart).
6. Core Weights File: `crop_disease_final.pth` contains the saved model weights alongside configuration elements. Let this remain in the root directory for successful loading.

## Prerequisites

- [Python 3.8+](https://www.python.org/downloads/)
- Environment capable of scientific computing (Virtual Environment recommended)

## Installation

1. **Clone or Extract the Project Directory** (Assuming existence at `d:\Project\crop_realated`).
2. **Navigate to the Project Root**:
   ```bash
   cd path/to/project
   ```
3. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
   *Note: Using a CUDA-enabled machine? Verify your PyTorch build matches your NVIDIA hardware compute capabilities (e.g. `pip install torch torchvision --index-url https://download.pytorch.org/whl/cu118`).*

## Usage (As an API Server)

To deploy the production-simulated web server via Uvicorn locally:

```bash
python main.py
```

Or distinctly via Uvicorn command line:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```
This binds the server on port 8000. 

### Interacting with the API

You can test the endpoint using `cURL`, Python `requests`, or FastAPI's integrated Swagger UI.

**cURL Method:**
```bash
curl -X POST "http://127.0.0.1:8000/predict" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@path/to/test/image.jpg"
```

**FastAPI Auto-Docs:**
Visit [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) in your browser. This will give you an interactive GUI to natively upload an image payload.

## Usage (Single Local Image Inference)

The `predict` function can take raw bytes or simply a string referencing an image. If you prefer to bake the predictor into another internal logic loop, simply import and load:

```python
from predictor import CropDiseasePredictor

# Initialize pipeline with threshold logic
predictor = CropDiseasePredictor(checkpoint_path="crop_disease_final.pth", confidence_threshold=0.6)

# Test Image (Accepts PIL Image, path str, or bytes)
# Note: Ensure test image has mode RGB. Grayscale inputs will be automatically upconverted.
result = predictor.predict("test_leaf_img.jpg", top_k=3)

print("Inference completed:", result)

""" 
Output pattern expected:
{
  "predicted_class": "Tomato Early Blight",
  "confidence": 0.9634,
  "top3_predictions": [
      {"class": "Tomato Early Blight", "confidence": 0.9634},
      {"class": "Tomato Late Blight", "confidence": 0.0210},
      {"class": "Potato Early Blight", "confidence": 0.0051}
  ]
}
"""
```
