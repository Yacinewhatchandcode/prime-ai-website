@echo off
echo [Deprecated] This script force-pushed dist to gh-pages and is disabled.
echo Use the guarded GitHub Actions release instead: docs\STATIC_RELEASE.md
echo   gh workflow run prime-ai-release.yml --ref main -f mode=dry-run -f source_sha=^<SHA^>
exit /b 1
