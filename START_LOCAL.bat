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

:: Resolve parent directory safely without quote/space issues
pushd ..
set "SCRATCH_DIR=%CD%"
popd

:: Setup environment PATH
set "NODE_DIR=%SCRATCH_DIR%\node-v20.11.1-win-x64"
set "PATH=%NODE_DIR%;%SCRATCH_DIR%;%LOCALAPPDATA%\Programs\Python\Python312;%LOCALAPPDATA%\Programs\Python\Python312\Scripts;%USERPROFILE%\AppData\Local\Programs\Python\Python312;%USERPROFILE%\AppData\Local\Programs\Python\Python312\Scripts;%PATH%"

:: Verify Python
where python >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Python was not found in PATH or standard install locations!
    echo Please install Python 3.12 or ensure it is in your system PATH.
    pause
    exit /b 1
)

:: Verify Node/NPM
where npm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js / NPM was not found!
    echo Checked: %NODE_DIR%
    pause
    exit /b 1
)

echo [1/3] Supabase PostgreSQL Database Connected!

echo [2/3] Starting Backend (Django REST API on port 8000)...
pushd "%~dp0backend"
start "Nexora - Django Backend (Port 8000)" cmd /k "title Nexora Backend (8000) && python manage.py runserver 127.0.0.1:8000"
popd

echo [3/3] Starting Frontend (React / Vite on port 5173)...
pushd "%~dp0frontend"
start "Nexora - Vite Frontend (Port 5173)" cmd /k "title Nexora Frontend (5173) && npm run dev"
popd

echo.
echo Waiting for frontend and backend services to initialize...
powershell -NoProfile -Command "$timeout = 30; $start = Get-Date; while ($true) { $client = New-Object System.Net.Sockets.TcpClient; try { $client.Connect('127.0.0.1', 5173); $client.Close(); break } catch {}; if (((Get-Date) - $start).TotalSeconds -ge $timeout) { break }; Start-Sleep -Milliseconds 500 }"

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
echo [INFO] You can minimize this window.
echo To stop all servers anytime, double-click STOP_SERVERS.bat.
echo.
pause
