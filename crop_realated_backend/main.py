import logging
import uvicorn
from fastapi import FastAPI, UploadFile, File, HTTPException
import io

from predictor import CropDiseasePredictor
from fastapi.middleware.cors import CORSMiddleware

# Setup logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")

# 1. Initialize API App
app = FastAPI(title="Crop Disease Classification API")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Globally initialize the pipeline ONCE during startup to prevent loading weights per request
CHECKPOINT_PATH = "crop_disease_final.pth"
try:
    predictor = CropDiseasePredictor(checkpoint_path=CHECKPOINT_PATH, confidence_threshold=0.6)
except Exception as e:
    logging.critical(f"Fatal error instantiating the pipeline: {e}")
    predictor = None


@app.get("/")
async def root():
    return {
        "status": "success", 
        "message": "Plant Disease Image Classification API is running flawlessly!",
        "interactive_docs": "Add /docs to the URL to view the live dashboard",
        "prediction_endpoint": "POST /predict"
    }


@app.post("/predict")
async def generate_prediction(file: UploadFile = File(...)):
    """
    Accepts an uploaded image file, processes it, and returns prediction dict payload.
    """
    if predictor is None:
        raise HTTPException(status_code=503, detail="Model predictor uninitialized or failed to load.")
        
    try:
        # FastAPI abstracts incoming uploads into purely readable bytes.
        # This routes successfully to `ImagePreprocessor`
        image_bytes = await file.read()
        
        result = predictor.predict(image_bytes)
        return result
        
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        logging.error(f"Unhandled server error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error occurred.")


if __name__ == "__main__":
    # --- Example 1: Single image inference (Standard Script Usage) ---
    print("\n--- Testing Single Local Image ---")
    try:
        # This will simulate finding a local image, simply swap with a realistic target
        import PIL.Image as Image
        dummy_img = Image.new("RGB", (256, 256), color="green")
        test_result = predictor.predict(dummy_img) 
        print(f"Prediction Result:\n{test_result}")
    except Exception:
        pass
        
    # --- Example 2: Run Production Server ---
    print("\n--- Starting API Server ---")
    # Execute this file to boot the server locally: `python main.py`
    uvicorn.run(app, host="0.0.0.0", port=8000)
