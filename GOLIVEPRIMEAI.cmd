@echo off
cd /d "%~dp0"
echo 🚀 [Sovereign QA] Running Build...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ [Error] Build failed. Deployment aborted.
    pause
    exit /b %errorlevel%
)
echo ✅ [Sovereign QA] Build Success!
echo 🚀 [Sovereign Fleet] Pushing to Vercel Production...
call vercel --prod --yes --force
echo ✅ [Sovereign Fleet] Deployment Complete!
pause
