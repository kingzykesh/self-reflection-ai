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
        "rejected", "abandoned", "drained", "neglected", "unseen"
    ]

    anger_words = [
        "angry", "annoyed", "frustrated", "irritated", "mad",
        "furious", "upset", "resentful", "bitter", "offended",
        "betrayed"
    ]

    love_words = [
        "love", "loved", "care about", "cherish", "attached",
        "affection", "fond of", "deeply care", "connected"
    ]

    happy_words = [
        "happy", "grateful", "excited", "peaceful", "joyful",
        "glad", "fulfilled", "hopeful", "relieved", "thankful",
        "blessed", "content", "optimistic"
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

    if any(word in text for word in [
        "ignore", "ignored", "reply", "message", "text back", "seen",
        "left on read", "not responding", "no response"
    ]):
        return "communication anxiety"

    if any(word in text for word in [
        "leave", "abandon", "abandoned", "alone", "replace", "left me",
        "rejected", "unwanted", "excluded"
    ]):
        return "fear of abandonment"

    if any(word in text for word in [
        "not enough", "worthless", "failure", "useless", "not good enough",
        "i hate myself", "i am the problem"
    ]):
        return "negative self-perception"

    if any(word in text for word in [
        "trust", "cheat", "lie", "betray", "betrayed", "dishonest"
    ]):
        return "trust concern"

    if any(word in text for word in [
        "anxious", "anxiety", "worry", "worried", "overthinking",
        "uneasy", "perturbed", "uncertain", "unsure", "confused",
        "don't know"
    ]):
        return "fear or uncertainty"

    if any(word in text for word in [
        "lonely", "alone", "isolated", "nobody cares", "unseen",
        "neglected", "hurt", "disconnected"
    ]):
        return "emotional hurt or disconnection"

    if any(word in text for word in [
        "argument", "fight", "misunderstood", "not listening",
        "dismissed", "boundary", "boundaries"
    ]):
        return "relationship conflict"

    if any(word in text for word in [
        "stressed", "overwhelmed", "pressure", "burnout",
        "frustrated", "irritated", "annoyed"
    ]):
        return "emotional frustration"

    if any(word in text for word in [
        "grateful", "thankful", "blessed", "appreciate",
        "peaceful", "relieved", "hopeful"
    ]):
        return "positive self-awareness"

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
    insights = {
        "communication anxiety":
            "You seem to be carrying uncertainty about communication with someone important to you. "
            "When responses are delayed or unclear, the mind often fills in the gaps with assumptions. "
            "Before drawing conclusions, consider what facts you actually have versus what your fears may be predicting.",

        "fear of abandonment":
            "This reflection appears to carry a fear of losing connection, support, or belonging. "
            "Fear of abandonment can make ordinary situations feel more threatening than they truly are. "
            "Try separating the possibility of loss from the certainty of loss, and focus on what is happening right now rather than what might happen.",

        "negative self-perception":
            "There seems to be a critical inner voice influencing how you see yourself. "
            "Moments of failure or disappointment do not define your worth. "
            "Consider speaking to yourself the way you would encourage a close friend facing the same challenge.",

        "trust concern":
            "Trust appears to be at the center of this reflection. "
            "When trust feels uncertain, emotions often become intense because safety and security feel threatened. "
            "It may help to identify whether your concern comes from evidence, past experiences, or fear of being hurt again.",

        "fear or uncertainty":
            "You appear to be dealing with uncertainty about something important. "
            "Fear often grows when the future feels unclear. "
            "Rather than trying to solve every possible outcome, focus on the next step that is within your control.",

        "emotional frustration":
            "There is a sense of frustration beneath this reflection. "
            "Frustration usually signals that a need, expectation, or boundary has not been met. "
            "Identifying exactly what feels blocked may help you respond more effectively than reacting from emotion alone.",

        "relationship conflict":
            "This reflection suggests tension in a relationship or conversation. "
            "Conflict often becomes heavier when emotions are left unnamed. "
            "Consider what you needed in that moment and how it could be expressed clearly and calmly.",

        "emotional hurt or disconnection":
            "This reflection suggests emotional pain or a sense of disconnection. "
            "Emotional hurt often comes from feeling unseen, misunderstood, or disappointed. "
            "Allow yourself to acknowledge the feeling without judging it, and consider what support you may need right now.",

        "positive self-awareness":
            "This reflection shows healthy awareness of your emotions and experiences. "
            "Recognizing positive moments is an important part of emotional well-being. "
            "Take a moment to appreciate what is contributing to this feeling and how you can continue nurturing it.",

        "attachment and affection":
            "There appears to be a meaningful emotional connection behind this reflection. "
            "Feelings of affection often reflect values such as care, belonging, and appreciation. "
            "Consider how this connection influences your overall well-being and sense of purpose.",

        "unexpected emotional reaction":
            "Something seems to have caught you emotionally off guard. "
            "Unexpected emotions can reveal hidden expectations, assumptions, or values. "
            "Reflecting on what surprised you may provide useful insight into what matters most to you.",

        "general self-reflection":
            "This reflection provides an opportunity to better understand your emotional state. "
            "Self-awareness grows when we become curious about our thoughts instead of immediately judging them. "
            "Consider what this experience may be teaching you about yourself."
    }

    return insights.get(pattern, insights["general self-reflection"])


@app.get("/")
def home():
    return {
        "status": True,
        "message": "Self Reflection AI Service is running with AI Version 2 insight engine"
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