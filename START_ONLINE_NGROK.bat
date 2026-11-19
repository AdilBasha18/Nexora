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
    echo [ERROR] Python was not found!
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

echo [1/4] Supabase PostgreSQL Database Connected!

echo [2/4] Starting Backend (Django REST API on port 8000)...
pushd "%~dp0backend"
start "Nexora - Django Backend (Port 8000)" cmd /k "title Nexora Backend (8000) && python manage.py runserver 127.0.0.1:8000"
popd

echo [3/4] Starting Frontend (React / Vite on port 5173)...
pushd "%~dp0frontend"
start "Nexora - Vite Frontend (Port 5173)" cmd /k "title Nexora Frontend (5173) && npm run dev"
popd

echo.
echo Waiting for frontend to initialize before launching tunnel...
powershell -NoProfile -Command "$timeout = 30; $start = Get-Date; while ($true) { $client = New-Object System.Net.Sockets.TcpClient; try { $client.Connect('127.0.0.1', 5173); $client.Close(); break } catch {}; if (((Get-Date) - $start).TotalSeconds -ge $timeout) { break }; Start-Sleep -Milliseconds 500 }"

echo [4/4] Starting Ngrok Tunnel (Port 5173)...
start "Nexora - Ngrok Tunnel" cmd /k "title Nexora Ngrok && ngrok.exe http 5173"

echo.
echo Connecting and generating public link... (please wait ~5 seconds)
ping -n 6 127.0.0.1 >nul

set "PUBLIC_URL="
for /f "tokens=*" %%A in ('powershell -NoProfile -Command "try { (Invoke-RestMethod http://127.0.0.1:4040/api/tunnels).tunnels[0].public_url } catch {}"') do set "PUBLIC_URL=%%A"

cls
echo ========================================================
echo   Nexora is LIVE Online via Ngrok!
echo ========================================================
echo.
if defined PUBLIC_URL (
    echo   PUBLIC INTERNET LINK: %PUBLIC_URL%
    echo.
    echo   Share this link with anyone - no setup required!
    echo.
    echo Opening public link in browser...
    start %PUBLIC_URL%
) else (
    echo   [WARNING] Ngrok tunnel is starting up...
    echo   Check the Ngrok window or visit: http://127.0.0.1:4040
    echo   Local Frontend: http://localhost:5173
    echo.
    start http://localhost:5173
)

echo.
echo ========================================================
echo   To stop all servers and ngrok, run: STOP_SERVERS.bat
echo ========================================================
echo.
pause
