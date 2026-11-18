$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
$files = @('index.html','style.css','app.js','profile.js','SERVIDOR.js')
foreach ($file in $files) { if (-not (Test-Path $file)) { throw "Arquivo ausente: $file" } }
node --check app.js
node --check profile.js
node --check SERVIDOR.js
if ($LASTEXITCODE -ne 0) { throw 'Falha na verificação da sintaxe JavaScript.' }
Write-Host 'Estrutura e sintaxe JavaScript OK. Testes visuais seguem manuais; veja TESTING.md.'
