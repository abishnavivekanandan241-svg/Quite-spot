@echo off
title QuietSpot 2.0 Launcher
echo ============================================================
echo   Starting QuietSpot 2.0 - Kongu Engineering College
echo ============================================================
echo.
echo [1/2] Launching Flask Backend on Port 5000...
start "QuietSpot 2.0 - Backend (Flask)" cmd /k "cd backend && python run.py"

echo [2/2] Launching Vite React Frontend on Port 5173...
start "QuietSpot 2.0 - Frontend (Vite)" cmd /k "cd frontend && npm run dev"

echo.
echo ============================================================
echo   Both services are starting!
echo   - Web App:     http://localhost:5173
echo   - Backend API: http://127.0.0.1:5000/api/health
echo ============================================================
pause
