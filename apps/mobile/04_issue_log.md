<!-- @file: apps/mobile/04_issue_log.md | @role: Issue mobile shell (không map REQ riêng) -->

# Issue log — Mobile app (Expo / Android)

> Shell UI + build. Data/API issues roll-up qua FN (`fn01`–`fn11`) và [`process/00_global_issue_log.md`](../../process/00_global_issue_log.md).

## Issue index

| ID | Mô tả | Trạng thái | GISS |
|----|-------|------------|------|
| ISS-001 | Chuỗi lỗi build APK (Gradle / NDK / Metro) | Closed | GISS-005 |
| ISS-002 | Phụ thuộc schema Supabase — lỗi console khi dev | Mitigated | GISS-001 |

---

## Chi tiết issue

### ISS-001 : Build APK release local {#iss-001}

| Field | Value |
|-------|-------|
| Ngày mở | 2026-05-29 |
| Mức độ | P1 |
| Trạng thái | Closed |

#### 1. Hiện tượng (Symptom)

1. `gradlew assembleRelease` — Gradle 9 / foojay `IBM_SEMERU`.
2. `[CXX1101] NDK 27.1.12297006` thiếu `source.properties`.
3. Metro: `Unable to resolve module stream` từ `@supabase/realtime-js` → `ws`.

#### 2. Root cause

- Prebuild Expo 56 dùng Gradle 9.3; NDK 27.1 cài dở trên SDK; Supabase kéo `ws` (Node-only).

#### 3. Fix

- `android/gradle/wrapper` → 8.13; `ext.ndkVersion` = 28.2 trước `expo-root-project`.
- `metro.config.js` + `shims/empty.js`.
- `scripts/build-apk.js`; `npm run build:apk` / `npm run mobile:build:apk`.

#### 4. Verify

- [x] `apps/mobile/dist/hoc-cung-bee-development-2026-05-29.apk` (~68 MB).
- [ ] Cài máy thật + smoke test các màn hình.

#### 5. Roll-up

- GISS-005. **Tránh lặp:** sau `expo prebuild --clean` chạy lại patch trong `build-apk.js` hoặc commit `android/` đã patch.

---

### ISS-002 : Console đỏ Supabase khi chạy bản APK/dev {#iss-002}

| Field | Value |
|-------|-------|
| Ngày mở | 2026-05-29 |
| Mức độ | P2 |
| Trạng thái | Mitigated |

#### 1. Hiện tượng (Symptom)

- 404 `learner_stats`, `notification_settings`; 400 `user_vocabulary` (xem FN tương ứng).

#### 2. Root cause

- GISS-001 — schema remote chưa đủ.

#### 3. Fix

- Repo layer fallback (xem fn01/fn02/fn10/fn11).
- User: chạy `apply-all.sql`.

#### 4. Verify

- [ ] Console sạch sau migrate + restart app.

#### 5. Roll-up

- GISS-001.
