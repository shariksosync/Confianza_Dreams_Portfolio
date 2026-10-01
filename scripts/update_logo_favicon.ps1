Add-Type -AssemblyName System.Drawing

$srcPath = "D:\Software Setup\SOsync_Company_work\Projects\Projects08\logo\logo.png"
$publicDir = "D:\Software Setup\SOsync_Company_work\Projects\Projects08\Confianza_Dreams_Portfolio\public"
$appDir = "D:\Software Setup\SOsync_Company_work\Projects\Projects08\Confianza_Dreams_Portfolio\src\app"

# 1. Copy full resolution new logo
Copy-Item -Path $srcPath -Destination (Join-Path $publicDir "logo.png") -Force
Copy-Item -Path $srcPath -Destination (Join-Path $publicDir "logo-icon.png") -Force
Copy-Item -Path $srcPath -Destination (Join-Path $publicDir "logo-solid.png") -Force
Write-Host "Copied logo.png, logo-icon.png, logo-solid.png"

# 2. Resize Bitmap function
function Resize-Bitmap($srcBmp, $w, $h) {
    $dest = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($dest)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $g.Clear([System.Drawing.Color]::Transparent)
    $g.DrawImage($srcBmp, 0, 0, $w, $h)
    $g.Dispose()
    return $dest
}

$orig = [System.Drawing.Bitmap]::FromFile($srcPath)

# 3. Save favicon.png (64x64)
$fav64 = Resize-Bitmap $orig 64 64
$fav64.Save((Join-Path $publicDir "favicon.png"), [System.Drawing.Imaging.ImageFormat]::Png)

# 4. Save favicon-32.png and 192x192
$fav32 = Resize-Bitmap $orig 32 32
$fav192 = Resize-Bitmap $orig 192 192
$fav192.Save((Join-Path $publicDir "icon-192.png"), [System.Drawing.Imaging.ImageFormat]::Png)

# 5. Build proper multi-platform .ico file
$ms = New-Object System.IO.MemoryStream
$fav32.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)
$pngBytes = $ms.ToArray()
$ms.Dispose()

$icoFile = Join-Path $publicDir "favicon.ico"
$icoStream = New-Object System.IO.FileStream $icoFile, ([System.IO.FileMode]::Create)
$bw = New-Object System.IO.BinaryWriter $icoStream

# ICONDIR header
$bw.Write([UInt16]0) # Reserved
$bw.Write([UInt16]1) # Type 1 = ICO
$bw.Write([UInt16]1) # Count = 1 image

# ICONDIRENTRY
$bw.Write([Byte]32) # Width
$bw.Write([Byte]32) # Height
$bw.Write([Byte]0)  # Colors
$bw.Write([Byte]0)  # Reserved
$bw.Write([UInt16]1) # Color planes
$bw.Write([UInt16]32) # Bits per pixel
$bw.Write([UInt32]$pngBytes.Length) # Size of image data
$bw.Write([UInt32]22) # Offset (6 + 16 = 22)

# Image Data
$bw.Write($pngBytes)
$bw.Flush()
$icoStream.Dispose()

# Also copy to src/app/favicon.ico
Copy-Item -Path $icoFile -Destination (Join-Path $appDir "favicon.ico") -Force

# 6. Clean up
$fav192.Dispose()
$fav64.Dispose()
$fav32.Dispose()
$orig.Dispose()

Write-Host "Generated favicon.ico and favicon.png successfully!"
