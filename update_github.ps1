[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

$git = "C:\Users\Emak\AppData\Local\Programs\Git\cmd\git.exe"
Set-Location "C:\Users\Emak\.gemini\antigravity\scratch\hospital-mis"

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "   Hospital MIS - Push Latest Updates to GitHub & Vercel" -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Cyan

Write-Host "`n[1/2] Saving latest changes..." -ForegroundColor Green
& $git add -A
& $git commit -m "update: sync latest changes and settings" 2>$null

Write-Host "`n[2/2] Pushing updates to GitHub (Muhammed-Wael-HR/HOSPITAL-MIS)..." -ForegroundColor Cyan
& $git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n============================================================" -ForegroundColor Green
    Write-Host " [✓] تم إرسال التحديثات إلى GitHub بنجاح!" -ForegroundColor Green
    Write-Host " سيقوم Vercel بتحديث موقعك أونلاين تلقائياً خلال 30 ثانية!" -ForegroundColor Green
    Write-Host "============================================================" -ForegroundColor Green
} else {
    Write-Host "`n[X] حدث خطأ أثناء إرسال التحديثات." -ForegroundColor Red
}
