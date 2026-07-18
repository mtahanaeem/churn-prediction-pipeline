# Case Study: Reducing Telecom Churn with Predictive ML

## Executive Summary

Telecom companies lose an estimated $2,000+ per lost customer due to acquisition costs and lifetime value. This project demonstrates how a data-driven churn prediction model can identify at-risk customers before they leave, enabling targeted retention campaigns that maximize ROI.

## Data & Methodology

We used the **Telco Customer Churn** dataset (7,043 customers, 21 features) from Kaggle. Key steps included:

1. **Data Cleaning:** `TotalCharges` contained 11 blank values (new customers with 0 tenure); these were imputed with 0 and cast to numeric.
2. **EDA Insights:** Month-to-month contracts showed ~45% churn vs. ~10% for two-year contracts. Fiber optic users churned more than DSL users, possibly due to higher prices or service issues.
3. **Feature Engineering:** Created tenure buckets, a `charges_per_tenure` ratio, and a contract×payment-method interaction to capture complex behavioral patterns.
4. **Model Training:** Compared Logistic Regression, Random Forest, and XGBoost using Stratified 5-Fold CV. XGBoost achieved the highest ROC-AUC (~0.88).
5. **Interpretability:** SHAP revealed that `Contract`, `tenure`, and `MonthlyCharges` were the top global drivers. For individual predictions, `TechSupport` and `PaperlessBilling` frequently appeared as local drivers.

## Business Impact

- **Recall Trade-off:** Increasing recall from ~63% to ~73% would catch an additional ~700 churners in a 7,000-customer base. The precision drop (from ~72% to ~65%) translates to ~35 more false positives per 1,000 customers flagged.
- **Cost-Benefit:** If a retention offer costs $50 and saves a customer worth $1,000 in lifetime value, even a 50% precision rate yields a net positive ROI.
- **Actionability:** The top SHAP drivers for any given customer are surfaced directly in the prediction response, allowing retention teams to tailor outreach (e.g., offer tech support discounts to customers flagged by `TechSupport`).

## Deployment

A FastAPI backend serves predictions with sub-second latency. The React frontend provides an intuitive interface for customer service reps to input customer data and immediately see churn probability and explanation drivers.

## Conclusion

Predictive churn modeling is not just a data science exercise—it is a direct lever for revenue protection. By combining strong model performance (ROC-AUC ~0.88) with explainable AI (SHAP), this pipeline empowers business stakeholders to act confidently on ML outputs.
