# Customer Churn Prediction Pipeline

## Problem Statement

Customer churn is one of the most critical metrics for subscription-based businesses, particularly in the telecom industry where the cost of acquiring a new customer far exceeds the cost of retaining an existing one. This project builds an end-to-end machine learning pipeline to predict which customers are at risk of churning, enabling proactive retention campaigns and reducing revenue loss.

## Approach

- **Exploratory Data Analysis (EDA):** Loaded the Telco Customer Churn dataset (~7,000 rows), inspected data quality, analyzed class balance, and visualized churn rates by contract type, tenure, and monthly charges.
- **Preprocessing & Feature Engineering:** Cleaned missing values, encoded categorical variables (one-hot), handled class imbalance, and engineered features including tenure buckets, charges-per-tenure ratio, and contract×payment-method interactions.
- **Model Training:** Trained Logistic Regression, Random Forest, and XGBoost with Stratified 5-Fold cross-validation. Logged Precision, Recall, F1, and ROC-AUC. XGBoost was selected as the default model for its superior SHAP interpretability.
- **Interpretability:** Generated SHAP summary plots and force plots for individual predictions. Provided a business-framed interpretation of the recall-precision trade-off.
- **API:** Built a FastAPI `/predict` endpoint (CORS-enabled) that accepts customer features as JSON and returns churn probability plus the top 3 SHAP drivers. The API also serves the built React frontend.
- **Frontend:** Built with React (Vite + Tailwind + Recharts). Features a customer information form, circular gauge showing churn probability with color-coded risk badges, a progress bar, and a horizontal bar chart of SHAP feature importance. Recharts is code-split into a separate chunk for fast initial load.
- **Packaging:** Includes `requirements.txt`, a Dockerfile, and unit tests for the preprocessing pipeline.

## Model Comparison

| Model | Precision | Recall | F1 | ROC-AUC |
|---|---|---|---|---|
| Logistic Regression | 0.5212 | 0.7956 | 0.6297 | **0.8485** |
| Random Forest | 0.5629 | 0.7068 | 0.6266 | 0.8443 |
| XGBoost | 0.6125 | 0.5179 | 0.5611 | 0.8253 |

*XGBoost is saved as the default model for its superior SHAP interpretability.*

## How to Run Locally

### Prerequisites
- Python 3.11+
- Node.js 18+

### Quick start (one command)
```bat
run_all.bat
```

### Manual steps

```bash
# 1. Install Python dependencies
pip install -r requirements.txt

# 2. Download the dataset
# Download from Kaggle: https://www.kaggle.com/datasets/blastchar/telco-customer-churn
# Place it in: data/WA_Fn-UseC_-Telco-Customer-Churn.csv

# 3. Train the model
python -m src.train

# 4. Build the frontend
cd frontend
npm install
npm run build
cd ..

# 5. Start the server
uvicorn api.main:app --host 127.0.0.1 --port 8000
```

Open **http://localhost:8000** in your browser. The API and frontend are served from the same URL.

### Development mode (with hot-reload)

```bash
# Terminal 1: API
uvicorn api.main:app --reload --host 127.0.0.1 --port 8000

# Terminal 2: Frontend dev server (hot reload at localhost:5173)
cd frontend
npm install
npm run dev
```

## Links

- [Case Study](CASE_STUDY.md)
