[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$gh = "C:\Users\Emak\AppData\Local\Microsoft\WinGet\Packages\GitHub.cli_Microsoft.Winget.Source_8wekyb3d8bbwe\bin\gh.exe"
$git = "C:\Users\Emak\AppData\Local\Programs\Git\cmd\git.exe"

Set-Location "C:\Users\Emak\.gemini\antigravity\scratch\hospital-mis"

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "   Hospital MIS - Automatic GitHub Uploader" -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Cyan

# 1. Check if authenticated
& $gh auth status 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "`n[1/2] GitHub Login Required..." -ForegroundColor Yellow
    Write-Host "[+] Opening browser to authenticate. Click (Authorize github), then return here.`n" -ForegroundColor Green
    & $gh auth login --web -h github.com -p https
} else {
    Write-Host "`n[1/2] GitHub authentication verified." -ForegroundColor Green
}

# 2. Create repo and push
Write-Host "`n[2/2] Uploading project to GitHub repository 'hospital-mis'..." -ForegroundColor Cyan

& $gh repo create hospital-mis --public --source=. --remote=origin --push

if ($LASTEXITCODE -ne 0) {
    Write-Host "`n[!] Repository exists. Pushing latest commits..." -ForegroundColor Yellow
    & $git push -u origin main
}

Write-Host "`n============================================================" -ForegroundColor Green
Write-Host " [+] Project successfully uploaded to GitHub!" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
Write-Host "Next step:" -ForegroundColor Cyan
Write-Host "1. Open vercel.com" -ForegroundColor White
Write-Host "2. Click 'Add New Project'" -ForegroundColor White
Write-Host "3. Import 'hospital-mis' and click Deploy" -ForegroundColor White
Write-Host "============================================================" -ForegroundColor Green