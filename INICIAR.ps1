$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
Write-Host 'Ghostfolio disponível em http://localhost:4190 (Ctrl+C para parar)'
npm run dev
