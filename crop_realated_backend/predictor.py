import logging
import torch
import torch.nn.functional as F
from typing import Union, List, Dict, Any

from model_loader import ModelLoader
from preprocessing import ImagePreprocessor

logger = logging.getLogger(__name__)

class CropDiseasePredictor:
    def __init__(self, checkpoint_path: str, confidence_threshold: float = 0.6):
        """
        Initializes the full inference pipeline. Should be initialized ONCE efficiently.
        
        Args:
            checkpoint_path (str): Path to your specific trained '.pth' file.
            confidence_threshold (float): Minimum confidence required; otherwise returns 'Unknown'.
        """
        self.model_loader = ModelLoader(checkpoint_path)
        self.preprocessor = ImagePreprocessor()
        self.confidence_threshold = confidence_threshold
        
    @staticmethod
    def format_class_name(class_name: str) -> str:
        """
        Converts labels like 'Tomato___Early_blight' -> 'Tomato Early Blight'
        """
        return class_name.replace("___", " ").replace("_", " ").title()

    def predict(self, image_input: Union[str, Any], top_k: int = 3) -> Dict[str, Any]:
        """
        Predicts the disease for a single image, returning class and confidence margins.
        """
        try:
            # 1. Preprocess
            tensor = self.preprocessor.preprocess(image_input)
            tensor = tensor.to(self.model_loader.device)
            
            # 2. Infer (using no_grad to save memory and skip autograd overhead)
            with torch.no_grad():
                outputs = self.model_loader.model(tensor)
                # Apply softmax to logits to get actual probabilities
                probabilities = F.softmax(outputs, dim=1).squeeze(0)
                
            # 3. Process the predicted highest probabilities safely based on class volume
            safe_top_k = min(top_k, len(self.model_loader.class_names))
            top_probs, top_indices = torch.topk(probabilities, safe_top_k)
            
            # Convert to iteratable numerical items
            top_probs = top_probs.cpu().numpy()
            top_indices = top_indices.cpu().numpy()
            class_names = self.model_loader.class_names
            
            # 4. Formulate response payload
            top3_predictions = []
            for prob, idx in zip(top_probs, top_indices):
                top3_predictions.append({
                    "class": self.format_class_name(class_names[idx]),
                    "confidence": float(prob)
                })
                
            best_class = top3_predictions[0]["class"]
            best_conf = top3_predictions[0]["confidence"]
            
            # Handle confidence thresholds
            if best_conf < self.confidence_threshold:
                return {
                    "predicted_class": "Unknown or Uncertain",
                    "confidence": best_conf,
                    "top3_predictions": top3_predictions
                }
                
            return {
                "predicted_class": best_class,
                "confidence": best_conf,
                "top3_predictions": top3_predictions
            }
            
        except Exception as e:
            logger.error(f"Prediction failed: {e}")
            raise
            
    def predict_batch(self, image_inputs: List[Union[str, Any]]) -> List[Dict[str, Any]]:
        """
        Helper iteration for predicting an incoming batch of images.
        """
        return [
            self.predict(img) if not isinstance(self.predict(img), Exception) else {"error": "Failed"} 
            for img in image_inputs
        ]
