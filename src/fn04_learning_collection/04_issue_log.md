<!-- @file: src/fn04_learning_collection/04_issue_log.md | @role: Issue index — REQ-04 -->

# Issue log — Bộ sưu tập học tập

> Dùng [`issue_loop_template.md`](../../process/templates/issue_loop_template.md) cho từng issue (ISS-xxx).  
> **Đóng issue có lesson toàn dự án:** thêm dòng **GISS** vào [`00_global_issue_log.md`](../../process/00_global_issue_log.md).

## Issue index

| ID | Mô tả | Trạng thái | GISS |
|----|-------|------------|------|
| ISS-001 | POST `collection_items` 400 — `item_id` mock | Fixed | GISS-003 |

---

## Chi tiết issue

### ISS-001 : Thêm mục collection với `item_id` không phải UUID {#iss-001}

| Field | Value |
|-------|-------|
| Ngày mở | 2026-05-29 |
| Mức độ | P1 |
| Trạng thái | Fixed |

#### 1. Hiện tượng (Symptom)

- `POST …/collection_items` **400** khi `item_type=vocabulary`, `item_id=day1-1` (và tương tự).

#### 2. Root cause

- Giống fn02 ISS-001: mock vocab id từ seed khi schema/lesson chưa đủ.

#### 3. Fix

- `collectionRepository.addItem`: `isInvalidUuid` trên `collection_id` / `item_id`; resolve `word` → UUID; fallback mock.

#### 4. Verify

- [x] Không 400 khi từ đã có trong bảng `vocabulary`.

#### 5. Roll-up

- GISS-003.
