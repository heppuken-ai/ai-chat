@echo off
REM AI Chat - Deploy Script for Windows (Batch version)
REM Usage: deploy.cmd or "make deploy" alternative

echo.
echo 🚀 Deploying AI Chat to Google Cloud Run...
echo.

powershell -ExecutionPolicy Bypass -File "%~dp0deploy.ps1"
