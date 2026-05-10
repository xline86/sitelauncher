$ErrorActionPreference = "Stop"

$ExtensionName = "SiteLauncher"
$Version = "1.0"
$OutputDir = "dist"
$ZipName = "$ExtensionName-v$Version.zip"
$ZipPath = Join-Path $OutputDir $ZipName
$TempDir = Join-Path $OutputDir "package"

$RequiredFiles = @(
    "manifest.json",
    "popup.html",
    "popup.css",
    "popup.js",
    "icons/icon16.png",
    "icons/icon32.png",
    "icons/icon48.png",
    "icons/icon128.png"
)

if (Test-Path $TempDir) {
    Remove-Item $TempDir -Recurse -Force
}

if (Test-Path $ZipPath) {
    Remove-Item $ZipPath -Force
}

New-Item -ItemType Directory -Path $TempDir | Out-Null

foreach ($File in $RequiredFiles) {
    if (-not (Test-Path $File)) {
        throw "必要なファイルが見つかりません: $File"
    }

    $Destination = Join-Path $TempDir $File
    $DestinationDir = Split-Path $Destination -Parent

    if (-not (Test-Path $DestinationDir)) {
        New-Item -ItemType Directory -Path $DestinationDir -Force | Out-Null
    }

    Copy-Item $File $Destination
}

Compress-Archive -Path "$TempDir\*" -DestinationPath $ZipPath -Force

Write-Host "提出用ZIPを作成しました: $ZipPath"
