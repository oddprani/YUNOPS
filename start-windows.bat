@echo off
echo ===================================================
echo   YunOps AI DevOps Dashboard - Windows Setup
echo ===================================================
echo.
echo Checking for Node.js...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed! 
    echo Please install it from https://nodejs.org/
    pause
    exit /b
)

echo [1/3] Installing dependencies...
call npm install

echo [2/3] Building the application...
call npm run build

echo [3/3] Starting the production server...
echo The dashboard will be available at http://localhost:3000
echo.
start http://localhost:3000
call npm start

pause
