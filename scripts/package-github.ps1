$ErrorActionPreference = 'Stop'
$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$zipPath = Join-Path $projectRoot 'visit-github-icons-2026-10-11.zip'
$directories = @('.github', 'docs', 'public', 'scripts', 'src', 'tests')
$rootFiles = @('.gitignore', '.npmrc', '.env.example', 'favicon.ico', 'index.html', 'LICENSE', 'package-lock.json', 'package.json', 'postcss.config.cjs', 'README.md', 'tsconfig.json', 'tsconfig.sw.json', 'vercel.json', 'vite.config.ts')
$files = @(
  foreach ($directory in $directories) { Get-ChildItem -LiteralPath (Join-Path $projectRoot $directory) -File -Recurse -Force }
  foreach ($file in $rootFiles) { Get-Item -LiteralPath (Join-Path $projectRoot $file) -Force }
)
Add-Type -AssemblyName System.IO.Compression
$stream = [System.IO.File]::Open($zipPath, [System.IO.FileMode]::CreateNew)
$archive = [System.IO.Compression.ZipArchive]::new($stream, [System.IO.Compression.ZipArchiveMode]::Create)
try {
  foreach ($file in $files) {
    $relative = [System.IO.Path]::GetRelativePath($projectRoot, $file.FullName).Replace('\', '/')
    $entry = $archive.CreateEntry($relative, [System.IO.Compression.CompressionLevel]::Optimal)
    $inputStream = $file.OpenRead()
    $outputStream = $entry.Open()
    try { $inputStream.CopyTo($outputStream) } finally { $inputStream.Dispose(); $outputStream.Dispose() }
  }
} finally { $archive.Dispose(); $stream.Dispose() }
$archive = [System.IO.Compression.ZipFile]::OpenRead($zipPath)
try {
  if ($archive.Entries.Count -ne $files.Count) { throw 'ZIP entry count mismatch' }
  foreach ($entry in $archive.Entries) {
    $source = Join-Path $projectRoot $entry.FullName
    $entryStream = $entry.Open()
    $hasher = [System.Security.Cryptography.SHA256]::Create()
    try { $hash = [System.BitConverter]::ToString($hasher.ComputeHash($entryStream)).Replace('-', '') }
    finally { $entryStream.Dispose(); $hasher.Dispose() }
    if ($hash -ne (Get-FileHash -LiteralPath $source -Algorithm SHA256).Hash) { throw "ZIP content mismatch: $source" }
  }
} finally { $archive.Dispose() }
Get-Item -LiteralPath $zipPath | Select-Object Name, Length
Write-Output "PASS: $($files.Count) ZIP entries verified against source files."
