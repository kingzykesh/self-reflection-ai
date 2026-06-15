from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np

app = FastAPI(title="Self Reflection AI Service")

model = joblib.load("models/emotion_model.pkl")
vectorizer = joblib.load("models/vectorizer.pkl")

class ReflectionRequest(BaseModel):
    text: str

def detect_sentiment(emotion: str) -> str:
    positive = ["happy", "love", "surprise"]
    negative = ["sadness", "anger", "fear"]

    if emotion in positive:
        return "positive"
    if emotion in negative:
        return "negative"
    return "neutral"

def detect_pattern(text: str, emotion: str) -> str:
    text = text.lower()

    if any(word in text for word in ["ignore", "ignored", "reply", "message", "text back"]):
        return "communication anxiety"

    if any(word in text for word in ["leave", "abandon", "alone", "replace"]):
        return "fear of abandonment"

    if any(word in text for word in ["not enough", "worthless", "failure", "useless"]):
        return "negative self-perception"

    if any(word in text for word in ["trust", "cheat", "lie", "betray"]):
        return "trust concern"

    if emotion == "fear":
        return "fear or uncertainty"

    if emotion == "anger":
        return "emotional frustration"

    if emotion == "sadness":
        return "emotional hurt or disconnection"

    if emotion == "happy":
        return "positive self-awareness"

    if emotion == "love":
        return "attachment and affection"

    if emotion == "surprise":
        return "unexpected emotional reaction"

    return "general self-reflection"

def generate_insight(emotion: str, sentiment: str, pattern: str) -> str:
    return (
        f"Your reflection suggests {emotion}, with an overall {sentiment} emotional tone. "
        f"The pattern detected is {pattern}. This may be a useful moment to pause, identify "
        f"the trigger behind the feeling, and consider one healthy response within your control."
    )

@app.get("/")
def home():
    return {
        "status": True,
        "message": "Self Reflection AI Service is running with trained emotion model"
    }

@app.post("/analyze")
def analyze_reflection(payload: ReflectionRequest):
    text_vector = vectorizer.transform([payload.text])

    prediction = model.predict(text_vector)[0]

    probabilities = model.predict_proba(text_vector)[0]
    confidence_score = round(float(np.max(probabilities)) * 100, 2)

    sentiment = detect_sentiment(prediction)
    pattern = detect_pattern(payload.text, prediction)
    insight = generate_insight(prediction, sentiment, pattern)

    return {
        "emotion": prediction,
        "confidence_score": confidence_score,
        "sentiment": sentiment,
        "pattern_detected": pattern,
        "generated_insight": insight
    }