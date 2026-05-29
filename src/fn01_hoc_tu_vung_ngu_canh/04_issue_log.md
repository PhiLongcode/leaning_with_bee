<!-- @file: src/fn01_hoc_tu_vung_ngu_canh/04_issue_log.md | @role: Issue index — REQ-01 -->

# Issue log — Học từ vựng theo ngữ cảnh

> Dùng [`issue_loop_template.md`](../../process/templates/issue_loop_template.md) cho từng issue (ISS-xxx).  
> **Đóng issue có lesson toàn dự án:** thêm dòng **GISS** vào [`00_global_issue_log.md`](../../process/00_global_issue_log.md).

## Issue index

| ID | Mô tả | Trạng thái | GISS |
|----|-------|------------|------|
| ISS-001 | Schema remote thiếu `learning_days`, `lesson_day`, seed 7 ngày | Mitigated | GISS-001 |
| ISS-002 | `db:sync` không push được (IPv6 / pooler) | Open | GISS-002 |
| ISS-003 | `apply-all.sql` policy duplicate 42710 | Closed | GISS-004 |

---

## Chi tiết issue

### ISS-001 : Schema Supabase remote chưa đủ (404 / thiếu cột `lesson_day`) {#iss-001}

| Field | Value |
|-------|-------|
| Ngày mở | 2026-05-29 |
| Mức độ | P1 |
| Trạng thái | Mitigated |

#### 1. Hiện tượng (Symptom)

- REST `vocabulary?lesson_day=eq.1` → **400** `column vocabulary.lesson_day does not exist`.
- `learning_days` → **404** PGRST205.
- App fallback mock 7 ngày (`day1-1` …) thay vì UUID từ DB.
- Chỉ ~5 từ trong bảng `vocabulary` (seed cũ).

#### 2. Root cause

- Migrations `20260529120000_vocabulary_lesson_days.sql`, `20260529120100_seed_7_day_vocabulary.sql` chưa chạy trên project `wtprvgolyoxrjvutvbsq`.
- `npm run db:sync` fail (ISS-002).

#### 3. Fix

- Chạy `supabase/apply-all.sql` trong SQL Editor (sau khi idempotent policy — ISS-003).
- Code tạm: `vocabularyRepository` load theo `word` khi thiếu `lesson_day`.

#### 4. Verify

- [ ] SQL: 7 nhóm `lesson_day`, mỗi nhóm 10 từ.
- [ ] App Vocabulary screen hiển thị UUID thật từ Supabase.

#### 5. Roll-up

- GISS-001 trong [`00_global_issue_log.md`](../../process/00_global_issue_log.md).

---

### ISS-002 : `npm run db:sync` thất bại — không kết nối Postgres {#iss-002}

| Field | Value |
|-------|-------|
| Ngày mở | 2026-05-29 |
| Mức độ | P1 |
| Trạng thái | Open |

#### 1. Hiện tượng (Symptom)

- `npm run db:sync` → `getaddrinfo ENOTFOUND db.wtprvgolyoxrjvutvbsq.supabase.co`.
- Pooler `aws-0-ap-southeast-1` → `tenant/user postgres.<ref> not found` (sai region hoặc URL).

#### 2. Root cause

- `db.*.supabase.co` resolve IPv6-only; máy dev không có route IPv6.
- Chưa cấu hình `DATABASE_URL` (Session pooler) hoặc `SUPABASE_ACCESS_TOKEN` cho Management API.

#### 3. Fix / workaround

- Dashboard → Database → Connect → copy Session pooler URL → `.env` `DATABASE_URL`.
- Thủ công: `apply-all.sql` trong SQL Editor.
- Cập nhật `supabase/README.md`, `scripts/db-sync.js`.

#### 4. Verify

- [ ] `npm run db:sync` thành công **hoặc** xác nhận schema đủ qua SQL.

#### 5. Roll-up

- GISS-002.

---

### ISS-003 : Chạy lại `apply-all.sql` — policy đã tồn tại (42710) {#iss-003}

| Field | Value |
|-------|-------|
| Ngày mở | 2026-05-29 |
| Mức độ | P2 |
| Trạng thái | Closed |

#### 1. Hiện tượng (Symptom)

- SQL Editor: `ERROR: 42710: policy "profiles_select_own" for table "profiles" already exists`.

#### 2. Root cause

- Migration `20260528160000_initial_schema.sql` dùng `CREATE POLICY` không idempotent; schema đã có một phần.

#### 3. Fix

- Thêm `DROP POLICY IF EXISTS …` trước mỗi `CREATE POLICY` trong migrations.
- `scripts/compose-apply-all.js` tự chèn drop khi gộp `apply-all.sql`.

#### 4. Verify

- [x] Chạy lại `apply-all.sql` không dừng ở policy `profiles_*`.

#### 5. Roll-up

- GISS-004. **Tránh lặp:** migration SQL phải idempotent khi có thể chạy lại trên DB đã có dữ liệu.
