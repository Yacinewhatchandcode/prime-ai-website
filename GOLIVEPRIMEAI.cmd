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
echo 🚀 [Sovereign Fleet] Deploying to GitHub Pages...

cd dist
copy index.html 404.html
type nul > .nojekyll
git init
git checkout -b main
git add -A
git commit -m "Deploy to GitHub Pages"
git push -f https://github.com/Yacinewhatchandcode/prime-ai-website.git main:gh-pages

echo ✅ [Sovereign Fleet] Deployment Complete!
pause
