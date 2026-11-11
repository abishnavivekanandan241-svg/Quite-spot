@echo off
title QuietSpot Launcher
echo ============================================================
echo   Starting QuietSpot - Kongu Engineering College
echo ============================================================
echo.
echo [1/2] Launching Flask Backend on Port 5000...
start "QuietSpot - Backend (Flask)" cmd /k "cd backend && python run.py"

echo [2/2] Launching Vite React Frontend on Port 5173...
start "QuietSpot - Frontend (Vite)" cmd /k "cd frontend && npm run dev"

echo.
echo ============================================================
echo   Both services are starting!
echo   - Web App:     http://localhost:5173
echo   - Backend API: http://127.0.0.1:5000/api/health
echo ============================================================
pause
