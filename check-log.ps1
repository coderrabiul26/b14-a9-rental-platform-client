$ErrorActionPreference = "SilentlyContinue"
$dir = Join-Path $env:TEMP "opencode"
$src = Join-Path $dir "fresh.txt"
$jar = Join-Path $dir "dbread.txt"

# Drop the cookie cache so EVERY request must hit MongoDB.
(Get-Content $src) | Where-Object { $_ -notmatch "session_data" } | Set-Content $jar
Write-Output ("cookie lines kept: " + ((Get-Content $jar | Where-Object { $_ -notmatch "^#" -and $_.Trim() -ne "" }).Count))

$logPath = ".next\dev\logs\next-development.log"
$before = (Get-Content $logPath -Raw).Length

1..8 | ForEach-Object {
  curl.exe -s -o NUL -D - -b $jar "http://localhost:3000/dashboard/customer" | Select-String -Pattern "HTTP/1.1 \d+"
}

Start-Sleep -Seconds 2
$log = Get-Content $logPath -Raw
$new = $log.Substring($before)
Write-Output ("new log chars: " + $new.Length)
if ($new.Length -gt 0) { $new -split "`n" | Select-Object -First 30 } else { Write-Output "(none)" }
