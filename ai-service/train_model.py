import os
import re
import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.svm import LinearSVC
from sklearn.calibration import CalibratedClassifierCV
from sklearn.metrics import accuracy_score, classification_report

MODEL_DIR = "models"
MODEL_PATH = os.path.join(MODEL_DIR, "emotion_model.pkl")
VECTORIZER_PATH = os.path.join(MODEL_DIR, "vectorizer.pkl")

os.makedirs(MODEL_DIR, exist_ok=True)


def clean_text(text):
    text = str(text).lower()
    text = re.sub(r"http\S+|www\S+", " ", text)
    text = re.sub(r"[^a-zA-Z\s']", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def load_dataset(path):
    df = pd.read_csv(path)

    df.columns = (
        df.columns
        .str.replace("\ufeff", "", regex=False)
        .str.strip()
    )

    print(f"\nLoading: {path}")
    print("Columns found:", df.columns.tolist())

    if "Text" not in df.columns or "Emotion" not in df.columns:
        raise ValueError(f"{path} must contain Text and Emotion columns")

    df = df[["Text", "Emotion"]].dropna()
    df["Text"] = df["Text"].apply(clean_text)
    df["Emotion"] = df["Emotion"].astype(str).str.lower().str.strip()

    return df


main_df = load_dataset("datasets/Emotion_final.csv")
custom_df = load_dataset("datasets/custom_reflections.csv")

df = pd.concat([main_df, custom_df], ignore_index=True)

valid_emotions = ["anger", "fear", "happy", "love", "sadness", "surprise"]
df = df[df["Emotion"].isin(valid_emotions)]
df = df[df["Text"].str.len() >= 3]
df = df.drop_duplicates(subset=["Text", "Emotion"])

print("Final dataset size:", len(df))
print("Class distribution:")
print(df["Emotion"].value_counts())

X = df["Text"]
y = df["Emotion"]

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y,
)

vectorizer = TfidfVectorizer(
    max_features=25000,
    stop_words="english",
    ngram_range=(1, 3),
    sublinear_tf=True,
    min_df=1,
)

X_train_vec = vectorizer.fit_transform(X_train)
X_test_vec = vectorizer.transform(X_test)

base_model = LinearSVC(class_weight="balanced")
model = CalibratedClassifierCV(base_model, cv=3)

model.fit(X_train_vec, y_train)

predictions = model.predict(X_test_vec)

print("\nAccuracy:", accuracy_score(y_test, predictions))
print(classification_report(y_test, predictions))

joblib.dump(model, MODEL_PATH)
joblib.dump(vectorizer, VECTORIZER_PATH)

print("\nModel saved successfully.")