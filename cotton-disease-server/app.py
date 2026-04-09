import os
import uvicorn
import pathlib
import platform
plt = platform.system()
if plt == 'Windows':
    pathlib.PosixPath = pathlib.WindowsPath
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastai.vision.all import *
from pathlib import Path



# Initialize FastAPI
app = FastAPI(title="Cotton Disease Spray Assistant")

# 1. Configuration: Map your folder names (labels) to spray times in seconds
# You can adjust these times based on severity requirements
SPRAY_CONFIG = {
    "bacterial_blight": 25,  # Requires specific antibacterial spray
    "curl_virus": 30,       # Usually requires insecticide for whiteflies
    "fussarium_wilt": 20,   # Requires fungicide treatment
    "healthy": 0            # No spray needed
}

# 2. Load the FastAI Model
# Note: Ensure 'export.pkl' is in the same directory as this script
model_path = Path("export.pkl")
if not model_path.exists():
    raise RuntimeError("Model file 'export.pkl' not found. Please place it in the root directory.")

learn = load_learner(model_path)

@app.post("/analyze")
async def analyze_plant(file: UploadFile = File(...)):
    # Validate file type
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image.")

    try:
        # Save uploaded file temporarily
        temp_path = f"temp_{file.filename}"
        with open(temp_path, "wb") as buffer:
            buffer.write(await file.read())

        # 3. Perform Prediction
        # learn.predict returns (label, index, probabilities)
        prediction, _, probs = learn.predict(temp_path)
        
        # Convert label to string (it might be a FastAI Category object)
        status = str(prediction)
        
        # 4. Determine Spray Time
        # Default to 0 if status is unknown, otherwise use our mapping
        spray_time = SPRAY_CONFIG.get(status, 0)
        confidence = float(max(probs))

        # Clean up temp file
        os.remove(temp_path)

        return {
            "status": status,
            "confidence": f"{confidence:.2%}",
            "spray_time_seconds": spray_time,
            "action": "Spray initiated" if spray_time > 0 else "No action required"
        }

    except Exception as e:
        if os.path.exists(temp_path):
            os.remove(temp_path)
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)