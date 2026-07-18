import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from imblearn.over_sampling import SMOTE
from imblearn.pipeline import Pipeline as ImbPipeline
import joblib
import os


TARGET_COL = "Churn"
RANDOM_STATE = 42


def load_data(path: str) -> pd.DataFrame:
    df = pd.read_csv(path)
    df["TotalCharges"] = pd.to_numeric(df["TotalCharges"], errors="coerce")
    df[TARGET_COL] = df[TARGET_COL].map({"Yes": 1, "No": 0})
    return df


def get_feature_types(df: pd.DataFrame):
    numeric_features = df.select_dtypes(include=["int64", "float64"]).columns.tolist()
    if TARGET_COL in numeric_features:
        numeric_features.remove(TARGET_COL)
    if "customerID" in numeric_features:
        numeric_features.remove("customerID")

    categorical_features = df.select_dtypes(include=["object", "category"]).columns.tolist()
    if TARGET_COL in categorical_features:
        categorical_features.remove(TARGET_COL)
    if "customerID" in categorical_features:
        categorical_features.remove("customerID")

    low_cardinality = [c for c in categorical_features if df[c].nunique() <= 10]
    high_cardinality = [c for c in categorical_features if df[c].nunique() > 10]

    return numeric_features, low_cardinality, high_cardinality


def build_preprocessor(numeric_features, low_cardinality, high_cardinality):
    numeric_transformer = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="median")),
            ("scaler", StandardScaler()),
        ]
    )

    categorical_transformer = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="most_frequent")),
            ("onehot", OneHotEncoder(handle_unknown="ignore", sparse_output=False)),
        ]
    )

    all_categorical = low_cardinality + high_cardinality

    preprocessor = ColumnTransformer(
        transformers=[
            ("num", numeric_transformer, numeric_features),
            ("cat", categorical_transformer, all_categorical),
        ],
        remainder="drop",
    )

    return preprocessor


def prepare_data(df: pd.DataFrame, test_size: float = 0.2):
    numeric_features, low_cardinality, high_cardinality = get_feature_types(df)

    X = df.drop(columns=[TARGET_COL, "customerID"], errors="ignore")
    y = df[TARGET_COL]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=RANDOM_STATE, stratify=y
    )

    preprocessor = build_preprocessor(numeric_features, low_cardinality, high_cardinality)

    return X_train, X_test, y_train, y_test, preprocessor, numeric_features, low_cardinality, high_cardinality


def fit_preprocessor(preprocessor, X_train, y_train, use_smote: bool = True):
    if use_smote:
        model_pipeline = ImbPipeline(
            steps=[
                ("preprocessor", preprocessor),
                ("smote", SMOTE(random_state=RANDOM_STATE)),
            ]
        )
        model_pipeline.fit(X_train, y_train)
        return model_pipeline
    else:
        model_pipeline = Pipeline(
            steps=[
                ("preprocessor", preprocessor),
            ]
        )
        model_pipeline.fit(X_train, y_train)
        return model_pipeline


def save_preprocessor(preprocessor, path: str):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    joblib.dump(preprocessor, path)


def load_preprocessor(path: str):
    return joblib.load(path)
