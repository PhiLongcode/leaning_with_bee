# API Design — Học cùng Bee (Supabase-only)

> **SSOT API** · JSON UTF-8  
> **Implement:** **Chỉ Supabase** — PostgREST + Edge Functions (không Express server riêng)  
> **Tech:** [`sys_design_techstack.md`](../sys_design_techstack.md) · **UI:** [`sys_design_ux_ui.md`](../sys_design_ux_ui.md) §7 · **SRS:** [`requirement_base.md`](../../00_input_raw/requirement_base.md)

---

## 0. Kiến trúc triển khai

| Loại | Cơ chế | Base path |
|------|--------|-----------|
| **CRUD bảng** | PostgREST qua `supabase-js` | `https://<ref>.supabase.co/rest/v1/<table>` |
| **Logic / AI** | Edge Functions (Deno) | `https://<ref>.supabase.co/functions/v1/<name>` |
| **File audio** | Supabase Storage | `storage/v1/object/...` |

Headers chung (Supabase client tự gắn):

| Header | Mô tả |
|--------|--------|
| `apikey` | Anon key |
| `Authorization` | `Bearer <jwt>` — khuyến nghị `signInAnonymously()` lần đầu mở app |
| `X-Device-Id` | UUID v4 — **bắt buộc** trên Edge Functions; đồng bộ với cột `device_id` |

**RLS:** Mọi bảng `user_*`, `learning_*`, `conversation_logs`, `learning_collections` — policy chỉ cho phép rows có `device_id` khớp session (profile) hoặc validate trong Edge Function.

**Không login UX:** không email/password; anonymous session + `device_id` lưu `profiles` / mọi bảng.

---

## 1. Base URL & versioning

| Mục | Giá trị |
|-----|---------|
| Project URL | `https://<project-ref>.supabase.co` |
| PostgREST | `/rest/v1/` |
| Edge Functions | `/functions/v1/<function-name>` |
| Logical API version | `v1` (đặt tên function hoặc prefix body nếu cần) |

---

## 2. Authentication & device scope

Không đăng nhập truyền thống (SRS).

1. App tạo/lưu `device_id` (MMKV).
2. `supabase.auth.signInAnonymously()` (hoặc gọi Edge `register-device`) → JWT.
3. Upsert `profiles { id: auth.uid(), device_id }`.
4. RLS: `device_id = (select device_id from profiles where id = auth.uid())`.

Edge Functions đọc `X-Device-Id` + JWT, từ chối mismatch.

**Lỗi:** `401` thiếu JWT/device · PostgREST `42501` RLS violation.

---

## 3. Conventions

### 3.1 HTTP methods

| Method | Dùng cho |
|--------|----------|
| GET | Đọc, list |
| POST | Tạo, action (review, chat, STT) |
| PUT | Cập nhật toàn phần |
| DELETE | Xóa |

### 3.2 Pagination (list)

Query: `?limit=20&offset=0` (default `limit=20`, max `100`).

Response list:

```json
{
  "data": [],
  "meta": { "limit": 20, "offset": 0, "total": 42 }
}
```

### 3.3 Timestamps

ISO 8601 UTC: `2026-05-28T10:00:00.000Z`.

