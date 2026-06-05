@echo off
setlocal
cd /d "%~dp0"

set "PORT=4173"
set "PYTHON_EXE=C:\Users\Tam\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe"

if not exist "%PYTHON_EXE%" (
  set "PYTHON_EXE=python"
)

echo Portfolio dang chay tai: http://127.0.0.1:%PORT%/index.html
echo Dong cua so nay neu muon tat server.
start "" cmd /c "timeout /t 2 /nobreak >nul & start "" http://127.0.0.1:%PORT%/index.html"
"%PYTHON_EXE%" -m http.server %PORT% --bind 127.0.0.1
