# inspect_datasets.py

import pandas as pd

files = [
    "datasets/Emotion_final.csv",
    "datasets/emotion_sentimen_dataset.csv",
    "datasets/text.csv"
]

for file in files:
    print("\n" + "=" * 80)
    print(file)

    df = pd.read_csv(file)

    print("Rows:", len(df))
    print("Columns:", df.columns.tolist())

    for col in df.columns:
        print(f"\n{col}")
        print(df[col].value_counts().head(20))