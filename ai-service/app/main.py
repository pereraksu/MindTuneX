from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.schemas import TextRequest
from app.predictor import predict_emotion

app = FastAPI(title="MindTuneX AI Service")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root
@app.get("/")
def root():
    return {
        "message": "MindTuneX AI Service Running"
    }

# Health Check
@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "MindTuneX AI Service"
    }

# Prediction API
@app.post("/predict")
def predict(request: TextRequest):
    result = predict_emotion(request.text)
    return result