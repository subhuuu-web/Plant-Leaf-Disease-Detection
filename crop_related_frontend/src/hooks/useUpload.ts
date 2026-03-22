import { useState, useCallback } from "react";

// ⬇️ Change this to your FastAPI backend URL
const API_ENDPOINT = "https://subhwhoo36-plantdisease.hf.space/predict";

export interface PredictionResult {
  disease: string;
  confidence: number;
  causes: string;
  recommendation: string;
}

export function useUpload() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const responseData = await response.json();
      const diseaseName = responseData.predicted_class || "Unknown";
      
      const data: PredictionResult = {
        disease: diseaseName,
        confidence: responseData.confidence || 0,
        causes: "Information not available for this disease. Please consult specialized documentation based on the disease name.",
        recommendation: "Consult a local agricultural expert for definitive plant care advice.",
      };
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      // Demo fallback so the UI is testable without a backend
      setResult({
        disease: "Leaf Blight",
        confidence: 0.874,
        causes: "Caused by the fungus Exserohilum turcicum. Thrives in warm, humid conditions with prolonged leaf wetness and moderate temperatures (18–27 °C).",
        recommendation: "Remove and destroy infected leaves. Apply a fungicide containing chlorothalonil or mancozeb. Rotate crops and choose resistant varieties for future planting.",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { upload, isLoading, result, error, reset };
}
