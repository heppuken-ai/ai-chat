# AI Chat - Deploy Script for Windows
# Usage: .\deploy.ps1

Write-Host "🚀 Deploying AI Chat to Google Cloud Run..." -ForegroundColor Cyan

# Load environment variables from .env file
if (Test-Path ".env") {
    Write-Host "📝 Loading environment variables from .env file..." -ForegroundColor Yellow
    Get-Content .env | ForEach-Object {
        if ($_ -match '^([^=]+)=(.*)$') {
            $name = $matches[1]
            $value = $matches[2]
            Set-Item -Path "env:$name" -Value $value
        }
    }
} else {
    Write-Host "⚠️  .env file not found!" -ForegroundColor Red
    exit 1
}

# Check required environment variables
if (-not $env:ANTHROPIC_API_KEY) {
    Write-Host "❌ ANTHROPIC_API_KEY is not set!" -ForegroundColor Red
    exit 1
}

if (-not $env:DATABASE_URL) {
    Write-Host "❌ DATABASE_URL is not set!" -ForegroundColor Red
    exit 1
}

# Deploy to Cloud Run
Write-Host "☁️  Deploying to Cloud Run..." -ForegroundColor Green

$gcloudPath = "C:\Users\heppu\AppData\Local\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd"

$output = & $gcloudPath run deploy ai-chat `
    --source . `
    --region asia-northeast1 `
    --platform managed `
    --allow-unauthenticated `
    --project ai-chat-486213 `
    --set-env-vars "ANTHROPIC_API_KEY=$env:ANTHROPIC_API_KEY,DATABASE_URL=$env:DATABASE_URL" 2>&1

# Check if deployment was successful by looking for success message
if ($output -match "has been deployed and is serving") {
    Write-Host "✅ Deployment successful!" -ForegroundColor Green
    Write-Host "🌐 Service URL: https://ai-chat-60133925086.asia-northeast1.run.app" -ForegroundColor Cyan
    exit 0
} else {
    Write-Host "❌ Deployment failed!" -ForegroundColor Red
    Write-Host $output
    exit 1
}
