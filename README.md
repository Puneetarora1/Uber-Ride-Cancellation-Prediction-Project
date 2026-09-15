# 🚗 Uber Ride Cancellation Prediction

## 🚗 Project Overview
An end-to-end **Machine Learning project** that predicts whether a customer will cancel an Uber ride before it begins.The project focuses on **imbalanced classification** and covers the complete ML lifecycle — from data preprocessing and feature engineering to model deployment using **FastAPI** and an interactive web frontend.

---

## 🎯 Objective
- Predict customer ride cancellations using booking and ride-related features.
- Handle the highly imbalanced cancellation class effectively.
- Compare multiple classification algorithms.
- Optimize the best-performing model using hyperparameter tuning.
- Deploy the trained model as an interactive web application.

---

## 📊 Dataset
**Source:** Kaggle — Uber Ride Analytics 2024  
**Records:** 150,000 bookings  
**Features:** 21 columns  
**Target:** `target_customer_cancelled`

- `1` → Customer cancelled
- `0` → Not cancelled

**Class Distribution:** ~93% non-cancelled vs ~7% cancelled rides.

---

## 🛠️ Tech Stack
- **Programming:** Python
- **Data Analysis:** Pandas, NumPy
- **Visualization:** Matplotlib, Seaborn
- **Machine Learning:** Scikit-learn, XGBoost
- **Preprocessing:** Pipeline, ColumnTransformer, OneHotEncoder, StandardScaler
- **Model Optimization:** RandomizedSearchCV
- **Final Model:** Random Forest Classifier
- **Model Saving:** Joblib
- **Backend:** FastAPI
- **Frontend:** HTML, CSS, JavaScript
- **Deployment:** GitHub, Render

---

## 📌 Project Workflow
1. Data collection and exploration
2. Data cleaning and missing-value handling
3. Datetime-based feature engineering
4. Feature transformation
5. Class imbalance handling
6. Categorical encoding and numerical scaling
7. Model training and comparison
8. Hyperparameter tuning using `RandomizedSearchCV`
9. Model evaluation using Recall, F1-score, and ROC-AUC
10. Model saving using Joblib
11. FastAPI backend development
12. Interactive frontend development
13. Deployment on Render

---

## 📈 Model Evaluation
I evaluated **Decision Tree, Random Forest, and XGBoost** models using metrics suitable for imbalanced classification.
After model comparison, **Random Forest** performed best for this dataset and was further optimized using `RandomizedSearchCV`.

---

### 🔑 Key Results
- **ROC-AUC:** 96.2%
- **Recall:** Increased from **57.9% → 97.4%**
- **F1-Score:** 43% 
- Hyperparameter tuning significantly improved the model's ability to identify cancelled rides.

The main optimization goal was to **maximize Recall**, ensuring that as many potential customer cancellations as possible were detected.

---

## 🌐 Live Demo

### 🚀 Try the Model Live

👉 **[Uber Ride Cancellation Prediction]** (https://uber-ride-cancellation-prediction-project.onrender.com)

Enter the ride details in the web application to get a real-time prediction of whether the customer is likely to cancel the ride.

## 📷 Project Snapshot
- ![Web Application View](https://github.com/Puneetarora1/Uber-Ride-Cancellation-Prediction-Project/blob/main/Web%20app%20Snapshot.png)

---
```
