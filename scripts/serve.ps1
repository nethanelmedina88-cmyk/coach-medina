$port = 8792
$root = Split-Path -Parent $PSScriptRoot
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Host "Serving $root on http://localhost:$port/"
$mime = @{ ".html"="text/html; charset=utf-8"; ".js"="application/javascript; charset=utf-8"; ".css"="text/css; charset=utf-8"; ".json"="application/json"; ".png"="image/png"; ".jpg"="image/jpeg"; ".svg"="image/svg+xml"; ".md"="text/plain; charset=utf-8" }
while ($listener.IsListening) {
  $ctx = $listener.GetContext()
  try {
    $path = $ctx.Request.Url.AbsolutePath
    if ($path -eq "/") { $path = "/index.html" }
    $file = Join-Path $root ($path.TrimStart("/") -replace "/", "\")
    if (Test-Path $file -PathType Leaf) {
      $bytes = [System.IO.File]::ReadAllBytes($file)
      $ext = [System.IO.Path]::GetExtension($file).ToLower()
      if ($mime.ContainsKey($ext)) { $ctx.Response.ContentType = $mime[$ext] }
      $ctx.Response.Headers.Add("Cache-Control","no-store")
      $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else { $ctx.Response.StatusCode = 404 }
  } catch {}
  $ctx.Response.Close()
}
