# Build Spec: End-to-End Churn Prediction Pipeline

> Give this file to an AI coding assistant (Claude Code, Cursor, etc.) as the project brief. It describes exactly what to build, in what order, and what "done" looks like.

## Context
Build a complete, portfolio-ready machine learning project for a Data Science job application. The project must demonstrate the full ML lifecycle: EDA, feature engineering, model comparison, interpretability, and deployment — not just a single notebook.

## Dataset
Use the **Telco Customer Churn** dataset (public, available on Kaggle: `blastchar/telco-customer-churn`). It has ~7,000 rows, customer demographics, account info, and a binary `Churn` label.

## Tech Stack
Python 3.11, pandas, scikit-learn, XGBoost, SHAP, FastAPI (backend), React + Vite + Tailwind + Recharts (frontend), Docker (optional)

## Required Project Structure
```
churn-prediction-pipeline/
├── data/                  # raw + processed data (gitignored except sample)
├── notebooks/
│   └── 01_eda.ipynb
├── src/
│   ├── preprocessing.py   # cleaning, encoding, imbalance handling
│   ├── features.py        # feature engineering functions
│   ├── train.py           # trains and compares models, saves best one
│   ├── evaluate.py         # metrics + SHAP explanations
│   └── predict.py         # loads saved model, runs inference
├── api/
│   └── main.py            # FastAPI app exposing /predict endpoint (CORS enabled for frontend)
├── frontend/               # React app (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── CustomerForm.jsx     # inputs for customer features
│   │   │   ├── PredictionResult.jsx # churn probability + risk badge
│   │   │   └── ShapChart.jsx        # bar chart of top SHAP drivers (Recharts)
│   │   ├── api.js          # fetch wrapper calling the FastAPI /predict endpoint
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── models/                # saved model artifacts (.pkl or .json)
├── tests/
│   └── test_preprocessing.py
├── requirements.txt
├── Dockerfile
└── README.md
```

## Build Order (do these in sequence)

1. **Data ingestion + EDA** (`notebooks/01_eda.ipynb`)
   - Load data, check nulls, dtypes, class balance
   - Plot churn rate by contract type, tenure, monthly charges
   - Summarize findings in markdown cells

2. **Preprocessing & feature engineering** (`src/preprocessing.py`, `src/features.py`)
   - Encode categoricals (one-hot for low-cardinality, target encoding for high-cardinality)
   - Handle class imbalance with SMOTE or `class_weight='balanced'`
   - Engineer features: tenure buckets, charges-per-month-of-tenure ratio, contract×payment-method interaction

3. **Model training** (`src/train.py`)
   - Train Logistic Regression (baseline), Random Forest, and XGBoost
   - Use Stratified K-Fold cross-validation
   - Log Precision, Recall, F1, ROC-AUC for each model to a results table
   - Save the best-performing model to `models/`

4. **Interpretation** (`src/evaluate.py`)
   - Generate SHAP summary plot (global feature importance)
   - Generate SHAP force plot for 2-3 individual predictions
   - Write a short business-framed interpretation: e.g. "increasing recall by X% catches Y more churners at the cost of Z more false positives"

5. **API** (`api/main.py`)
   - FastAPI app with a `/predict` POST endpoint accepting customer features as JSON, returning churn probability + top 3 SHAP drivers

6. **Frontend** (`frontend/`)
   - Scaffold with Vite (`npm create vite@latest frontend -- --template react`) + Tailwind
   - `CustomerForm.jsx`: form inputs for key customer features (tenure, contract type, monthly charges, etc.)
   - `api.js`: calls the FastAPI `/predict` endpoint with form data, returns probability + SHAP values
   - `PredictionResult.jsx`: displays churn probability as a percentage with a color-coded risk badge (low/medium/high)
   - `ShapChart.jsx`: horizontal bar chart (Recharts) of the top 3-5 SHAP feature contributions for that prediction
   - `App.jsx`: wires the form → API call → result + chart together, with loading and error states

7. **Packaging**
   - `requirements.txt` with pinned versions
   - `Dockerfile` that runs the FastAPI app
   - Basic unit test for the preprocessing pipeline

8. **README.md** must include:
   - Problem statement (1 paragraph)
   - Approach summary (bullet points, one per step above)
   - Model comparison table with metrics
   - How to run locally (`pip install -r requirements.txt`, `uvicorn api.main:app --reload`, then `cd frontend && npm install && npm run dev`)
   - Link to a written case study (can be a separate `CASE_STUDY.md`)

## Definition of Done
- All models trained and compared in a results table
- Best model saved and loaded correctly by the API
- React frontend runs end-to-end: form submission → API call → prediction + SHAP chart displayed
- README is complete enough that a stranger can run the project in under 5 minutes
