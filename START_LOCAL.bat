@echo off
title Nexora - Local Launcher
color 0B
cls
echo ========================================================
echo               NEXORA - LOCAL DEVELOPMENT LAUNCHER
echo ========================================================
echo.

:: Ensure current directory is this script's directory (handles spaces)
cd /d "%~dp0"

echo [1/3] Adding Node.js and Python to PATH...
set "PATH=%~dp0..\node-v20.11.1-win-x64;C:\Users\SHAIK ADIL BASHA\AppData\Local\Programs\Python\Python312;%PATH%"

echo [2/3] Starting Backend (Django REST API on port 8000)...
start "Nexora - Django Backend (Port 8000)" /min cmd /k "cd /d ""%~dp0backend"" && python manage.py runserver 127.0.0.1:8000"

echo [3/3] Starting Frontend (React / Vite on port 5173)...
start "Nexora - Vite Frontend (Port 5173)" /min cmd /k "cd /d ""%~dp0frontend"" && npm run dev"

echo.
echo Waiting 5 seconds for services to initialize...
ping -n 6 127.0.0.1 >nul

echo.
echo ========================================================
echo   Nexora is ONLINE locally!
echo   Frontend : http://localhost:5173
echo   Backend  : http://127.0.0.1:8000/api/v1/
echo ========================================================
echo.
echo Opening browser...
start http://localhost:5173

echo.
echo [INFO] Keep this window open or close it when done.
echo To stop all servers, double-click STOP_SERVERS.bat.
echo.
pause
