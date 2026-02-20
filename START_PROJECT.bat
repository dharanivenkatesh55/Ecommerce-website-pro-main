@echo off
echo ==========================================
echo   ECOMPRO - STARTING ALL SERVICES
echo ==========================================

echo [1/3] Checking MySQL connection...
c:\xampp\mysql\bin\mysqladmin.exe -u root ping >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] MySQL is not running! Please start MySQL in XAMPP first.
    pause
    exit
)
echo [OK] MySQL is active.

echo [2/3] Starting Backend Server (Port 5000)...
start /B cmd /c "cd backend && npm run dev"

echo [3/3] Starting Frontend Website (Vite)...
start /B cmd /c "cd frontend && npm run dev"

echo ==========================================
echo   SERVICES ARE STARTING!
echo   ----------------------------------
echo   Website: http://localhost:5173
echo   API:     http://localhost:5000
echo ==========================================
echo Press any key to stop all services (CTRL+C)
pause >nul
