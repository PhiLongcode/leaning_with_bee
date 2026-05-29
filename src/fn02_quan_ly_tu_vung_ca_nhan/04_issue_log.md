<!-- @file: src/fn02_quan_ly_tu_vung_ca_nhan/04_issue_log.md | @role: Issue index — REQ-02 -->

# Issue log — Quản lý từ vựng cá nhân

> Dùng [`issue_loop_template.md`](../../process/templates/issue_loop_template.md) cho từng issue (ISS-xxx).  
> **Đóng issue có lesson toàn dự án:** thêm dòng **GISS** vào [`00_global_issue_log.md`](../../process/00_global_issue_log.md).

## Issue index

| ID | Mô tả | Trạng thái | GISS |
|----|-------|------------|------|
| ISS-001 | POST/PATCH `user_vocabulary` 400 — id mock `uv-…`, `vocab_id` `day1-1` | Fixed | GISS-003 |

---

## Chi tiết issue

### ISS-001 : REST 400/409 khi thêm/sửa từ cá nhân với id mock {#iss-001}

| Field | Value |
|-------|-------|
| Ngày mở | 2026-05-29 |
| Mức độ | P1 |
| Trạng thái | Fixed |

#### 1. Hiện tượng (Symptom)

- `POST …/user_vocabulary` **400** (body `vocab_id: day1-1`, `id: uv-<timestamp>`).
- `PATCH`/`DELETE` **400** với `id=eq.uv-…`.
- **409** khi retry insert trùng (sau lỗi trước).

#### 2. Root cause

- Cột `id`, `vocab_id` kiểu `uuid` trên Supabase.
- App dùng mock id từ `DAILY_VOCABULARY_SEED` khi DB chưa có `lesson_day` (liên quan fn01 ISS-001).

#### 3. Fix

- `isInvalidUuid()` trong `src/shared/supabaseErrors.ts`.
- `userVocabularyRepository`: lookup `vocabulary` theo `word` từ seed → UUID thật; không resolve được → mock local.
- `setFavorite` / `remove`: fallback mock nếu id không phải UUID.

#### 4. Verify

- [x] Không còn 400 do format id khi DB có từ khớp `word`.
- [ ] Sau GISS-001: thêm từ dùng UUID từ lesson DB end-to-end.

#### 5. Roll-up

- GISS-003. Phụ thuộc đóng GISS-001 để hết fallback mock.
