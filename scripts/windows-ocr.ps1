param(
  [Parameter(Mandatory = $true)]
  [string]$ImagePath
)

$ErrorActionPreference = "Stop"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Add-Type -AssemblyName System.Runtime.WindowsRuntime
$null = [Windows.Storage.StorageFile, Windows.Storage, ContentType = WindowsRuntime]
$null = [Windows.Graphics.Imaging.BitmapDecoder, Windows.Graphics.Imaging, ContentType = WindowsRuntime]
$null = [Windows.Media.Ocr.OcrEngine, Windows.Media.Ocr, ContentType = WindowsRuntime]

$AsTaskGeneric = [System.WindowsRuntimeSystemExtensions].GetMethods() |
  Where-Object { $_.Name -eq "AsTask" -and $_.ContainsGenericParameters -and $_.GetParameters().Count -eq 1 } |
  Select-Object -First 1

function Await([object]$Operation, [Type]$ResultType) {
  $Method = $AsTaskGeneric.MakeGenericMethod($ResultType)
  $Task = $Method.Invoke($null, @($Operation))
  $Task.Wait(-1) | Out-Null
  return $Task.Result
}

$StorageFile = Await ([Windows.Storage.StorageFile]::GetFileFromPathAsync($ImagePath)) ([Windows.Storage.StorageFile])
$Stream = Await ($StorageFile.OpenReadAsync()) ([Windows.Storage.Streams.IRandomAccessStreamWithContentType])
$Decoder = Await ([Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($Stream)) ([Windows.Graphics.Imaging.BitmapDecoder])
$SoftwareBitmap = Await ($Decoder.GetSoftwareBitmapAsync()) ([Windows.Graphics.Imaging.SoftwareBitmap])
$OcrEngine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromUserProfileLanguages()

if (-not $OcrEngine) {
  throw "Windows OCR is not available for the current user profile languages."
}

$OcrResult = Await ($OcrEngine.RecognizeAsync($SoftwareBitmap)) ([Windows.Media.Ocr.OcrResult])

$Payload = [ordered]@{
  text = ($OcrResult.Text -replace "`r", "").Trim()
  lines = @(
    $OcrResult.Lines |
      ForEach-Object { $_.Text.Trim() } |
      Where-Object { $_ }
  )
}

$Payload | ConvertTo-Json -Compress -Depth 4
