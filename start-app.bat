@echo off
echo Starting Background Removal Application...

:: 启动后端服务
echo Starting backend server...
start cmd /k "cd backend && python app.py"

:: 等待几秒钟确保后端已启动
timeout /t 3 /nobreak > nul

:: 启动前端服务
echo Starting frontend server...
start cmd /k "cd frontend && npm start"

echo Application started!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000