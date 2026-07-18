import pandas as pd
import numpy as np


def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()

    df["tenure_bucket"] = pd.cut(
        df["tenure"],
        bins=[-np.inf, 6, 24, 48, np.inf],
        labels=["0-6", "7-24", "25-48", "49+"],
    ).astype(str)

    df["charges_per_tenure"] = np.where(
        df["tenure"] == 0, df["MonthlyCharges"], df["MonthlyCharges"] / df["tenure"]
    )

    df["contract_payment_interaction"] = (
        df["Contract"].astype(str) + "_" + df["PaymentMethod"].astype(str)
    )

    df["is_month_to_month"] = (df["Contract"] == "Month-to-month").astype(int)
    df["has_fiber_optic"] = (df["InternetService"] == "Fiber optic").astype(int)
    df["has_no_support"] = (
        (df["TechSupport"] == "No") & (df["InternetService"] != "No")
    ).astype(int)

    return df
