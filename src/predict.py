import numpy as np
import pandas as pd
import joblib
import os
import shap
from src.features import engineer_features


MODELS_DIR = "models"
MODEL_PATH = os.path.join(MODELS_DIR, "best_model.pkl")
FEATURE_NAMES_PATH = os.path.join(MODELS_DIR, "feature_names.pkl")


class ChurnPredictor:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if self._initialized:
            return
        self._initialized = True
        self.pipeline = joblib.load(MODEL_PATH)
        self.feature_names = joblib.load(FEATURE_NAMES_PATH)
        self.classifier = self.pipeline.named_steps["classifier"]
        self.preprocessor = self.pipeline.named_steps["preprocessor"]

    def predict(self, input_data: dict):
        df = pd.DataFrame([input_data])
        df = engineer_features(df)

        processed = self.preprocessor.transform(df)
        proba = self.pipeline.predict_proba(df)[0][1]
        pred = int(self.pipeline.predict(df)[0])

        if hasattr(self.classifier, "feature_importances_"):
            explainer = shap.TreeExplainer(self.classifier)
            shap_values = explainer.shap_values(processed)
        else:
            explainer = shap.LinearExplainer(self.classifier, processed)
            shap_values = explainer.shap_values(processed)

        if isinstance(shap_values, list):
            shap_values = shap_values[0]

        shap_values_single = np.array(shap_values[0]).flatten()
        feature_importance = np.abs(shap_values_single)
        top_indices = np.argsort(feature_importance)[::-1][:3]

        top_features = []
        for idx in top_indices:
            name = self.feature_names[idx] if idx < len(self.feature_names) else f"feature_{idx}"
            value = float(shap_values_single[idx])
            top_features.append({"feature": name, "shap_value": round(value, 4)})

        return {
            "churn_probability": round(float(proba), 4),
            "prediction": pred,
            "top_features": top_features,
        }


predictor = ChurnPredictor()
