# Upload logo SSOT → Supabase Storage (bucket brand-assets)
# Yêu cầu: supabase CLI đã login + link project
# Usage: .\scripts\upload-brand-logo.ps1 [-ProjectRef YOUR_REF]

param(
  [string]$ProjectRef = $env:SUPABASE_PROJECT_REF
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$LogoFile = Join-Path $Root "brand\logo\AvataApp.png"

if (-not (Test-Path $LogoFile)) {
  Write-Error "Không tìm thấy $LogoFile"
}

if (-not $ProjectRef) {
  Write-Host "Thiếu ProjectRef. Set `$env:SUPABASE_PROJECT_REF hoặc truyền -ProjectRef"
  Write-Host "Hoặc upload thủ công: Supabase Dashboard → Storage → brand-assets → logo/AvataApp.png"
  exit 1
}

Write-Host "Upload $LogoFile → brand-assets/logo/AvataApp.png ..."
npx supabase storage cp $LogoFile "ss:///brand-assets/logo/AvataApp.png" --project-ref $ProjectRef
Write-Host "Done. Kiểm tra app_brand_config.logo_storage_path = 'logo/AvataApp.png'"
