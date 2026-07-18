@echo off
setlocal enabledelayedexpansion
cls

echo =============================================
echo  Churn Prediction Pipeline - Full Run
echo =============================================
echo.

set PROJECT_DIR=%~dp0
cd /d "%PROJECT_DIR%"

echo Killing any old server processes...
taskkill /f /im python.exe >nul 2>&1
taskkill /f /im node.exe >nul 2>&1
timeout /t 2 /nobreak >nul
echo.

echo [1/6] Running unit tests...
python -m pytest tests\ -v
if %ERRORLEVEL% NEQ 0 (
    echo WARNING: Some tests failed, continuing anyway...
)
echo.

echo [2/6] Installing Python dependencies...
pip install -r requirements.txt -q
echo.

echo [3/6] Training models...
python -m src.train
echo.

echo [4/6] Generating SHAP evaluation plots...
python -c "import sys, os; sys.path.insert(0, '.'); from src.preprocessing import load_data; from src.features import engineer_features; from src.evaluate import load_model_and_features, evaluate_model, generate_shap_explanations, business_interpretation; from sklearn.model_selection import train_test_split; df = load_data('data/WA_Fn-UseC_-Telco-Customer-Churn.csv'); df = engineer_features(df); X = df.drop(columns=['Churn', 'customerID'], errors='ignore'); y = df['Churn']; _, X_test, _, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y); pipeline, fn = load_model_and_features(); metrics, cm, report = evaluate_model(X_test, y_test, pipeline, fn); generate_shap_explanations(pipeline, X_test, fn); business_interpretation(metrics)"
echo.

echo [5/6] Building frontend...
cd frontend
call npm install 2>nul
call npx vite build
cd ..
echo.

echo [6/6] Starting server...
start "Churn API" cmd /c "uvicorn api.main:app --host 127.0.0.1 --port 8000"

echo Waiting for server to respond...
set SERVER_READY=0
for /l %%i in (1,1,10) do (
    timeout /t 1 /nobreak >nul
    curl -s http://127.0.0.1:8000/health >nul 2>&1
    if !ERRORLEVEL! EQU 0 (
        set SERVER_READY=1
        goto :server_ready
    )
)
:server_ready

if %SERVER_READY% EQU 1 (
    echo Server is running!
) else (
    echo WARNING: Server might not be ready yet, trying anyway...
)

echo Opening browser...
start chrome "http://localhost:8000" 2>nul || start msedge "http://localhost:8000" 2>nul || start "" "http://localhost:8000"

echo.
echo =============================================
echo  All steps completed!
echo  Open: http://localhost:8000
echo =============================================
echo.
echo Press any key to stop the server...
pause >nul

echo Shutting down...
taskkill /f /im python.exe >nul 2>&1
echo Done.
