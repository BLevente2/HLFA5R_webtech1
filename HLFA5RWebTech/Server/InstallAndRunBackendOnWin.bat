@echo off
setlocal

cd /d "%~dp0"

echo ==========================================
echo   Node.js projekt indito szkript
echo ==========================================
echo.

where node >nul 2>&1
if errorlevel 1 goto CheckAdmin
where npm >nul 2>&1
if errorlevel 1 goto CheckAdmin

echo Node.js es npm mar telepitve van.
goto AfterInstall

:CheckAdmin
echo Node.js vagy az npm nem erheto el.
echo.

net session >nul 2>&1
if errorlevel 1 (
    echo A szkript nem rendszergazdakent fut, ezert nem tud Node.js-t telepiteni.
    echo Telepitse a Node.js-t kezzel a https://nodejs.org/ oldalrol,
    echo majd futtassa ujra ezt a fajlt rendszergazdakent.
    goto EndError
)

echo Rendszergazdai jogosultsag rendben.
echo Winget ellenorzese...

where winget >nul 2>&1
if errorlevel 1 (
    echo A winget parancs nem erheto el ezen a gepen.
    echo Telepitse a Node.js-t kezzel a https://nodejs.org/ oldalrol,
    echo majd futtassa ujra ezt a fajlt.
    goto EndError
)

echo Node.js telepitese winget segitsegevel...
winget install -e --id OpenJS.NodeJS.LTS --accept-package-agreements --accept-source-agreements
if errorlevel 1 (
    echo A Node.js telepitese sikertelen volt.
    goto EndError
)

if exist "C:\Program Files\nodejs\node.exe" set "PATH=%PATH%;C:\Program Files\nodejs"
if exist "C:\Program Files (x86)\nodejs\node.exe" set "PATH=%PATH%;C:\Program Files (x86)\nodejs"

where node >nul 2>&1
if errorlevel 1 (
    echo A Node.js telepitese utan sem erheto el a node parancs.
    goto EndError
)

where npm >nul 2>&1
if errorlevel 1 (
    echo A Node.js telepitese utan sem erheto el az npm parancs.
    goto EndError
)

:AfterInstall
echo.
echo npm csomagok telepitese az aktualis mappaban...
call npm install
if errorlevel 1 (
    echo Hiba tortent az npm install futtatasa kozben.
    goto EndError
)

echo.
echo Projekt inditasa (npm start)...
call npm start
if errorlevel 1 (
    echo Hiba tortent az npm start futtatasa kozben.
    goto EndError
)

echo.
echo A projekt futasa befejezodott.
goto EndOk

:EndError
echo.
echo A folyamat hiba miatt leallt.

:EndOk
echo.
echo Nyomjon meg egy billentyut a kilepeshez...
pause >nul

endlocal
exit /b