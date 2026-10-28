@echo off
chcp 65001 >nul
title رفع المشروع إلى GitHub
color 0A

echo ============================================================
echo          أداة الرفع السريع إلى GitHub - Hospital MIS
echo ============================================================
echo.
echo 1. تأكد من إنشاء مستودع جديد (New Repository) فارغ على حسابك في GitHub
echo 2. انسخ رابط المستودع (مثال: https://github.com/your-username/hospital-mis.git)
echo.
set /p REPO_URL="ضع رابط المستودع هنا ثم اضغط Enter: "

if "%REPO_URL%"=="" (
    echo [X] لم يتم إدخال الرابط. تم الإلغاء.
    pause
    exit /b
)

set GIT_EXE=C:\Users\Emak\AppData\Local\Programs\Git\cmd\git.exe

echo.
echo [+] جاري تهيئة الرابط البعيد (Remote Origin)...
"%GIT_EXE%" remote remove origin 2>nul
"%GIT_EXE%" remote add origin %REPO_URL%

echo [+] جاري رفع الملفات إلى فرع main...
"%GIT_EXE%" branch -M main
"%GIT_EXE%" push -u origin main

echo.
if %ERRORLEVEL% EQU 0 (
    echo ============================================================
    echo [✓] تم رفع المشروع بنجاح إلى GitHub!
    echo الآن يمكنك فتح Vercel وعمل Import للمشروع وسيتم نشره أونلاين فوراً.
    echo ============================================================
) else (
    echo [X] حدث خطأ أثناء الرفع. تأكد من صحة الرابط ومن تسجيل دخولك إلى GitHub.
)

pause
