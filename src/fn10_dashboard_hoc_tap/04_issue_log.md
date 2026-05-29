<!-- @file: src/fn10_dashboard_hoc_tap/04_issue_log.md | @role: Issue index — REQ-10 -->

# Issue log — Dashboard học tập

> Dùng [`issue_loop_template.md`](../../process/templates/issue_loop_template.md) cho từng issue (ISS-xxx).  
> **Đóng issue có lesson toàn dự án:** thêm dòng **GISS** vào [`00_global_issue_log.md`](../../process/00_global_issue_log.md).

## Issue index

| ID | Mô tả | Trạng thái | GISS |
|----|-------|------------|------|
| ISS-001 | GET/POST `learner_stats` 404 — bảng chưa có | Mitigated | GISS-001 |

---

## Chi tiết issue

### ISS-001 : `learner_stats` 404 trên Supabase REST {#iss-001}

| Field | Value |
|-------|-------|
| Ngày mở | 2026-05-29 |
| Mức độ | P1 |
| Trạng thái | Mitigated |

#### 1. Hiện tượng (Symptom)

- Console: `GET/POST …/learner_stats` **404** (PGRST205).
- Nhiều request lặp trước khi repo chuyển mock.

#### 2. Root cause

- Migration `20260529000000_fn08_10_11_tables.sql` chưa apply (GISS-001).

#### 3. Fix

- `dashboardRepository`: `isMissingTableError` + cờ `remoteUnavailable` → mock streak/xp.
- Apply `apply-all.sql` để tạo bảng thật.

#### 4. Verify

- [ ] Sau migrate: GET `learner_stats` → 200.
- [x] App không crash; dùng mock khi bảng thiếu.

#### 5. Roll-up

- GISS-001.
