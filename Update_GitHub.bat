@echo off
title Update Hospital MIS on GitHub & Vercel
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0update_github.ps1"
pause
