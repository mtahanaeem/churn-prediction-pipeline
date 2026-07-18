import pandas as pd
import numpy as np
import pytest
from src.preprocessing import load_data, get_feature_types, build_preprocessor, prepare_data
from src.features import engineer_features as feat_eng
from src.features import engineer_features as feat_eng


def test_engineer_features_adds_columns():
    df = pd.DataFrame({
        "tenure": [1, 24, 50],
        "MonthlyCharges": [30.0, 70.0, 100.0],
        "Contract": ["Month-to-month", "One year", "Two year"],
        "PaymentMethod": ["Electronic check", "Mailed check", "Credit card (automatic)"],
        "InternetService": ["Fiber optic", "DSL", "No"],
        "TechSupport": ["No", "Yes", "No"],
        "Churn": [1, 0, 0],
        "customerID": ["1", "2", "3"],
    })
    out = feat_eng(df)
    assert "tenure_bucket" in out.columns
    assert "charges_per_tenure" in out.columns
    assert "contract_payment_interaction" in out.columns
    assert out["is_month_to_month"].tolist() == [1, 0, 0]
    assert out["has_fiber_optic"].tolist() == [1, 0, 0]
    assert out["has_no_support"].tolist() == [1, 0, 0]


def test_get_feature_types():
    df = pd.DataFrame({
        "tenure": [1, 2],
        "MonthlyCharges": [30.0, 70.0],
        "Contract": ["A", "B"],
        "gender": ["Male", "Female"],
        "Churn": [1, 0],
        "customerID": ["1", "2"],
    })
    num, low, high = get_feature_types(df)
    assert "tenure" in num
    assert "MonthlyCharges" in num
    assert "Contract" in low
    assert "gender" in low


def test_prepare_data_shapes():
    df = pd.DataFrame({
        "tenure": list(range(100)),
        "MonthlyCharges": np.random.rand(100) * 100,
        "Contract": np.random.choice(["Month-to-month", "One year"], 100),
        "PaymentMethod": np.random.choice(["Electronic check", "Mailed check"], 100),
        "gender": np.random.choice(["Male", "Female"], 100),
        "Churn": np.random.randint(0, 2, 100),
        "customerID": [str(i) for i in range(100)],
    })
    X_train, X_test, y_train, y_test, preprocessor, num, low, high = prepare_data(df, test_size=0.2)
    assert len(X_train) == 80
    assert len(X_test) == 20
    assert len(y_train) == 80
    assert len(y_test) == 20
