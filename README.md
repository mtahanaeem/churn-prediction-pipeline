<div align="center">

# 📊 Customer Churn Prediction Pipeline

**End-to-End ML Pipeline for Telecom Customer Churn Prediction**

[![Python](https://img.shields.io/badge/Python-3.11-3776AB?logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![XGBoost](https://img.shields.io/badge/XGBoost-2.1-EC1C24?logo=xgboost&logoColor=white)](https://xgboost.readthedocs.io)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-1.5-F7931E?logo=scikit-learn&logoColor=white)](https://scikit-learn.org)
[![SHAP](https://img.shields.io/badge/SHAP-0.45-2C3E50?logo=python&logoColor=white)](https://shap.readthedocs.io)
[![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)](https://docker.com)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

</div>

---

## 📋 Overview

Customer churn is a critical metric for subscription-based businesses, where retaining existing customers is significantly more cost-effective than acquiring new ones. This project builds an end-to-end machine learning pipeline that predicts which telecom customers are at risk of churning, enabling proactive retention campaigns.

The pipeline compares **Logistic Regression**, **Random Forest**, and **XGBoost** classifiers using Stratified 5-Fold cross-validation, selects the best model, and serves predictions through a **FastAPI** endpoint with a **React** dashboard for interactive use.

---

## ✨ Features

- **🔍 Exploratory Data Analysis** — Churn patterns by contract type, tenure, and monthly charges
- **🧹 Automated Preprocessing** — Missing value imputation, one-hot encoding, SMOTE for class imbalance
- **🏗️ Feature Engineering** — Tenure buckets, charges-per-tenure ratio, contract×payment interactions, fiber optic & support indicators
- **🤖 Multi-Model Training** — Logistic Regression, Random Forest, XGBoost with Stratified 5-Fold CV
- **📊 SHAP Interpretability** — Global summary plots + per-prediction feature importance with top-3 drivers
- **⚡ FastAPI Backend** — CORS-enabled `/predict` endpoint serving churn probability + SHAP explanations
- **🎨 React Dashboard** — Customer form, circular risk gauge, progress bar, and SHAP bar chart (code-split for performance)
- **🐳 Docker Support** — Containerized API with production-ready setup

---

## 🗂️ Project Structure

```
churn-prediction-pipeline/
├── ⚙️ api/
│   ├── main.py                    # FastAPI app with /predict & /health endpoints
│   └── __init__.py
│
├── 📦 data/
│   └── WA_Fn-UseC_-Telco-Customer-Churn.csv   # Kaggle dataset (gitignored)
│
├── 🎨 frontend/
│   ├── src/
│   │   ├── App.jsx                # Main app component
│   │   ├── api.js                 # API fetch wrapper
│   │   ├── components/
│   │   │   ├── CustomerForm.jsx   # Customer input form
│   │   │   ├── PredictionResult.jsx  # Churn gauge + risk badge
│   │   │   └── ShapChart.jsx      # SHAP feature importance chart
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── 🧠 models/
│   ├── best_model.pkl             # Trained model (gitignored)
│   ├── preprocessor.pkl           # Preprocessor (gitignored)
│   ├── cv_results.md              # Cross-validation results table
│   └── shap_*.png                 # SHAP explanation plots
│
├── 📓 notebooks/
│   └── 01_eda.ipynb               # Exploratory Data Analysis
│
├── 🐍 src/
│   ├── preprocessing.py           # Data loading, cleaning, encoding
│   ├── features.py                # Feature engineering
│   ├── train.py                   # Model training + comparison
│   ├── evaluate.py                # Evaluation + SHAP explanations
│   └── predict.py                 # Singleton inference (ChurnPredictor)
│
├── 🧪 tests/
│   └── test_preprocessing.py      # Unit tests for preprocessing
│
├── 🐳 Dockerfile                  # Python 3.11-slim container
├── 📄 requirements.txt            # Python dependencies
├── 🏃 run_all.bat                 # One-click pipeline launcher
└── 📖 README.md
```

---

## 🚀 Quick Start

### Prerequisites

| Requirement | Version | Download |
|:------------|:-------:|:---------|
| Python | 3.11+ | [python.org](https://python.org) |
| Node.js | 18+ | [nodejs.org](https://nodejs.org) |

### One-Click Start (Windows)

```bat
run_all.bat
```

### Manual Setup

```bash
# 1. Clone the repository
git clone https://github.com/mtahanaeem/churn-prediction-pipeline.git
cd churn-prediction-pipeline

# 2. Install Python dependencies
pip install -r requirements.txt

# 3. Download the dataset
# Place Kaggle Telco Customer Churn CSV in: data/WA_Fn-UseC_-Telco-Customer-Churn.csv

# 4. Train the model
python -m src.train

# 5. Build the frontend
cd frontend
npm install
npm run build
cd ..

# 6. Start the server
uvicorn api.main:app --host 127.0.0.1 --port 8000
```

Open **http://localhost:8000** in your browser. The API and frontend are served from the same URL.

### Docker

```bash
docker build -t churn-pipeline .
docker run -p 8000:8000 churn-pipeline
```

---

## 🧠 How It Works

```
Raw Data (CSV) → Feature Engineering → Preprocessing → Model Training → SHAP Analysis
                                                                              │
                                                                              ▼
                      React Dashboard ← FastAPI /predict ← ChurnPredictor Singleton
```

| Step | Component | What It Does |
|:----:|:----------|:-------------|
| 1 | **EDA** | Analyze churn distribution, correlations, and patterns by customer attributes |
| 2 | **Feature Engineering** | Create tenure buckets, charges-per-tenure ratio, contract×payment interactions, fiber optic & no-support flags |
| 3 | **Preprocessing** | Impute missing values, standard-scale numerical features, one-hot encode categoricals |
| 4 | **Training** | Compare Logistic Regression, Random Forest, XGBoost via Stratified 5-Fold CV |
| 5 | **Selection** | Best model saved as `best_model.pkl` with feature names for inference |
| 6 | **SHAP** | TreeExplainer generates global summary plots + per-prediction top-3 feature drivers |
| 7 | **API** | FastAPI endpoint accepts customer JSON → returns churn probability + SHAP values |
| 8 | **Frontend** | React form → circular gauge (color-coded) → SHAP bar chart |

---

## 📊 Model Performance

| Model | Precision | Recall | F1-Score | ROC-AUC |
|:------|:---------:|:------:|:--------:|:-------:|
| Logistic Regression | 0.5212 | 0.7956 | 0.6297 | **0.8485** |
| Random Forest | 0.5629 | 0.7068 | 0.6266 | 0.8443 |
| XGBoost | 0.6125 | 0.5179 | 0.5611 | 0.8253 |

*XGBoost is saved as the default model for superior SHAP interpretability (TreeExplainer).*

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|:------:|:---------|:------------|
| `GET` | `/health` | Health check |
| `POST` | `/predict` | Predict churn probability + top-3 SHAP drivers |
| `GET` | `/` | Serves React frontend (if built) |

### Example Request

```json
{
  "gender": "Male",
  "SeniorCitizen": 0,
  "Partner": "Yes",
  "Dependents": "No",
  "tenure": 72,
  "PhoneService": "Yes",
  "MultipleLines": "No",
  "InternetService": "Fiber optic",
  "OnlineSecurity": "No",
  "OnlineBackup": "Yes",
  "DeviceProtection": "No",
  "TechSupport": "No",
  "StreamingTV": "Yes",
  "StreamingMovies": "Yes",
  "Contract": "Month-to-month",
  "PaperlessBilling": "Yes",
  "PaymentMethod": "Electronic check",
  "MonthlyCharges": 108.45,
  "TotalCharges": 7807.2
}
```

### Example Response

```json
{
  "churn_probability": 0.7321,
  "prediction": 1,
  "top_features": [
    {"feature": "Contract_Month-to-month", "shap_value": 0.2841},
    {"feature": "tenure", "shap_value": -0.1523},
    {"feature": "InternetService_Fiber optic", "shap_value": 0.0987}
  ]
}
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|:------|:-----------|
| **Frontend** | React 18, Vite 5, Tailwind CSS 3, Recharts 2 |
| **Backend API** | Python 3.11, FastAPI 0.111, Uvicorn |
| **ML Models** | scikit-learn 1.5, XGBoost 2.1, imbalanced-learn (SMOTE) |
| **Interpretability** | SHAP 0.45 (TreeExplainer) |
| **Data Processing** | Pandas 2.2, NumPy 1.26 |
| **Containerization** | Docker (python:3.11-slim) |
| **Testing** | pytest 8.3 |

---

## 🔧 Troubleshooting

| Issue | Solution |
|:------|:---------|
| Model file not found | Run `python -m src.train` to train and save the model |
| Frontend not loading | Run `cd frontend && npm install && npm run build` |
| "No module named src" | Ensure you're in the project root directory |
| Port 8000 in use | Change port: `uvicorn api.main:app --host 127.0.0.1 --port 8001` |
| Docker build slow | Add a `.dockerignore` to exclude `node_modules/`, `data/*.csv`, `__pycache__/` |

---

## 👥 Author

<div align="center">

**Muhammad Taha Naeem** — Data Science | Python | Big Data | Blockchain

[![GitHub](https://img.shields.io/badge/GitHub-mtahanaeem-181717?logo=github)](https://github.com/mtahanaeem)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?logo=linkedin)](https://linkedin.com/in/mtahanaeem)

**If you find this project useful, consider giving it a ⭐!**

</div>
