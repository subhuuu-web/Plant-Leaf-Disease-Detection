import logging
import torch
import torch.nn as nn
from torchvision import models

logger = logging.getLogger(__name__)

class ModelLoader:
    def __init__(self, checkpoint_path: str, device: str = None):
        """
        Initializes the ModelLoader, setting the hardware device and loading the model.
        
        Args:
            checkpoint_path (str): Path to the .pth checkpoint file.
            device (str, optional): 'cpu' or 'cuda'. Auto-detected if None.
        """
        if device is None:
            self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        else:
            self.device = torch.device(device)
            
        self.checkpoint_path = checkpoint_path
        self.model = None
        self.class_names = []
        self.config = {}
        
        self._load_model()
        
    def _load_model(self):
        """
        Loads the EfficientNet-B0 architecture, modifies the classifier head,
        and loads the weights from the checkpoint.
        """
        logger.info(f"Loading model from {self.checkpoint_path} on {self.device}...")
        try:
            # Map location ensures CPU environments can load GPU-trained weights
            checkpoint = torch.load(self.checkpoint_path, map_location=self.device)
            
            self.class_names = checkpoint.get("class_names", [])
            self.config = checkpoint.get("config", {})
            num_classes = len(self.class_names)
            
            if num_classes == 0:
                raise ValueError("Checkpoint does not contain valid 'class_names'.")
            
            # 1. Load standard EfficientNet-B0 architecture without pretrained weights
            self.model = models.efficientnet_b0(weights=None)
            
            # 2. Recreate the custom classifier head used during training
            in_features = self.model.classifier[1].in_features
            self.model.classifier = nn.Sequential(
                nn.Dropout(p=0.2, inplace=True),
                nn.Linear(in_features, 512),
                nn.ReLU(inplace=True),
                nn.Dropout(p=0.2, inplace=True),
                nn.Linear(512, num_classes)
            )
            
            # 3. Load the saved weights into the model
            self.model.load_state_dict(checkpoint["model_state"])
            
            # 4. Set to evaluation mode and move to device
            self.model.to(self.device)
            self.model.eval()
            
            logger.info(f"Model loaded successfully with {num_classes} classes.")
            
        except Exception as e:
            logger.error(f"Failed to load model: {e}")
            raise
