import io
import logging
from typing import Union
from PIL import Image, UnidentifiedImageError
import torch
from torchvision import transforms

logger = logging.getLogger(__name__)

class ImagePreprocessor:
    def __init__(self):
        """
        Initializes the preprocessor with standard ImageNet transformations.
        Expected input shape for EfficientNet-B0 is 224x224.
        """
        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], 
                                 std=[0.229, 0.224, 0.225])
        ])

    def preprocess(self, image_input: Union[str, Image.Image, bytes]) -> torch.Tensor:
        """
        Preprocesses an image from various input types safely.
        
        Args:
            image_input: File path (str), PIL.Image, or raw bytes (uploaded file).
            
        Returns:
            torch.Tensor: Preprocessed image tensor ready for inference (1, 3, 224, 224).
        """
        try:
            # Safely resolve input type
            if isinstance(image_input, str):
                image = Image.open(image_input)
            elif isinstance(image_input, bytes):
                image = Image.open(io.BytesIO(image_input))
            elif isinstance(image_input, Image.Image):
                image = image_input
            elif hasattr(image_input, "read"):
                # Handles SpooledTemporaryFile formats like FastAPI UploadFile.file
                image = Image.open(image_input)
            else:
                raise TypeError(f"Unsupported input type: {type(image_input)}")
            
            # Ensure the image is universally converted to RGB (handles PNG max colors/RGBA, Grayscale)
            if image.mode != "RGB":
                image = image.convert("RGB")
                
            # Apply transformations and add a batch dimension
            tensor = self.transform(image).unsqueeze(0)
            return tensor
            
        except UnidentifiedImageError:
            logger.error("The provided input could not be identified as an image.")
            raise ValueError("The provided input is not a valid or corrupted image file.")
        except Exception as e:
            logger.error(f"Error during image preprocessing: {e}")
            raise
