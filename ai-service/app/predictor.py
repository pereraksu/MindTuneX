import json
import os
import re
from typing import Dict, List

import torch
import torch.nn.functional as F

from app.model_loader import (
    tokenizer,
    model,
    DEVICE,
    ID2EMOTION,
    MAX_LENGTH,
    CONFIDENCE_THRESHOLD,
)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_DIR = os.path.join(BASE_DIR, "saved_model")
INFERENCE_META_PATH = os.path.join(MODEL_DIR, "inference_meta.json")

# Meta data load කිරීම
try:
    with open(INFERENCE_META_PATH, "r", encoding="utf-8") as f:
        INFERENCE_META = json.load(f)
except Exception as e:
    print(f"Error loading inference meta: {e}")
    INFERENCE_META = {}

NEUTRAL_PATTERNS = INFERENCE_META.get("neutral_patterns", [])
EXPLANATION_KEYWORDS = INFERENCE_META.get("explanation_keywords", {})
TRIGGER_CATEGORIES = INFERENCE_META.get("trigger_categories", {})

CONTRACTIONS = {
    "i'm": "i am", "i've": "i have", "i'd": "i would", "i'll": "i will",
    "don't": "do not", "doesn't": "does not", "didn't": "did not",
    "can't": "cannot", "won't": "will not", "it's": "it is",
    "that's": "that is", "they're": "they are", "we're": "we are",
    "you're": "you are", "isn't": "is not", "aren't": "are not",
    "wasn't": "was not", "haven't": "have not",
}

EMOTION_POLARITY = {
    "joy": 0.9, "love": 0.85, "calm": 0.7, "surprise": 0.25,
    "neutral": 0.0, "fatigue": -0.4, "anxiety": -0.65,
    "stress": -0.7, "fear": -0.75, "anger": -0.75,
    "disgust": -0.7, "sadness": -0.8,
}

def clean_text(text: str) -> str:
    text = str(text).lower().strip()
    text = re.sub(r"http\S+|www\S+", "", text)
    text = re.sub(r"<[^>]+>", "", text)
    for short, expanded in CONTRACTIONS.items():
        text = text.replace(short, expanded)
    text = re.sub(r"[^a-z0-9\s.,!?'\-]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text

def get_confidence_level(confidence: float) -> str:
    if confidence >= 0.75: return "high"
    if confidence >= 0.45: return "medium"
    return "low"

def get_sentiment_label(emotion: str) -> str:
    positive = {"joy", "love", "calm"}
    negative = {"stress", "anxiety", "sadness", "anger", "fatigue", "fear", "disgust"}
    if emotion in positive: return "positive"
    if emotion in negative: return "negative"
    return "neutral"

def get_recommendation_type(emotion: str) -> str:
    rec_map = {
        "joy": "maintain_positive_mood", "love": "warm_supportive_content",
        "calm": "mindfulness_and_relaxation", "stress": "stress_relief_content",
        "anxiety": "calming_and_reassurance", "sadness": "comfort_and_support",
        "anger": "cool_down_and_reflect", "fatigue": "rest_and_low_energy_support",
        "fear": "grounding_and_reassurance", "disgust": "distraction_and_reset",
        "surprise": "light_reflection_content", "neutral": "general_reflection_content",
    }
    return rec_map.get(emotion, "general_reflection_content")

def get_support_level(emotion: str, confidence: float) -> str:
    if emotion in {"sadness", "stress", "anxiety", "fear", "anger"} and confidence >= 0.70:
        return "high"
    if emotion in {"fatigue", "disgust"}:
        return "moderate"
    return "low"

def extract_explanation_keywords(text: str, emotion: str) -> List[str]:
    found = []
    text_lower = text.lower()
    for kw in EXPLANATION_KEYWORDS.get(emotion, []):
        if kw in text_lower: found.append(kw)
    return found[:5]

def extract_trigger_category(text: str) -> str:
    text_lower = text.lower()
    for category, words in TRIGGER_CATEGORIES.items():
        for word in words:
            if word in text_lower: return category
    return "general"

# 🚀 වැදගත්: මෙතන තමයි කලින් වැරැද්ද තිබුණේ. 
# අපි Logic එක වෙනස් කළා AI මොඩල් එකට මුල් තැන දෙන විදිහට.
def apply_post_rules(text: str, pred: str, confidence: float) -> str:
    text_lower = text.lower()

    # 1. ඉතාමත් පැහැදිලි Neutral වචන තිබේ නම් පමණක් Neutral කරන්න
    if any(f" {pattern} " in f" {text_lower} " for pattern in NEUTRAL_PATTERNS):
        return "neutral"

    # 2. වැරදියට පෙන්වන හැඟීම් නිවැරදි කිරීම (Keyword Booster)
    if any(word in text_lower for word in ["happy", "great", "amazing", "excited", "wonderful"]):
        return "joy"

    if any(word in text_lower for word in ["nervous", "worried", "anxious", "interview", "exam"]):
        return "anxiety"

    if any(word in text_lower for word in ["tired", "exhausted", "drained"]):
        return "fatigue"

    # 3. Confidence එක ඉතාමත් අඩු නම් පමණක් Neutral කරන්න
    # (THRESHOLD එක model_loader එකේ තියෙන අගයට වඩා ටිකක් අඩු කළා)
    if confidence < (CONFIDENCE_THRESHOLD * 0.7):
        return "neutral"

    return pred

def predict_emotion(text: str) -> Dict:
    text_clean = clean_text(text)

    enc = tokenizer(
        text_clean,
        truncation=True,
        padding="max_length",
        max_length=MAX_LENGTH,
        return_tensors="pt",
    )

    input_ids = enc["input_ids"].to(DEVICE)
    attention_mask = enc["attention_mask"].to(DEVICE)

    with torch.no_grad():
        logits = model(input_ids, attention_mask)
        probs = F.softmax(logits, dim=-1).squeeze(0).cpu()

    top_idx = int(torch.argmax(probs))
    confidence = float(probs[top_idx])

    # 🚀 Debugging සඳහා: Terminal එකේ පෙන්වයි මොඩල් එක මොකක්ද හිතන්නේ කියලා
    raw_pred = ID2EMOTION[top_idx]
    print(f"--- AI INFERENCE ---")
    print(f"Text: {text_clean}")
    print(f"Raw Prediction: {raw_pred} ({confidence:.4f})")

    # Rules apply කිරීම
    final_pred = apply_post_rules(text_clean, raw_pred, confidence)
    print(f"Final Prediction: {final_pred}")

    top3_idx = torch.argsort(probs, descending=True)[:3].tolist()
    top3 = [
        {"emotion": ID2EMOTION[i], "score": round(float(probs[i]), 4)}
        for i in top3_idx
    ]

    return {
        "inputText": text,
        "cleanText": text_clean,
        "rawPrediction": raw_pred,
        "predictedEmotion": final_pred,
        "confidence": round(confidence, 4),
        "confidencePercentage": round(confidence * 100, 1), # Frontend එකට ලේසි වෙන්න
        "confidenceLevel": get_confidence_level(confidence),
        "sentimentScore": round(EMOTION_POLARITY.get(final_pred, 0.0), 3),
        "sentimentLabel": get_sentiment_label(final_pred),
        "recommendationType": get_recommendation_type(final_pred),
        "supportLevel": get_support_level(final_pred, confidence),
        "triggerCategory": extract_trigger_category(text_clean),
        "explanationKeywords": extract_explanation_keywords(text_clean, final_pred),
        "top3Predictions": top3,
    }