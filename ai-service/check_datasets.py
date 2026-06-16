import pandas as pd
import os

for file in os.listdir("datasets"):
    if file.endswith(".csv"):
        path = os.path.join("datasets", file)

        try:
            df = pd.read_csv(path, nrows=5, encoding="utf-8")
        except:
            df = pd.read_csv(path, nrows=5, encoding="latin-1")

        print("\n" + "=" * 60)
        print("FILE:", file)
        print("COLUMNS:", df.columns.tolist())
        print(df.head())