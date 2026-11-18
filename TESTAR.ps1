$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
$files = @('index.html','style.css','package.json','vite.config.js','src\main.jsx','src\App.jsx','src\Data.js')
foreach ($file in $files) { if (-not (Test-Path $file)) { throw "Arquivo ausente: $file" } }
npm run build
if ($LASTEXITCODE -ne 0) { throw 'Build de produção falhou.' }
Write-Host 'Build de produção OK. Testes visuais seguem manuais; veja TESTING.md.'
