import os
import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report

DATASET_PATH = "datasets/emotion_final.csv"
MODEL_DIR = "models"
MODEL_PATH = os.path.join(MODEL_DIR, "emotion_model.pkl")
VECTORIZER_PATH = os.path.join(MODEL_DIR, "vectorizer.pkl")

os.makedirs(MODEL_DIR, exist_ok=True)

df = pd.read_csv(DATASET_PATH)

print("Columns:", df.columns.tolist())
print(df.head())

text_column = "Text"
label_column = "Emotion"

df = df[[text_column, label_column]].dropna()

X = df[text_column]
y = df[label_column]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

vectorizer = TfidfVectorizer(
    max_features=10000,
    stop_words="english",
    ngram_range=(1, 2)
)

X_train_vec = vectorizer.fit_transform(X_train)
X_test_vec = vectorizer.transform(X_test)

model = LogisticRegression(max_iter=1000)
model.fit(X_train_vec, y_train)

predictions = model.predict(X_test_vec)

print("Accuracy:", accuracy_score(y_test, predictions))
print(classification_report(y_test, predictions))

joblib.dump(model, MODEL_PATH)
joblib.dump(vectorizer, VECTORIZER_PATH)

print("Model saved successfully.")