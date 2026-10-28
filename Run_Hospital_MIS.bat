@echo off
chcp 65001 >nul
title Hospital MIS - Portable Launcher
color 0B

echo ============================================================
echo      Hospital Information System (HIS / MIS)
echo           Portable Standalone Edition
echo ============================================================
echo.

where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [+] Node.js detected. Launching portable server...
    node "%~dp0portable-server.js"
    goto end
)

echo [!] Node.js not found. Using native Windows PowerShell engine...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0portable-server.ps1"

:end
pause
