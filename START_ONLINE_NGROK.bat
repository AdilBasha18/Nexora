@echo off
title Nexora - Online Ngrok Launcher
color 0A
cls
echo ========================================================
echo              NEXORA - ONLINE PUBLIC LAUNCHER
echo ========================================================
echo.

:: Ensure current directory is this script's directory
cd /d "%~dp0"

:: Resolve absolute path to Node.js
for %%I in ("%~dp0..") do set "SCRATCH_DIR=%%~fI"
set "NODE_DIR=%SCRATCH_DIR%\node-v20.11.1-win-x64"

:: Set clean environment PATH
set "PATH=%NODE_DIR%;%LOCALAPPDATA%\Programs\Python\Python312;%USERPROFILE%\AppData\Local\Programs\Python\Python312;%PATH%"

echo [1/4] Applying database migrations...
pushd "%~dp0backend"
call python manage.py migrate --noinput
popd

echo [2/4] Starting Backend (Django REST API on port 8000)...
pushd "%~dp0backend"
start "Nexora - Django Backend (Port 8000)" /min cmd /k "python manage.py runserver 127.0.0.1:8000"
popd

echo [3/4] Starting Frontend (React / Vite on port 5173)...
pushd "%~dp0frontend"
start "Nexora - Vite Frontend (Port 5173)" /min cmd /k "npm run dev"
popd

echo.
echo Waiting for frontend to initialize before launching tunnel...
powershell -NoProfile -Command "$timeout = 30; $start = Get-Date; while (-not (Test-NetConnection -ComputerName 127.0.0.1 -Port 5173 -InformationLevel Quiet)) { if (((Get-Date) - $start).TotalSeconds -ge $timeout) { break }; Start-Sleep -Milliseconds 600 }"

echo [4/4] Starting Ngrok Tunnel (Port 5173)...
start "Nexora - Ngrok Tunnel" /min cmd /k "ngrok.exe http 5173"

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
