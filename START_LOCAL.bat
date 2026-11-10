@echo off
title Nexora - Local Launcher
color 0B
cls
echo ========================================================
echo               NEXORA - LOCAL DEVELOPMENT LAUNCHER
echo ========================================================
echo.

:: Ensure current directory is this script's directory
cd /d "%~dp0"

:: Resolve absolute path to Node.js
for %%I in ("%~dp0..") do set "SCRATCH_DIR=%%~fI"
set "NODE_DIR=%SCRATCH_DIR%\node-v20.11.1-win-x64"

:: Set clean environment PATH
set "PATH=%NODE_DIR%;%LOCALAPPDATA%\Programs\Python\Python312;%USERPROFILE%\AppData\Local\Programs\Python\Python312;%PATH%"

echo [1/3] Applying database migrations...
pushd "%~dp0backend"
call python manage.py migrate --noinput
popd

echo [2/3] Starting Backend (Django REST API on port 8000)...
pushd "%~dp0backend"
start "Nexora - Django Backend (Port 8000)" /min cmd /k "python manage.py runserver 127.0.0.1:8000"
popd

echo [3/3] Starting Frontend (React / Vite on port 5173)...
pushd "%~dp0frontend"
start "Nexora - Vite Frontend (Port 5173)" /min cmd /k "npm run dev"
popd

echo.
echo Waiting for frontend and backend services to initialize...
powershell -NoProfile -Command "$timeout = 30; $start = Get-Date; while (-not (Test-NetConnection -ComputerName 127.0.0.1 -Port 5173 -InformationLevel Quiet)) { if (((Get-Date) - $start).TotalSeconds -ge $timeout) { break }; Start-Sleep -Milliseconds 600 }"

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
