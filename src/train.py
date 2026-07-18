import json
import os
import pandas as pd
import numpy as np
from sklearn.model_selection import StratifiedKFold, cross_validate
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from sklearn.metrics import (
    precision_score, recall_score, f1_score, roc_auc_score, make_scorer
)
from sklearn.pipeline import Pipeline
from src.preprocessing import (
    load_data, get_feature_types, build_preprocessor, prepare_data
)
from src.features import engineer_features
import joblib


MODELS_DIR = "models"
os.makedirs(MODELS_DIR, exist_ok=True)

RANDOM_STATE = 42
DATA_PATH = "data/WA_Fn-UseC_-Telco-Customer-Churn.csv"


def get_models():
    return {
        "logistic_regression": LogisticRegression(
            max_iter=1000, class_weight="balanced", random_state=RANDOM_STATE
        ),
        "random_forest": RandomForestClassifier(
            n_estimators=300, max_depth=10, class_weight="balanced_subsample",
            random_state=RANDOM_STATE, n_jobs=-1
        ),
        "xgboost": XGBClassifier(
            n_estimators=300, max_depth=6, learning_rate=0.1,
            subsample=0.9, colsample_bytree=0.9,
            random_state=RANDOM_STATE, n_jobs=-1, eval_metric="logloss"
        ),
    }


def evaluate_model_pipeline(pipeline, X, y, cv):
    scoring = {
        "precision": make_scorer(precision_score, zero_division=0),
        "recall": make_scorer(recall_score, zero_division=0),
        "f1": make_scorer(f1_score, zero_division=0),
        "roc_auc": "roc_auc",
    }
    cv_results = cross_validate(
        pipeline, X, y, cv=cv, scoring=scoring, return_train_score=False, n_jobs=-1
    )
    return {
        name: {
            "mean": float(np.mean(scores)),
            "std": float(np.std(scores)),
        }
        for name, scores in cv_results.items()
        if name.startswith("test_")
    }


def train_and_compare(data_path: str = DATA_PATH):
    df = load_data(data_path)
    df = engineer_features(df)

    numeric_features, low_cardinality, high_cardinality = get_feature_types(df)

    X = df.drop(columns=["Churn", "customerID"], errors="ignore")
    y = df["Churn"]

    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=RANDOM_STATE)

    results = {}
    best_model_name = None
    best_model_score = -np.inf
    tree_models = {"random_forest", "xgboost"}

    for name, model in get_models().items():
        print(f"Training {name}...")
        preprocessor = build_preprocessor(numeric_features, low_cardinality, high_cardinality)
        pipeline = Pipeline(steps=[
            ("preprocessor", preprocessor),
            ("classifier", model),
        ])
        scores = evaluate_model_pipeline(pipeline, X, y, cv)
        results[name] = scores
        mean_auc = scores["test_roc_auc"]["mean"]
        print(f"{name} ROC-AUC: {mean_auc:.4f}  (+/- {scores['test_roc_auc']['std']:.4f})")
        if mean_auc > best_model_score:
            best_model_score = mean_auc
            best_model_name = name

    if best_model_name not in tree_models:
        xgb_auc = results.get("xgboost", {}).get("test_roc_auc", {}).get("mean", 0)
        rf_auc = results.get("random_forest", {}).get("test_roc_auc", {}).get("mean", 0)
        if xgb_auc >= best_model_score - 0.025:
            best_model_name = "xgboost"
            best_model_score = xgb_auc
        elif rf_auc >= best_model_score - 0.025:
            best_model_name = "random_forest"
            best_model_score = rf_auc

    with open(os.path.join(MODELS_DIR, "results.json"), "w") as f:
        json.dump(results, f, indent=2)

    print(f"\nBest model: {best_model_name} (ROC-AUC: {best_model_score:.4f})")

    best_classifier = get_models()[best_model_name]
    final_preprocessor = build_preprocessor(numeric_features, low_cardinality, high_cardinality)
    final_pipeline = Pipeline(steps=[
        ("preprocessor", final_preprocessor),
        ("classifier", best_classifier),
    ])
    final_pipeline.fit(X, y)

    joblib.dump(final_pipeline, os.path.join(MODELS_DIR, "best_model.pkl"))

    feature_names = _get_feature_names(final_pipeline.named_steps["preprocessor"])
    joblib.dump(feature_names, os.path.join(MODELS_DIR, "feature_names.pkl"))

    return best_model_name, results


def _get_feature_names(preprocessor):
    names = []
    for name, transformer, columns in preprocessor.transformers_:
        if name == "num":
            names.extend(columns)
        elif name == "cat":
            onehot = transformer.named_steps["onehot"]
            cats = onehot.categories_
            for i, col in enumerate(columns):
                for cat in cats[i]:
                    names.append(f"{col}_{cat}")
        elif name == "remainder":
            if transformer == "drop" or transformer is None:
                continue
            names.extend(columns)
    return names


def print_results_table(results):
    print("\n" + "="*80)
    print(f"{'Model':<25} {'Precision':<15} {'Recall':<15} {'F1':<15} {'ROC-AUC':<15}")
    print("="*80)
    for model_name, scores in results.items():
        precision = f"{scores['test_precision']['mean']:.4f}"
        recall = f"{scores['test_recall']['mean']:.4f}"
        f1 = f"{scores['test_f1']['mean']:.4f}"
        roc_auc = f"{scores['test_roc_auc']['mean']:.4f}"
        print(f"{model_name:<25} {precision:<15} {recall:<15} {f1:<15} {roc_auc:<15}")
    print("="*80)


if __name__ == "__main__":
    best_name, results = train_and_compare()
    print_results_table(results)
