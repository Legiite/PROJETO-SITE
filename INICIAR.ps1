$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
Write-Host 'Ghostfolio disponível em http://localhost:4173 (Ctrl+C para parar)'
python -m http.server 4173
