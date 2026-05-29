<!-- @file: src/fn11_notification_reminder/04_issue_log.md | @role: Issue index — REQ-11 -->

# Issue log — Nhắc nhở / thông báo

> Dùng [`issue_loop_template.md`](../../process/templates/issue_loop_template.md) cho từng issue (ISS-xxx).  
> **Đóng issue có lesson toàn dự án:** thêm dòng **GISS** vào [`00_global_issue_log.md`](../../process/00_global_issue_log.md).

## Issue index

| ID | Mô tả | Trạng thái | GISS |
|----|-------|------------|------|
| ISS-001 | GET/POST `notification_settings` 404 | Mitigated | GISS-001 |

---

## Chi tiết issue

### ISS-001 : `notification_settings` 404 trên Supabase REST {#iss-001}

| Field | Value |
|-------|-------|
| Ngày mở | 2026-05-29 |
| Mức độ | P1 |
| Trạng thái | Mitigated |

#### 1. Hiện tượng (Symptom)

- `GET …/notification_settings?device_id=eq.<uuid>` **404**.
- `POST` upsert settings **404**.

#### 2. Root cause

- Bảng từ migration `20260529000000_fn08_10_11_tables.sql` chưa có trên remote (GISS-001).

#### 3. Fix

- `notificationRepository`: `isMissingTableError`, `remoteUnavailable`, mock defaults.
- Apply `apply-all.sql`.

#### 4. Verify

- [ ] Sau migrate: đọc/ghi settings → 200.

#### 5. Roll-up

- GISS-001.
