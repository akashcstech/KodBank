@echo off
echo === Login with username ===
curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d "{\"username\":\"akash\",\"password\":\"123456\"}"
echo.
echo.
echo === Login with email ===
curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d "{\"username\":\"akash@test.com\",\"password\":\"123456\"}"
echo.
