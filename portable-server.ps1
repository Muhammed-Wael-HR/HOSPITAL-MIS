# Hospital MIS - Zero-Dependency Native Windows Portable Server
# Runs using built-in PowerShell on any Windows machine (no Node.js needed!)

$port = 3300
$baseDir = Join-Path $PSScriptRoot "dist"

if (-not (Test-Path $baseDir)) {
    Write-Host "[X] Error: dist folder not found!" -ForegroundColor Red
    Pause
    Exit
}

# Find available port
while ($true) {
    try {
        $listener = New-Object System.Net.HttpListener
        $prefix = "http://localhost:$port/"
        $listener.Prefixes.Add($prefix)
        $listener.Start()
        break
    } catch {
        $port++
    }
}

$url = "http://localhost:$port/"
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "   Hospital MIS / HIS - Portable USB Edition" -ForegroundColor Yellow
Write-Host "   نظام إدارة معلومات المستشفيات - النسخة المحمولة" -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "[+] Running at: $url" -ForegroundColor Green
Write-Host "[+] Opening browser automatically..." -ForegroundColor Green
Write-Host "Press Ctrl + C in this window to stop the server." -ForegroundColor Gray
Write-Host "============================================================" -ForegroundColor Cyan

Start-Process $url

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
    ".woff" = "font/woff"
    ".woff2"= "font/woff2"
    ".ttf"  = "font/ttf"
}

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $relPath = $request.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrEmpty($relPath)) {
            $relPath = "index.html"
        }

        $filePath = Join-Path $baseDir $relPath
        if (-not (Test-Path $filePath -PathType Leaf)) {
            $filePath = Join-Path $baseDir "index.html"
        }

        $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
        $contentType = $mimeTypes[$ext]
        if ([string]::IsNullOrEmpty($contentType)) {
            $contentType = "application/octet-stream"
        }

        $response.ContentType = $contentType
        $response.AddHeader("Cache-Control", "no-cache")

        try {
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } catch {
            $response.StatusCode = 500
        } finally {
            $response.OutputStream.Close()
        }
    }
} finally {
    $listener.Stop()
}
