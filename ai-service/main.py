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

    communication_fear_words = [
        "not replying", "not replying my text", "not replying my message",
        "not responding", "no response", "left on read", "seen my message",
        "hasn't replied", "has not replied", "ignored my message"
    ]

    academic_fear_words = [
        "first class", "cgpa", "gpa", "exam", "result", "carryover",
        "fail", "failing", "not make it", "not graduate", "school pressure"
    ]

    fear_words = [
        "perturbed", "anxious", "anxiety", "uneasy", "worried", "scared",
        "afraid", "nervous", "restless", "panicking", "panic", "disturbed",
        "overwhelmed", "insecure", "apprehensive", "terrified", "fearful",
        "uncertain", "unsure", "overthinking"
    ]

    sadness_words = [
        "sad", "lonely", "empty", "hurt", "broken", "hopeless",
        "down", "depressed", "unhappy", "miserable", "heartbroken",
        "rejected", "abandoned", "drained", "neglected", "unseen",
        "unwanted", "excluded"
    ]

    anger_words = [
        "angry", "annoyed", "frustrated", "irritated", "mad",
        "furious", "upset", "resentful", "bitter", "offended",
        "betrayed", "lied to me", "cheated", "dishonest"
    ]

    love_words = [
        "love", "loved", "care about", "cherish", "attached",
        "affection", "fond of", "deeply care", "connected"
    ]

    happy_words = [
        "happy", "grateful", "excited", "peaceful", "joyful",
        "glad", "fulfilled", "hopeful", "relieved", "thankful",
        "blessed", "content", "optimistic", "proud"
    ]

    if any(word in text for word in communication_fear_words):
        return "fear"

    if any(word in text for word in academic_fear_words):
        return "fear"

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
        "first class", "cgpa", "gpa", "exam", "result", "assignment",
        "project defense", "defense", "carryover", "graduation",
        "school", "semester", "course", "lecturer", "study", "academic"
    ]):
        return "academic pressure"

    if any(word in text for word in [
        "job", "career", "internship", "employment", "future career",
        "promotion", "opportunity", "cv", "resume", "interview"
    ]):
        return "career uncertainty"

    if any(word in text for word in [
        "money", "financial", "bills", "debt", "rent", "fees",
        "school fees", "broke", "salary", "income"
    ]):
        return "financial stress"

    if any(word in text for word in [
        "parents", "family", "mother", "father", "siblings",
        "expectations at home", "home pressure"
    ]):
        return "family pressure"

    if any(word in text for word in [
        "not replying", "reply", "message", "text back", "seen",
        "left on read", "not responding", "no response", "ignored my message",
        "hasn't replied", "has not replied"
    ]):
        return "communication anxiety"

    if any(word in text for word in [
        "leave", "abandon", "abandoned", "alone", "replace", "left me",
        "rejected", "unwanted", "excluded", "forget me"
    ]):
        return "fear of abandonment"

    if any(word in text for word in [
        "trust", "cheat", "lie", "betray", "betrayed", "dishonest",
        "unfaithful", "secret"
    ]):
        return "trust concern"

    if any(word in text for word in [
        "can't do it", "cannot do it", "not capable", "not smart enough",
        "not qualified", "doubt myself", "i am not enough",
        "not good enough"
    ]):
        return "self-doubt"

    if any(word in text for word in [
        "worthless", "failure", "useless", "i hate myself",
        "i am the problem", "nothing good about me"
    ]):
        return "negative self-perception"

    if any(word in text for word in [
        "perfect", "perfection", "mistake", "must get it right",
        "everything must be right", "flawless"
    ]):
        return "perfectionism"

    if any(word in text for word in [
        "burnout", "exhausted", "drained", "tired", "fatigue",
        "worn out", "stressed", "overwhelmed", "pressure"
    ]):
        return "burnout"

    if any(word in text for word in [
        "lonely", "isolated", "nobody understands", "nobody cares",
        "unseen", "neglected", "disconnected"
    ]):
        return "loneliness"

    if any(word in text for word in [
        "argument", "fight", "misunderstood", "not listening",
        "dismissed", "boundary", "boundaries", "conflict"
    ]):
        return "relationship conflict"

    if any(word in text for word in [
        "confused", "uncertain", "don't know", "unsure", "mixed signals"
    ]):
        return "decision uncertainty"

    if any(word in text for word in [
        "grateful", "thankful", "blessed", "appreciate",
        "peaceful", "relieved", "hopeful", "proud"
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
        "academic pressure":
            "You appear to be carrying concern about meeting an important academic expectation. "
            "This kind of pressure can make your future feel dependent on one result or performance outcome. "
            "It may help to separate the goal from the fear, then focus on the next practical step you can take today.",

        "career uncertainty":
            "This reflection suggests uncertainty about your career direction or future opportunities. "
            "Career pressure often becomes heavier when everything feels urgent at once. "
            "Try identifying one small action that can move you toward clarity rather than trying to solve the entire future immediately.",

        "financial stress":
            "This reflection points to pressure around financial responsibility or stability. "
            "Financial stress can affect emotions deeply because it touches safety, independence, and planning. "
            "Consider separating what needs immediate attention from what can be planned gradually.",

        "family pressure":
            "There seems to be pressure connected to family expectations or responsibilities. "
            "Family-related emotions can feel heavy because they often involve love, duty, and personal identity. "
            "It may help to identify which expectations are yours and which ones you are carrying from others.",

        "communication anxiety":
            "You seem to be carrying uncertainty about communication with someone important to you. "
            "When responses are delayed or unclear, the mind often fills in the gaps with assumptions. "
            "Before drawing conclusions, consider what facts you actually have versus what your fears may be predicting.",

        "fear of abandonment":
            "This reflection appears to carry a fear of losing connection, support, or belonging. "
            "Fear of abandonment can make ordinary situations feel more threatening than they truly are. "
            "Try separating the possibility of loss from the certainty of loss, and focus on what is happening right now rather than what might happen.",

        "trust concern":
            "Trust appears to be at the center of this reflection. "
            "When trust feels uncertain, emotions often become intense because safety and security feel threatened. "
            "It may help to identify whether your concern comes from evidence, past experiences, or fear of being hurt again.",

        "self-doubt":
            "This reflection suggests that doubt may be shaping how you see your ability or readiness. "
            "Self-doubt often grows when you focus only on what could go wrong. "
            "Try remembering previous moments where you handled difficulty, even when you were unsure at first.",

        "negative self-perception":
            "There seems to be a critical inner voice influencing how you see yourself. "
            "Moments of failure or disappointment do not define your worth. "
            "Consider speaking to yourself the way you would encourage a close friend facing the same challenge.",

        "perfectionism":
            "This reflection suggests pressure to get things exactly right. "
            "Perfectionism can make progress feel unsafe because mistakes begin to look like failure. "
            "It may help to aim for consistency and improvement rather than flawless performance.",

        "burnout":
            "This reflection suggests emotional or mental exhaustion. "
            "Burnout often appears when effort has continued for too long without enough recovery. "
            "Consider what can be paused, reduced, or handled with support so you can regain strength.",

        "loneliness":
            "This reflection suggests a feeling of emotional isolation or disconnection. "
            "Loneliness is not only about being physically alone; it can also come from feeling unseen or misunderstood. "
            "It may help to identify one safe connection you can reach out to, even in a small way.",

        "relationship conflict":
            "This reflection suggests tension in a relationship or conversation. "
            "Conflict often becomes heavier when emotions are left unnamed. "
            "Consider what you needed in that moment and how it could be expressed clearly and calmly.",

        "decision uncertainty":
            "This reflection suggests confusion or uncertainty around what to do next. "
            "When choices feel unclear, the mind may keep replaying possible outcomes. "
            "Try identifying the smallest next step instead of forcing yourself to solve everything at once.",

        "fear or uncertainty":
            "You appear to be dealing with uncertainty about something important. "
            "Fear often grows when the future feels unclear. "
            "Rather than trying to solve every possible outcome, focus on the next step that is within your control.",

        "emotional frustration":
            "There is a sense of frustration beneath this reflection. "
            "Frustration usually signals that a need, expectation, or boundary has not been met. "
            "Identifying exactly what feels blocked may help you respond more effectively than reacting from emotion alone.",

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


def generate_coach_question(pattern: str) -> str:
    questions = {
        "academic pressure":
            "What would success look like if you focused on steady progress rather than fear of failure?",

        "career uncertainty":
            "What is one small action you can take this week to gain more clarity about your career direction?",

        "financial stress":
            "Which part of this financial concern is within your control today?",

        "family pressure":
            "Which expectation feels truly yours, and which one feels placed on you by others?",

        "communication anxiety":
            "What conclusion are you drawing from the lack of response, and what evidence actually supports it?",

        "fear of abandonment":
            "What facts suggest the relationship is ending, and what facts suggest it may not be?",

        "trust concern":
            "Is this concern based on present evidence, past experiences, or fear of being hurt again?",

        "self-doubt":
            "What evidence do you have that contradicts the belief that you are not capable?",

        "negative self-perception":
            "If a close friend said this about themselves, how would you respond to them?",

        "perfectionism":
            "What would become possible if you allowed progress to matter more than perfection?",

        "burnout":
            "What is one responsibility you can reduce, pause, or ask for help with?",

        "loneliness":
            "Who is one safe person you could reach out to in a small but honest way?",

        "relationship conflict":
            "What need were you trying to express, and how could it be communicated more clearly?",

        "decision uncertainty":
            "What is the smallest next step you can take without needing full certainty?",

        "positive self-awareness":
            "What contributed to this positive feeling, and how can you nurture it intentionally?",

        "general self-reflection":
            "What do you think this experience is trying to teach you about yourself?"
    }

    return questions.get(pattern, questions["general self-reflection"])


def generate_recommended_action(pattern: str) -> str:
    actions = {
        "academic pressure":
            "Create a realistic study or work plan for the next seven days and focus on completing one step at a time.",

        "career uncertainty":
            "Write down three possible career steps, then choose one small action such as updating your CV, applying, or speaking to a mentor.",

        "financial stress":
            "List the financial issue clearly, separate urgent needs from future concerns, and identify one practical step you can take today.",

        "family pressure":
            "Write down what you feel responsible for, then separate healthy responsibility from pressure that may be emotionally overwhelming.",

        "communication anxiety":
            "Pause before assuming the worst. Wait for clearer evidence, then communicate your concern calmly if needed.",

        "fear of abandonment":
            "Ground yourself in present evidence rather than future fears, and identify one reassuring action within your control.",

        "trust concern":
            "Write down the specific action that affected your trust and decide what clarity, boundary, or conversation is needed.",

        "self-doubt":
            "Write three previous situations where you succeeded despite uncertainty or fear.",

        "negative self-perception":
            "Write one harsh thought you have about yourself, then challenge it with one realistic and kinder truth.",

        "perfectionism":
            "Choose one task and complete it to a good standard instead of waiting until it feels perfect.",

        "burnout":
            "Schedule intentional rest and reduce one unnecessary commitment if possible.",

        "loneliness":
            "Send a simple message to one trusted person or spend time in a supportive environment.",

        "relationship conflict":
            "Before reacting, write what you felt, what you needed, and what you would like to communicate.",

        "decision uncertainty":
            "Choose one small action that moves the situation forward without requiring complete certainty.",

        "positive self-awareness":
            "Take note of what helped you feel this way and consider repeating that healthy action.",

        "general self-reflection":
            "Take a few minutes to name what you feel, what triggered it, and what response would help you grow."
    }

    return actions.get(pattern, actions["general self-reflection"])


def generate_encouragement(emotion: str, pattern: str) -> str:
    if pattern == "academic pressure":
        return "Your worth is not defined by one result. Consistent effort, clarity, and discipline can still move you forward."

    if pattern == "career uncertainty":
        return "Not having everything figured out does not mean you are behind. Clarity often comes through small steps."

    if pattern == "burnout":
        return "Needing rest does not mean you are weak. Recovery is part of sustainable progress."

    if pattern == "communication anxiety":
        return "A delayed response does not automatically define your value or the strength of the relationship."

    if pattern == "fear of abandonment":
        return "Fear can feel convincing, but it is not always evidence. You can slow down and look at what is actually happening."

    if emotion == "fear":
        return "You have handled difficult situations before. Uncertainty does not mean inability."

    if emotion == "sadness":
        return "Difficult emotions deserve compassion, not judgment."

    if emotion == "anger":
        return "Strong emotions can become useful information when explored calmly."

    if emotion == "happy":
        return "Take a moment to appreciate this positive experience and what contributed to it."

    if emotion == "love":
        return "Meaningful connection is worth noticing, protecting, and expressing with care."

    return "Every honest reflection is progress. You are learning to observe yourself with more clarity."


@app.get("/")
def home():
    return {
        "status": True,
        "message": "Self Reflection AI Service is running with AI Version 3 pattern-aware coaching engine"
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
    coach_question = generate_coach_question(pattern)
    recommended_action = generate_recommended_action(pattern)
    encouragement = generate_encouragement(prediction, pattern)

    return {
        "emotion": prediction,
        "confidence_score": confidence_score,
        "sentiment": sentiment,
        "pattern_detected": pattern,
        "generated_insight": insight,
        "coach_question": coach_question,
        "recommended_action": recommended_action,
        "encouragement": encouragement
    }