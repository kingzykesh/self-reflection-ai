from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np

app = FastAPI(title="Self Reflection AI Service")

model = joblib.load("models/emotion_model.pkl")
vectorizer = joblib.load("models/vectorizer.pkl")


class ReflectionRequest(BaseModel):
    text: str


def emotion_override(text: str):
    text = text.lower()

    fear_words = [
        "perturbed", "anxious", "anxiety", "uneasy", "worried", "scared",
        "afraid", "nervous", "restless", "panicking", "panic", "disturbed",
        "overwhelmed", "insecure", "apprehensive", "terrified", "fearful"
    ]

    sadness_words = [
        "sad", "lonely", "empty", "hurt", "broken", "hopeless",
        "down", "depressed", "unhappy", "miserable", "heartbroken",
        "rejected", "abandoned", "drained", "tired of everything"
    ]

    anger_words = [
        "angry", "annoyed", "frustrated", "irritated", "mad",
        "furious", "upset", "resentful", "bitter", "offended"
    ]

    love_words = [
        "love", "loved", "care about", "cherish", "attached",
        "affection", "fond of", "deeply care"
    ]

    happy_words = [
        "happy", "grateful", "excited", "peaceful", "joyful",
        "glad", "fulfilled", "hopeful", "relieved"
    ]

    if any(word in text for word in fear_words):
        return "fear"

    if any(word in text for word in sadness_words):
        return "sadness"

    if any(word in text for word in anger_words):
        return "anger"

    if any(word in text for word in love_words):
        return "love"

    if any(word in text for word in happy_words):
        return "happy"

    return None


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

    if any(word in text for word in ["ignore", "ignored", "reply", "message", "text back", "seen"]):
        return "communication anxiety"

    if any(word in text for word in ["leave", "abandon", "abandoned", "alone", "replace", "left me"]):
        return "fear of abandonment"

    if any(word in text for word in ["not enough", "worthless", "failure", "useless", "not good enough"]):
        return "negative self-perception"

    if any(word in text for word in ["trust", "cheat", "lie", "betray", "betrayed"]):
        return "trust concern"

    if any(word in text for word in ["confused", "unclear", "mixed signals", "uncertain"]):
        return "emotional confusion"

    if any(word in text for word in ["argument", "fight", "misunderstood", "not listening"]):
        return "relationship conflict"

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

    ml_prediction = model.predict(text_vector)[0]

    probabilities = model.predict_proba(text_vector)[0]
    ml_confidence = round(float(np.max(probabilities)) * 100, 2)

    override = emotion_override(payload.text)

    if override:
        prediction = override
        confidence_score = max(ml_confidence, 90.0)
    else:
        prediction = ml_prediction
        confidence_score = ml_confidence

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