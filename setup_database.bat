@echo off
echo ===================================================
echo      E-Commerce Database Setup Script
echo ===================================================
echo.
echo 1. Checking if MySQL (XAMPP) is running...

:check_mysql
c:\xampp\mysql\bin\mysql.exe -u root -e "SELECT 1" >nul 2>&1
if errorlevel 1 (
    echo [ERROR] MySQL is NOT running.
    echo Please open XAMPP Control Panel and start MySQL.
    echo Waiting for MySQL to start...
    timeout /t 5 >nul
    goto check_mysql
)

echo [SUCCESS] MySQL is running!
echo.
echo 2. Creating Database 'ecommerce'...
c:\xampp\mysql\bin\mysql.exe -u root -e "CREATE DATABASE IF NOT EXISTS ecommerce;"

echo.
echo 3. Importing Tables from schema.sql...
c:\xampp\mysql\bin\mysql.exe -u root ecommerce < database\schema.sql

if errorlevel 0 (
    echo.
    echo [SUCCESS] Database setup complete! 
    echo You can now run 'npm run dev' in backend and frontend folders.
) else (
    echo.
    echo [ERROR] Something went wrong during import.
)
echo.
pause
