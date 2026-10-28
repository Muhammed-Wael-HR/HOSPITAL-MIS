@echo off
chcp 65001 >nul
title نظام إدارة معلومات المستشفيات - التشغيل المحمول
color 0B

echo ============================================================
echo      نظام إدارة معلومات المستشفيات المتكامل (HIS / MIS)
echo           النسخة المحمولة للعرض والتقديم الجامعي
echo ============================================================
echo.

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [+] تم اكتشاف بيئة Node.js - جاري تشغيل السيرفر السريع...
    node "%~dp0portable-server.js"
    goto end
)

:: If Node is not installed, fallback to native Windows PowerShell
echo [!] لم يتم العثور على Node.js على هذا الجهاز.
echo [+] جاري استخدام مشغل ويندوز الأصلي المدمج (Native Windows Engine)...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0portable-server.ps1"

:end
pause
