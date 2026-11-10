@echo off
title Nexora - Server Shutdown
color 0C
cls
echo ========================================================
echo               NEXORA - SERVER SHUTDOWN
echo ========================================================
echo.
echo Stopping Ngrok tunnel...
taskkill /F /IM ngrok.exe /T 2>nul

echo Stopping Django backend and Vite frontend...
powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort 8000, 5173 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }"

echo.
echo ========================================================
echo   All Nexora servers and tunnels have been stopped.
echo ========================================================
echo.
ping -n 3 127.0.0.1 >nul
