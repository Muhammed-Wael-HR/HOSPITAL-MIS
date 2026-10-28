@echo off
title Upload Hospital MIS to GitHub
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0upload_to_github.ps1"
pause
