@echo off
title Nexora - Online Ngrok Launcher
color 0A
cls
echo ========================================================
echo              NEXORA - ONLINE PUBLIC LAUNCHER
echo ========================================================
echo.

:: Ensure current directory is this script's directory (handles spaces)
cd /d "%~dp0"

echo [1/4] Adding Node.js and Python to PATH...
set "PATH=%~dp0..\node-v20.11.1-win-x64;%LOCALAPPDATA%\Programs\Python\Python312;%PATH%"

echo Applying database migrations...
call python "%~dp0backend\manage.py" migrate --noinput

echo [2/4] Starting Backend (Django REST API on port 8000)...
start "Nexora - Django Backend (Port 8000)" /min cmd /k "cd /d ""%~dp0backend"" && python manage.py runserver 127.0.0.1:8000"

echo [3/4] Starting Frontend (React / Vite on port 5173)...
start "Nexora - Vite Frontend (Port 5173)" /min cmd /k "cd /d ""%~dp0frontend"" && npm run dev"

echo [4/4] Starting Ngrok Tunnel (Port 5173)...
start "Nexora - Ngrok Tunnel" /min cmd /k "cd /d ""%~dp0"" && ngrok.exe http 5173"

echo.
echo Connecting and generating public link... (please wait ~5 seconds)
ping -n 6 127.0.0.1 >nul

set "PUBLIC_URL="
for /f "tokens=*" %%A in ('powershell -NoProfile -Command "try { (Invoke-RestMethod http://127.0.0.1:4040/api/tunnels).tunnels[0].public_url } catch {}"') do set "PUBLIC_URL=%%A"

cls
echo ========================================================
echo            NEXORA IS NOW ONLINE WORLDWIDE!
echo ========================================================
echo.
if "%PUBLIC_URL%"=="" (
    echo [NOTE] Ngrok is still initializing.
    echo Please visit http://127.0.0.1:4040 or re-run this script.
    start http://localhost:5173
) else (
    echo   PUBLIC ONLINE LINK : %PUBLIC_URL%
    echo.
    echo   Local Frontend     : http://localhost:5173
    echo   Local Backend      : http://127.0.0.1:8000/api/v1/
    echo ========================================================
    echo.
    echo Opening your online website in your default browser...
    start %PUBLIC_URL%
)

echo.
echo ========================================================
echo   DEMO LOGIN ACCOUNTS:
echo   - Candidate: alex.morgan@example.com   / Candidate2026!
echo   - Recruiter: recruiter@cloudnova.io    / Recruiter2026!
echo   - Admin    : admin@nexora.io           / NexoraAdmin2026!
echo ========================================================
echo.
echo [!] Keep this window open while you want the website online.
echo To turn off the website and stop all servers, double-click STOP_SERVERS.bat.
echo.
pause
