$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
Write-Host 'Ghostfolio disponível em http://localhost:4188 (Ctrl+C para parar)'
node .\SERVIDOR.js
