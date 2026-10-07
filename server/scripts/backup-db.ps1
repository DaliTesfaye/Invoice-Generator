param(
  [string]$OutputDirectory = ".\backups"
)

$ErrorActionPreference = "Stop"

if (-not $env:DATABASE_URL) {
  throw "DATABASE_URL must be set before creating a backup."
}

New-Item -ItemType Directory -Path $OutputDirectory -Force | Out-Null
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$outputFile = Join-Path $OutputDirectory "invoice-generator-$timestamp.dump"

pg_dump $env:DATABASE_URL --format=custom --file=$outputFile --no-owner --no-privileges

Write-Output "Database backup created: $outputFile"
