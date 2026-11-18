$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
$files = @('index.html','style.css','app.js')
foreach ($file in $files) { if (-not (Test-Path $file)) { throw "Arquivo ausente: $file" } }
Write-Host 'Estrutura básica OK. Testes de navegador ainda são manuais; veja TESTING.md.'
