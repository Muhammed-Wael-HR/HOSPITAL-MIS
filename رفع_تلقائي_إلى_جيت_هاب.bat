@echo off
chcp 65001 >nul
title الرفع التلقائي لمشروع المستشفى إلى GitHub
color 0B

echo ============================================================
echo        نظام إدارة المستشفيات (Hospital MIS)
echo           الرفع التلقائي السريع إلى GitHub
echo ============================================================
echo.

set GH_EXE=C:\Users\Emak\AppData\Local\Microsoft\WinGet\Packages\GitHub.cli_Microsoft.Winget.Source_8wekyb3d8bbwe\bin\gh.exe
set GIT_EXE=C:\Users\Emak\AppData\Local\Programs\Git\cmd\git.exe
cd /d "%~dp0"

echo [1/2] فحص الاتصال بحساب GitHub...
"%GH_EXE%" auth status >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [!] أنت غير مسجل الدخول إلى GitHub على الجهاز حالياً.
    echo [+] سيفتح المتصفح الآن تلقائياً...
    echo [+] اضغط على زر (Authorize github) الأخضر لتأكيد الدخول، ثم عد لهذه النافذة:
    echo.
    "%GH_EXE%" auth login --web -h github.com -p https
)

echo.
echo [2/2] جاري إنشاء المستودع على GitHub ورفع كافة الملفات فوراً...
"%GH_EXE%" repo create hospital-mis --public --source=. --remote=origin --push 2>nul

if %ERRORLEVEL% NEQ 0 (
    echo [!] المستودع موجود مسبقاً، جاري دفع وتحديث الملفات إليه...
    "%GIT_EXE%" push -u origin main
)

echo.
echo ============================================================
echo [✓] تم رفع المشروع بنجاح إلى GitHub!
echo ============================================================
echo الآن:
echo 1. افتح موقع vercel.com
echo 2. اضغط Add New Project
echo 3. اختر hospital-mis واضغط Deploy
echo ============================================================
pause
