@echo off
setlocal
cd /d "%~dp0"
title ATELIER - Khoi dong website
where node >nul 2>nul
if errorlevel 1 (
  echo Chua cai Node.js. Hay cai Node.js va thu lai.
  pause
  exit /b 1
)
node scripts\launch.cjs
if errorlevel 1 pause