### 3.4 Error envelope

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "word is required",
    "details": [{ "field": "word", "issue": "required" }]
  }
}
```

| HTTP | Code ví dụ | Khi |
|------|------------|-----|
| 400 | `VALIDATION_ERROR` | Body/query không hợp lệ |
| 401 | `DEVICE_ID_REQUIRED` | Thiếu `X-Device-Id` |
| 404 | `NOT_FOUND` | Resource không tồn tại hoặc không thuộc device |
| 409 | `CONFLICT` | Trùng unique (nếu có) |
| 429 | `RATE_LIMITED` | AI/STT quota |
| 500 | `INTERNAL_ERROR` | Lỗi server |

---

## 4. Data model (PostgreSQL / Supabase)

### 4.1 `vocabulary` (catalog — có thể shared hoặc per-device tùy implement)

| Field | Type | Notes |
|-------|------|-------|
| id | uuid | PK |
| word | text | |
| meaning | text | Tiếng Việt |
| pronunciation | text | IPA hoặc mô tả |
| part_of_speech | text | noun, verb, … |
| context | text | Bắt buộc (SRS) |
| example | text | |
| topic | text | Software Development, … |
| difficulty_level | int | 1–5 |
| created_at | timestamptz | |

### 4.2 `user_vocabulary`

| Field | Type | Notes |
|-------|------|-------|
| id | uuid | PK |
| device_id | text | FK scope |
| vocab_id | uuid | → vocabulary |
| is_favorite | boolean | |
| is_difficult | boolean | |
| created_at | timestamptz | |

### 4.3 `user_sentences`

| Field | Type | Notes |
|-------|------|-------|
| id | uuid | PK |
| device_id | text | |
| sentence | text | EN |
| translation | text | VI |
| context | text | |
| topic | text | |
| created_at | timestamptz | |

### 4.4 `learning_progress`

| Field | Type | Notes |
|-------|------|-------|
| id | uuid | PK |
| device_id | text | |
| vocab_id | uuid | |
| repetition_level | int | Leitner box / SM-2 stage |
| next_review | timestamptz | |
| accuracy | float | 0–1 |
| review_count | int | |

### 4.5 `learning_collections`

| Field | Type | Notes |
|-------|------|-------|
| id | uuid | PK |
| device_id | text | |
| title | text | |
| description | text | nullable |
| created_at | timestamptz | |

### 4.6 `collection_items`

| Field | Type | Notes |
|-------|------|-------|
| id | uuid | PK |
| collection_id | uuid | |
| item_type | text | `vocabulary` \| `sentence` |
| item_id | uuid | |

### 4.7 `conversation_scenarios` (catalog)

| Field | Type | Notes |
|-------|------|-------|
| id | uuid | PK |
| title | text | |
| description | text | |
| level | text | A1, B1, … |
| topic | text | Interview, Scrum, … |

### 4.8 `conversation_logs`

| Field | Type | Notes |
|-------|------|-------|
| id | uuid | PK |
| device_id | text | |
| scenario_id | uuid | |
| transcript | jsonb | `[{ "role": "user"|"assistant", "content": "..." }]` |
| score | float | nullable |
| created_at | timestamptz | |

---

## 5. Endpoints

> **Cột Implement:** `PostgREST` = bảng trực tiếp · `Edge` = Supabase Edge Function

### 5.1 Vocabulary

#### `GET /vocabularies` — **PostgREST** `vocabulary` (+ join `user_vocabulary`)

List từ (catalog + user scope tùy query).

| Query | Mô tả |
|-------|--------|
| `topic` | Lọc chủ đề |
| `limit`, `offset` | Pagination |

**200:** `{ "data": [ Vocabulary ], "meta": { ... } }`

#### `GET /vocabularies/:id`

**200:** `Vocabulary` · **404:** `NOT_FOUND`

#### `POST /vocabularies`

Tạo từ mới (FN-02) — gắn `user_vocabulary` cho device.

**Body:**

```json
{
  "word": "deploy",
  "meaning": "Triển khai",
  "pronunciation": "/dɪˈplɔɪ/",
  "part_of_speech": "verb",
  "context": "We will deploy the new version tonight.",
  "example": "We will deploy the new version tonight.",
  "topic": "Software Development",
  "difficulty_level": 2
}
```

**201:** `Vocabulary` (+ optional `user_vocabulary` id)

#### `PUT /vocabularies/:id`

Cập nhật từ user sở hữu.

**200:** `Vocabulary` · **404**

#### `DELETE /vocabularies/:id`

Xóa khỏi sổ user (hoặc soft-delete catalog — ghi trong implement).

**204** hoặc **200** `{ "deleted": true }`

---

### 5.2 Sentences

#### `GET /sentences`

| Query | `topic`, `limit`, `offset` |

**200:** `{ "data": [ UserSentence ], "meta": { ... } }`

#### `POST /sentences`

**Body:**

```json
{
  "sentence": "Let's sync after the standup.",
  "translation": "Chúng ta sync sau standup nhé.",
  "context": "Daily standup",
  "topic": "Daily Standup"
}
```

**201:** `UserSentence`

---

### 5.3 Collections

#### `GET /collections`

**200:** `{ "data": [ Collection ], "meta": { ... } }`

#### `POST /collections`

**Body:** `{ "title": "Scrum Vocabulary", "description": "..." }`

**201:** `Collection`

#### `GET /collections/:id`

**200:** `Collection` + `items: CollectionItem[]` (expanded vocab/sentence optional)

#### `POST /collections/:id/items`

**Body:**

```json
{
  "item_type": "vocabulary",
  "item_id": "uuid-of-vocab"
}
```

**201:** `CollectionItem`

#### `DELETE /collections/:id/items/:itemId`

**204**

---

### 5.4 Learning (SRS)

#### `GET /learning/schedule` — **Edge** `learning-schedule` (hoặc RPC SQL)

Việc ôn/học hôm nay cho device.

**200:**

```json
{
  "due_reviews": [{ "vocab_id": "...", "next_review": "...", "word": "deploy" }],
  "new_available": 5,
  "streak": 7,
  "xp_today": 40
}
```

> **Phase 2:** `GET /stats` tách dashboard đầy đủ; MVP gộp streak/xp vào schedule hoặc client aggregate.

#### `POST /learning/review` — **Edge** `learning-review`

Submit kết quả ôn (FN-05). Không tính SRS thuần trên client.

**Body:**

```json
{
  "vocab_id": "uuid",
  "rating": "good"
}
```

`rating` enum: `again` | `hard` | `good` | `easy`

**200:**

```json
{
  "progress": {
    "vocab_id": "uuid",
    "repetition_level": 2,
    "next_review": "2026-05-29T09:00:00.000Z",
    "accuracy": 0.85,
    "review_count": 3
  },
  "xp_earned": 10
}
```

**SRS:** Edge Function `learning-review` tính `next_review` (**Leitner** hoặc **SM-2** — chọn trong `03_debate.md` FN-05).

---

### 5.5 Conversation (AI)

#### `POST /conversation/start` — **Edge** `conversation-start`

**Body:**

```json
{
  "scenario_id": "uuid"
}
```

**201:**

```json
{
  "session_id": "uuid",
  "scenario": { "id": "...", "title": "Technical Interview" },
  "message": {
    "role": "assistant",
    "content": "Hi! Ready for a mock interview?"
  }
}
```

#### `POST /conversation/message` — **Edge** `conversation-message`

**Body:**

```json
{
  "session_id": "uuid",
  "content": "Yes, let's start!"
}
```

**200:**

```json
{
  "message": { "role": "assistant", "content": "Tell me about yourself." },
  "transcript": [ { "role": "user", "content": "..." }, { "role": "assistant", "content": "..." } ]
}
```

Lưu `conversation_logs` khi kết thúc session (phase 2: `POST /conversation/end`).

---

### 5.6 Speech

#### `POST /speech-to-text` — **Edge** `speech-to-text` (+ Storage upload tuỳ luồng)

`Content-Type: multipart/form-data`

| Part | Mô tả |
|------|--------|
| `audio` | file wav/m4a |
| `language` | optional `en` |

**200:**

```json
{
  "text": "We will deploy tonight",
  "confidence": 0.92
}
```

#### `POST /pronunciation-score` — **Edge** `pronunciation-score`

**Body:**

```json
{
  "text": "We will deploy tonight",
  "reference_text": "We will deploy the new version tonight.",
  "audio_url": "optional-if-already-uploaded"
}
```

Hoặc multipart kèm `audio` (cùng request).

**200:**

```json
{
  "overall": 0.78,
  "pronunciation": 0.8,
  "fluency": 0.75,
  "accuracy": 0.82,
  "confidence": 0.7
}
```

---

## 6. Ví dụ luồng

### 6.1 Học từ mới + ôn

1. `GET /learning/schedule` → danh sách due
2. `GET /vocabularies/:id` → hiển thị flashcard
3. `POST /learning/review` `{ rating: "good" }` → cập nhật SRS + XP

### 6.2 AI Chat

1. `POST /conversation/start` `{ scenario_id }`
2. `POST /conversation/message` lặp cho đến khi user thoát

---

## 7. Map REQ → API

| REQ | Nhóm API |
|-----|----------|
| REQ-01 | `GET /vocabularies`, `GET /vocabularies/:id` |
| REQ-02 | `POST|PUT|DELETE /vocabularies` |
| REQ-03 | `GET|POST /sentences` |
| REQ-04 | `/collections`, `/collections/:id/items` |
| REQ-05 | `GET /learning/schedule`, `POST /learning/review` |
| REQ-06 | Client + vocab context; có thể `GET /vocabularies` filter quiz |
| REQ-07 | `/conversation/start`, `/conversation/message` |
| REQ-08 | `POST /speech-to-text` |
| REQ-09 | `POST /pronunciation-score` |
| REQ-10 | `GET /learning/schedule` (+ phase 2 `/stats`) |
| REQ-11 | Push local — không REST bắt buộc MVP |

Spec FN: [`src/fn**/01_requirement.md`](../../../src/README.md).

---

## 8. Phase 2 (không MVP)

- `openapi.yaml` / Swagger UI
- `GET /stats` — dashboard đầy đủ (weekly/monthly)
- `POST /conversation/end` — finalize log + score
- Webhook Supabase Realtime cho multi-device sync

---

## 9. Lịch sử

| Ngày | Thay đổi |
|------|----------|
| 2026-05-28 | Tạo SSOT REST API từ SRS + UX doc |
| 2026-05-28 | **Supabase-only** — PostgREST + Edge Functions; bỏ custom REST host |
