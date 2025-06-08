@echo off
echo Stopping Background Removal Application...

:: 停止在端口5000上运行的后端服务
for /f "tokens=5" %%a in ('netstat -aon ^| find ":5000"') do (
    taskkill /F /PID %%a 2>nul
)

:: 停止在端口3000上运行的前端服务
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3000"') do (
    taskkill /F /PID %%a 2>nul
)

echo Application stopped!
pause