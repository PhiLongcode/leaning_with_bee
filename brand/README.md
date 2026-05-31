# Bộ nhận diện — Cuder Học Tiếng

> **SSOT tài nguyên thương hiệu** · Hình ảnh, logo, âm thanh, mascot  
> **App bundle (Expo):** copy/sync sang [`apps/mobile/assets/brand/`](../apps/mobile/assets/brand/) trước khi build.

## Cấu trúc thư mục

```text
brand/
├── README.md              ← file này
├── AUDIO_MANIFEST.md      ← danh sách file âm thanh bắt buộc
├── logo/                  ← wordmark, app icon nguồn (SVG/PNG @1x–3x)
├── images/                ← mascot, illustration, empty state, rank badges
└── audio/
    ├── sfx/               ← phản hồi học (đúng/sai, XP, streak…)
    └── reminder/          ← nhạc/chuông nhắc học (FN-11)
```

## Quy ước đặt tên file

| Loại | Pattern | Ví dụ |
|------|---------|-------|
| Logo | `cuder-wordmark-{light\|dark}.png` | `cuder-wordmark-light.png` |
| Mascot | `cuder-mascot-{size}.png` | `cuder-mascot-hero.png` |
| Icon app | `app-icon-1024.png` | Xuất từ Figma → Expo `apps/mobile/assets/icon.png` |
| SFX | `{event}.wav` hoặc `.mp3` | `answer_correct.wav` |
| Reminder | `reminder_{variant}.mp3` | `reminder_default.mp3` |

**Định dạng âm thanh khuyến nghị:** MP3 hoặc WAV · mono · 44.1 kHz · SFX &lt; 1.5s · reminder &lt; 5s · dưới 200 KB/file SFX.

## Đồng bộ sang app mobile

Sau khi thêm/thay file trong `brand/`:

1. Copy `logo/` và `images/` cần dùng → `apps/mobile/assets/brand/logo/`, `.../images/`
2. Copy `audio/` → `apps/mobile/assets/brand/audio/` **hoặc** chạy `python scripts/generate-brand-audio.py`
3. Chạy app — playback qua `soundFeedback.ts` + `expo-av`

## Thương hiệu

| Mục | Giá trị |
|-----|---------|
| **Tên app** | **Cuder Học Tiếng** |
| **Tagline** | *Học tiếng Anh mỗi ngày — cùng Cuder* |
| **Mascot** | **Cuder** (gà học — đồng bộ hệ rank Gà con → Thần IELTS) |
| **Màu chủ đạo** | Xanh `#27AE60` — user có thể đổi trong **Cài đặt → Giao diện** (FN-15) |

## Cấu hình brand (FN-15) — Admin only

| Trường | DB | Ai sửa |
|--------|-----|--------|
| Logo, tên, màu | `app_brand_config` + Storage | **Admin** (`app_admins`) |
| Quyền tính năng | `app_system_config.permissions` | **Admin** |
| Learner app | Đọc + cache | **Không** sửa trong Cài đặt |

Hướng dẫn admin: [`supabase/ADMIN_BRAND.md`](../supabase/ADMIN_BRAND.md)

## Lịch sử

| Ngày | Thay đổi |
|------|----------|
| 2026-05-31 | Tạo thư mục SSOT; rebrand Học cùng Bee → Cuder Học Tiếng |
| 2026-05-31 | FN-15 — cấu hình màu (Settings); `brand_name` DB ẩn UI phase sau |
| 2026-05-31 | Sinh 8 file WAV SFX + reminder; `scripts/generate-brand-audio.py`; expo-av playback |
