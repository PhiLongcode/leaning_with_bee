<!-- @file: process/00_global_issue_log.md | @role: Roll-up issue toàn dự án (GISS) -->

# Global issue log (GISS)

> Roll-up từ `src/fn**/04_issue_log.md` (ISS). Chi tiết RCA/fix nằm ở FN nguồn.

## Bảng GISS

| GISS | Mô tả ngắn | Nguồn | Mức | Trạng thái |
|------|------------|-------|-----|------------|
| GISS-001 | Schema Supabase remote thiếu bảng/cột (404 REST, `lesson_day`) | fn01, fn10, fn11 | P1 | Mitigated — cần chạy `apply-all.sql` |
| GISS-002 | `npm run db:sync` không kết nối Postgres (IPv6 / pooler) | fn01 / infra | P1 | Open — workaround SQL Editor / `DATABASE_URL` |
| GISS-003 | REST 400: mock id (`day1-1`, `uv-…`) gửi lên cột UUID | fn02, fn04 | P1 | Fixed |
| GISS-004 | SQL Editor: `policy … already exists` (42710) khi chạy lại migration | fn01 / infra | P2 | Fixed |
| GISS-005 | Build APK Android: Gradle 9, NDK 27.1, Metro `stream` | mobile | P1 | Fixed — APK dev đã build |

---

## Chi tiết GISS

### GISS-001 — Schema Supabase chưa đủ trên remote

| Field | Value |
|-------|-------|
| Ngày | 2026-05-29 |
| Mức | P1 |
| Trạng thái | Mitigated (chưa Verified trên mọi môi trường) |

**Hiện tượng:** App/mobile gọi REST → `404` `learner_stats`, `notification_settings`, `learning_days`; `vocabulary.lesson_day` → `42703`; chỉ có seed cũ (~5 từ).

**Root cause:** Migrations `20260529000000_*`, `20260529120000_*`, `20260529120100_*` chưa apply; `db:sync` thất bại (xem GISS-002).

**Fix / workaround:**
- `npm run db:compose` → dán `supabase/apply-all.sql` trong Dashboard → SQL Editor → Run.
- Verify: `select lesson_day, count(*) from vocabulary group by 1 order by 1;` (kỳ vọng 7×10).

**FN chi tiết:** [fn01 ISS-001](../src/fn01_hoc_tu_vung_ngu_canh/04_issue_log.md#iss-001), [fn10 ISS-001](../src/fn10_dashboard_hoc_tap/04_issue_log.md#iss-001), [fn11 ISS-001](../src/fn11_notification_reminder/04_issue_log.md#iss-001).

**Tránh lặp:** Luôn verify bảng/cột trước khi test mobile; ghi `schema_deployments` sau migrate.

---

### GISS-002 — `db:sync` ENOTFOUND / pooler tenant not found

| Field | Value |
|-------|-------|
| Ngày | 2026-05-29 |
| Mức | P1 |
| Trạng thái | Open |

**Hiện tượng:** `npm run db:sync` → `getaddrinfo ENOTFOUND db.<ref>.supabase.co` hoặc pooler `tenant/user postgres.<ref> not found`.

**Root cause:**
- Host `db.*.supabase.co` thường chỉ có bản ghi **IPv6**; mạng dev không ra IPv6 (`ENETUNREACH`).
- Pooler cần đúng **region** + URL Session/Transaction từ Dashboard; mật khẩu/URL sai → tenant not found.

**Fix / workaround:**
- Copy **Session pooler** URL từ Dashboard → `DATABASE_URL` trong `.env`.
- Hoặc apply SQL thủ công (`apply-all.sql`).
- Script: `scripts/db-sync.js` — Gradle 8.13, gợi ý lỗi trong README.

**FN chi tiết:** [fn01 ISS-002](../src/fn01_hoc_tu_vung_ngu_canh/04_issue_log.md#iss-002).

---

### GISS-003 — Mock vocabulary id gây 400 trên `user_vocabulary` / `collection_items`

| Field | Value |
|-------|-------|
| Ngày | 2026-05-29 |
| Mức | P1 |
| Trạng thái | Fixed |

**Hiện tượng:** Console `POST/PATCH …/user_vocabulary` **400** với `id=uv-…`, `vocab_id=day1-1`; `collection_items` **400** tương tự.

**Root cause:** DB chưa có `lesson_day` → repo fallback mock id; Supabase cột `uuid` không nhận string mock.

**Fix:** `src/shared/supabaseErrors.ts`; resolve `word` → UUID DB trong `userVocabularyRepository`, `collectionRepository`; fallback mock khi không resolve được; `vocabularyRepository` load theo `word` khi thiếu cột `lesson_day`.

**FN chi tiết:** [fn02 ISS-001](../src/fn02_quan_ly_tu_vung_ca_nhan/04_issue_log.md#iss-001), [fn04 ISS-001](../src/fn04_learning_collection/04_issue_log.md#iss-001).

---

### GISS-004 — `apply-all.sql` lỗi policy đã tồn tại (42710)

| Field | Value |
|-------|-------|
| Ngày | 2026-05-29 |
| Mức | P2 |
| Trạng thái | Fixed |

**Hiện tượng:** SQL Editor: `ERROR: 42710: policy "profiles_select_own" for table "profiles" already exists`.

**Root cause:** Schema đã apply một phần; `CREATE POLICY` không idempotent.

**Fix:** `DROP POLICY IF EXISTS` trước mỗi `CREATE POLICY` trong migrations + `scripts/compose-apply-all.js` tự chèn khi gộp `apply-all.sql`.

**FN chi tiết:** [fn01 ISS-003](../src/fn01_hoc_tu_vung_ngu_canh/04_issue_log.md#iss-003).

---

### GISS-005 — Chuỗi lỗi build APK Android (Expo 56)

| Field | Value |
|-------|-------|
| Ngày | 2026-05-29 |
| Mức | P1 |
| Trạng thái | Fixed (dev APK) |

**Hiện tượng (lần lượt):**
1. Gradle 9.3 — `JvmVendorSpec IBM_SEMERU` / foojay.
2. NDK `27.1.12297006` thiếu `source.properties`.
3. Metro bundle — `Unable to resolve module stream` (Supabase `ws`).

**Fix:**
- `gradle-wrapper.properties` → 8.13; `org.gradle.jvm.toolchain.foojay-resolver.enabled=false`.
- `ext.ndkVersion` / `android.ndkVersion=28.2.13676358` trước `expo-root-project`; xóa NDK 27.1 hỏng.
- `metro.config.js` + `shims/empty.js` cho Node builtins.
- `apps/mobile/scripts/build-apk.js`; output: `apps/mobile/dist/hoc-cung-bee-development-2026-05-29.apk`.

**Verify:** `npm run mobile:build:apk` → BUILD SUCCESSFUL.

**Ghi chú:** APK release hiện ký debug keystore; production cần keystore riêng hoặc EAS Build.

---

## Lịch sử

| Ngày | Thay đổi |
|------|----------|
| 2026-05-29 | Khởi tạo GISS-001 … GISS-005 từ phiên Supabase + build APK |
