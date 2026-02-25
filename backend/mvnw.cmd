@REM Maven Wrapper script for Windows
@REM This script uses the Maven Wrapper jar to bootstrap Maven

@echo off
setlocal

set "MAVEN_PROJECTBASEDIR=%~dp0"
set "WRAPPER_JAR=%MAVEN_PROJECTBASEDIR%.mvn\wrapper\maven-wrapper.jar"

if not exist "%WRAPPER_JAR%" (
    echo ERROR: Maven Wrapper jar not found at %WRAPPER_JAR%
    echo Please run the project setup first.
    exit /b 1
)

"%JAVA_HOME%\bin\java.exe" -jar "%WRAPPER_JAR%" %* 2>nul
if %ERRORLEVEL% neq 0 (
    java -jar "%WRAPPER_JAR%" %*
)
