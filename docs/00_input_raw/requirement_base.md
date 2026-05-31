# requirement_base — INPUT THÔ (SSOT)

> **SSOT thô** — bản chính thức. Bản mẫu ban đầu: `requirement_base.SAMPLE.md` (cùng nội dung).  
> **Đã đồng bộ** → `[process/00_requirement_business.md](../../process/00_requirement_business.md)` (2026-05-28).  
> **Sản phẩm:** **Cuder Học Tiếng** — ứng dụng học tiếng Anh giao tiếp công việc (*Workplace English with Cuder*)  
> **Nguồn:** SOFTWARE REQUIREMENTS SPECIFICATION (SRS)  
> **Ngày ghi nhận:** 2026-05-28

---

## Mục đích sản phẩm

Tài liệu mô tả toàn bộ yêu cầu chức năng và phi chức năng của hệ thống ứng dụng học tiếng Anh giao tiếp trong công việc.

Ứng dụng tập trung vào:

- Học tiếng Anh theo ngữ cảnh
- Học giao tiếp thực tế
- Học bằng phương pháp lặp lại (Spaced Repetition)
- Tăng phản xạ giao tiếp công việc
- Ghi nhớ dài hạn

Hệ thống được thiết kế theo hướng: **Mobile-first**, **AI-assisted learning**, **Scalable architecture**, **Clean Architecture**, **Production-ready**.

### Mục tiêu hệ thống (người dùng)

- Học từ vựng theo ngữ cảnh thực tế
- Học mẫu câu giao tiếp công việc
- Luyện speaking
- Luyện phản xạ giao tiếp
- Ghi nhớ từ lâu dài
- Xây dựng thói quen học hằng ngày

### Phạm vi & đối tượng


| Hạng mục  | Chi tiết                                                                                    |
| --------- | ------------------------------------------------------------------------------------------- |
| Nền tảng  | Android, iOS · **Phase 2:** Web (responsive) đồng bộ qua mã thiết bị 6 số |
| Đối tượng | Sinh viên, Developer, Fresher IT, nhân viên văn phòng, người đi làm cần giao tiếp tiếng Anh |


### Công nghệ (tham chiếu)


| Layer            | Công nghệ                                                                        |
| ---------------- | -------------------------------------------------------------------------------- |
| Frontend Mobile  | React Native, TypeScript, Expo                                                   |
| Backend / Data   | **Supabase only** — PostgreSQL, PostgREST, Edge Functions, Storage, Realtime     |
| AI Services      | OpenAI, Whisper, TTS — **chỉ qua Supabase Edge Functions** (không Express riêng) |
| State Management | Zustand                                                                          |
| Local Storage    | AsyncStorage, MMKV                                                               |
| Deployment       | Supabase (cloud) + EAS Build                                                     |


### Kiến trúc (tham chiếu)

- Clean Architecture, SOLID, Modular Monolith
- **Presentation:** Screens, Components, Navigation, Hooks
- **Application:** Use Cases, Services, DTO
- **Domain:** Entities, Business Rules, Interfaces
- **Infrastructure:** Database, External APIs, Repository, Storage

**Thành phần hệ thống:**


| Thành phần         | Mô tả                                                                         |
| ------------------ | ----------------------------------------------------------------------------- |
| Mobile Application | UI/UX, `supabase-js`, Audio, Flashcard, Speaking, Context learning            |
| Supabase           | PostgreSQL + RLS, PostgREST, Edge Functions (SRS, AI, STT), Storage, Realtime |


---

## Yêu cầu thô

### FN-01 — Học từ vựng theo ngữ cảnh

Học từ qua ngữ cảnh, hội thoại, đoạn chat, tình huống công việc — **không** học từ riêng lẻ. Mỗi từ bắt buộc có **context**, **example**, **topic** và **đoạn hội thoại ngắn** (xem § Hội thoại bắt buộc).

**Trường từ vựng:** Word, Meaning (VI), Pronunciation, Part of speech, Context, Example, Topic, Difficulty level, **Dialogue** (đoạn hội thoại).

#### Hội thoại bắt buộc (mỗi từ vựng)

Mỗi mục học **phải** kèm **đoạn hội thoại** mô phỏng giao tiếp công việc trong ngành phát triển phần mềm:

| Quy định | Chi tiết |
| -------- | -------- |
| **Số câu** | **Tối thiểu 2**, **khuyến nghị 3**, **tối đa 5** câu thoại |
| **Ngữ cảnh** | Tình huống làm việc thực tế: họp, chat team, email, gọi khách hàng, review, triển khai, v.v. |
| **Vai trò (speaker)** | Ít nhất **2 vai** trong đoạn; gợi ý: **BA**, **Tester / QA**, **PM**, **DEV**, **Khách hàng (Customer)**, **DevOps**, **Network / Infra**, **Scrum Master**, **Tech Lead** |
| **Từ mục tiêu** | Từ đang học **xuất hiện ít nhất 1 lần** trong hội thoại (có thể highlight trên UI) |
| **Ngôn ngữ** | Câu thoại tiếng Anh; có thể kèm gợi ý dịch từng dòng (phase sau) |

**Ví dụ (từ *deploy*, 3 câu — PM ↔ DEV):**

| Speaker | Câu |
| ------- | --- |
| PM | Can we **deploy** the hotfix before the client demo at 3 PM? |
| DEV | Yes, QA signed off — we'll **deploy** to staging first, then production. |
| PM | Great. Ping me once the **deploy** finishes so I can notify the customer. |

**Topic gợi ý:** Agile / Scrum, Release & Deploy, Requirements (BA), Testing & QA, Customer call, DevOps & CI/CD, Network & Security, Code review, Incident / on-call.

**Ví dụ trường đơn (legacy):** Word: Deploy · Meaning: Triển khai · Context: *"We will deploy the new version tonight."* · Topic: Software Development — **bổ sung thêm** `dialogue` 2–5 câu khi seed/import (FN-16).

**UI học từ:** Hiển thị card từ → đoạn hội thoại dạng chat/bubble (speaker + câu) → ví dụ đơn (`example`) nếu khác hội thoại chính.

---

### FN-02 — Quản lý từ vựng cá nhân

Người dùng: thêm, chỉnh sửa, xóa từ; đánh dấu favorite; đánh dấu difficult words.

---

### FN-03 — Quản lý câu giao tiếp

Lưu mẫu câu / câu giao tiếp công việc; tạo bộ câu riêng.

**Chủ đề ví dụ:** Daily Standup, Scrum Meeting, Interview, Team Communication, Email Communication.

---

### FN-04 — Learning Collection

Tạo bộ từ vựng, bộ câu, bộ học theo chủ đề (vd. React Native Interview, Scrum Vocabulary, English For Developers).

---

### FN-05 — Học theo Spaced Repetition

Tự động lên lịch ôn theo khả năng ghi nhớ. Thuật toán: **Leitner** hoặc **SM-2**.

**Quy trình:** (1) Học từ mới → (2) Đánh giá mức ghi nhớ → (3) Hệ thống tính lịch review.


| Mức   | Mô tả                  |
| ----- | ---------------------- |
| Again | Chưa nhớ, học lại ngay |
| Hard  | Khó, review gần        |
| Good  | Ổn, review bình thường |
| Easy  | Dễ, review xa hơn      |


**Liên kết thông báo:** Lịch `next_review` từ FN-05 là **nội dung** nhắc ôn; **giờ gửi** nhắc ngắt quãng trong ngày do FN-11 cấu hình (xem § FN-11).

---

### FN-06 — Context Review Mode

Review qua hội thoại: đoán nghĩa, điền từ thiếu, trả lời theo context.

**Ví dụ:** Context: *"The backend team deployed the hotfix yesterday."* — Câu hỏi: Deploy trong ngữ cảnh này nghĩa là gì?

---

### FN-07 — AI Conversation Practice

Luyện hội thoại AI theo tình huống: Interview, Scrum meeting, Team discussion, Presentation, Customer communication.

---

### FN-08 — Speech-to-Text

Ghi âm; nhận dạng giọng nói; so sánh phát âm; highlight lỗi sai.

---

### FN-09 — Pronunciation Scoring

AI đánh giá: Pronunciation, Fluency, Accuracy, Speaking confidence.

---

### FN-10 — Dashboard học tập

Theo dõi: Daily streak, XP, thống kê học, tiến độ tuần/tháng, Speaking score.

---

### FN-11 — Notification Reminder

Nhắc học và ôn tập qua local/push notification (platform).

**Loại nhắc:** Daily habit, Review due (từ lịch FN-05), Streak at risk.

**Cài đặt giờ — nhắc ngắt quãng trong ngày:**

- Người dùng bật/tắt nhắc trong **Cài đặt → Thông báo**.
- Chọn **khung giờ hoạt động** trong ngày (vd. 08:00–22:00).
- Chọn **số lần nhắc/ngày** hoặc **khoảng cách giờ** (vd. mỗi 2h, mỗi 3h) — hệ thống **chia đều các mốc** trong khung giờ (phương pháp nhắc ngắt quãng theo giờ).
- Mỗi mốc: ưu tiên nội dung **từ đến hạn ôn** (FN-05); nếu không có thì nhắc **thói quen học** / streak.
- Không spam: tôn trọng tắt thông báo; gộp nhắc nếu nhiều từ cùng khung giờ.
- Offline: lịch nhắc lưu local; vẫn nhắc khi có dữ liệu ôn trên thiết bị.

**Ví dụ:** Khung 08:00–20:00, khoảng 3h → nhắc ~08:00, ~11:00, ~14:00, ~17:00, ~20:00.

---

### FN-12 — Quick Capture từ vựng (Share & Overlay)

Thu thập từ/câu **khi đọc ngoài app** (báo, mạng xã hội, trình duyệt, app khác) và **thêm vào bộ từ vựng** trong ứng dụng.

**Hai cách vào:**

| Cách | Mô tả | Nền tảng |
| ---- | ----- | -------- |
| **Bôi đen → Share** | Chọn (bôi đen) văn bản → menu Share → **Cuder Học Tiếng** → mở form thu gọn | Android Share Intent; iOS Share Extension |
| **Tab phụ trợ (Overlay)** | Bật **bong bóng / tab phụ trợ** nổi trên màn hình; đọc app bất kỳ → chạm bong bóng → panel nhập nhanh | Android overlay (quyền hiển thị trên app khác); iOS: widget / Shortcuts (overlay toàn màn hình hạn chế) |

**Luồng lưu:**

1. Nhận **từ/cụm đã chọn** (và câu xung quanh làm **context** nếu có).
2. Hiển thị form tối giản: từ, nghĩa (tùy nhập hoặc gợi ý AI), context, chọn **collection** (FN-04).
3. Lưu → `user_vocabulary` + item collection; tuân quy tắc context bắt buộc (FN-01).
4. Tuỳ chọn: đưa vào hàng ôn FN-05.

**Quy định:**

- Không đọc toàn bộ màn hình app khác nếu không cần — chỉ xử lý **text user chủ động chọn** hoặc **dán/nhập** trong overlay (privacy).
- Ghi metadata nguồn (tên app / URL nếu Share cung cấp) để tra cứu sau.
- Trùng từ đã có: hỏi cập nhật context hoặc bỏ qua.

**Liên kết:** FN-02 (CRUD từ cá nhân), FN-04 (collection), FN-01 (context), FN-05 (ôn sau khi thêm).

---

### FN-16 — Import bộ từ vựng (Excel / CSV / JSON)

Nhập **hàng loạt** từ vựng (kèm hội thoại FN-01) từ file theo **format chuẩn của app** — dùng cho **Admin** (catalog hệ thống) và **người học** (import vào sổ/collection cá nhân, nếu bật quyền).

#### Định dạng file hỗ trợ

| Định dạng | Ghi chú |
| --------- | ------- |
| **CSV** | UTF-8; dấu phẩy hoặc `;`; header dòng 1 |
| **Excel** | `.xlsx` / `.xls` — sheet đầu tiên hoặc sheet tên `vocabulary` |
| **JSON** | Mảng `items[]` hoặc wrapper `{ "version": "1.0", "items": [...] }` |

#### Cột / trường bắt buộc (format app v1)

| Trường | CSV/Excel column | JSON key | Bắt buộc | Ghi chú |
| ------ | ---------------- | -------- | -------- | ------- |
| Từ | `word` | `word` | Có | Unique trong batch (case-insensitive) |
| Nghĩa VI | `meaning` | `meaning` | Có | |
| Phát âm | `pronunciation` | `pronunciation` | Không | IPA hoặc text |
| Loại từ | `part_of_speech` | `partOfSpeech` | Không | noun, verb, … |
| Topic | `topic` | `topic` | Có | vd. Agile / Scrum |
| Độ khó | `difficulty_level` | `difficultyLevel` | Không | 1–5; default 2 |
| Context (1 câu) | `context` | `context` | Có | Câu ngắn chứa từ |
| Ví dụ | `example` | `example` | Có | Có thể trùng 1 câu trong dialogue |
| **Hội thoại** | `dialogue_json` **hoặc** `dialogue_line_1`…`dialogue_line_5` | `dialogue` | Có | 2–5 câu; mỗi câu có `speaker` + `text` |

**Cột hội thoại — CSV/Excel (cách 1 — flat):**

| dialogue_line_1_speaker | dialogue_line_1_text | dialogue_line_2_speaker | dialogue_line_2_text | … |
| ----------------------- | -------------------- | ------------------------- | -------------------- | - |
| PM | Can we deploy the hotfix? | DEV | QA signed off — we'll deploy tonight. | … |

**JSON `dialogue` (cách 2 — khuyến nghị):**

```json
{
  "scenario": "Release planning",
  "workplace_role": "PM, DEV",
  "lines": [
    { "speaker": "PM", "text": "Can we deploy the hotfix before the demo?" },
    { "speaker": "DEV", "text": "Yes — we'll deploy to staging first." },
    { "speaker": "PM", "text": "Ping me when the deploy finishes." }
  ]
}
```

**Validate khi import:**

- Mỗi dòng: đủ `word`, `meaning`, `context`, `example`, `topic`, **dialogue 2–5 câu**.
- Mỗi câu dialogue: có `speaker` + `text`; `text` không rỗng.
- Từ mục tiêu (`word`) **có mặt** trong ít nhất một câu dialogue (không phân biệt hoa thường).
- Trùng `word` đã có: **báo preview** — skip / cập nhật / ghi đè (admin); learner: hỏi merge vào collection.

#### Luồng nghiệp vụ

| Actor | Kênh | Kết quả |
| ----- | ---- | ------- |
| **Admin** | Admin portal / Edge Function | Ghi `vocabulary` catalog hệ thống |
| **Learner** | Collection → **Import file** hoặc Cài đặt (nếu `allow_vocab_import`) | Ghi `user_vocabulary` + tuỳ chọn gắn `learning_collections` |

**Báo cáo import:** tổng dòng, thành công, lỗi (kèm số dòng + lý do); không import dòng lỗi; transaction theo batch.

**Template mẫu:** [`docs/templates/vocabulary_import_template.csv`](../templates/vocabulary_import_template.csv), [`vocabulary_import_template.json`](../templates/vocabulary_import_template.json)

**Liên kết:** FN-01 (dialogue bắt buộc), FN-02, FN-04, FN-15 (`allow_vocab_import` trong `permissions` — gợi ý).

---

### FN-17 — AI sinh hội thoại & giải thích tiếng mẹ đẻ (khi thêm từ)

Khi người học **thêm từ vựng**, gọi Edge Function **`vocab-enrich`** để AI sinh:
- Hội thoại workplace **2–5 câu** (FN-01)
- Khối **giải thích** bằng **ngôn ngữ mẹ đẻ** (`profiles.native_language`)

#### Chế độ

| Mode | Input | AI |
| ---- | ----- | --- |
| `full` | `word` (+ topic, roles tuỳ chọn) | Sinh đầy đủ metadata + dialogue + explanation |
| `enrich` | `word` + ít nhất một trong `meaning` / `context` / `example` | Giữ field user; bổ sung phần thiếu + dialogue + explanation |

#### Ngôn ngữ mẹ đẻ

- Cài đặt → **Ngôn ngữ mẹ đẻ**: `vi`, `en`, `zh`, `ja`, `ko` (MVP)
- Lưu `profiles.native_language`; gửi trong body `native_language`

#### Luồng app

1. Form thêm từ (FN-02) → **Tạo hội thoại AI** → preview
2. User **Lưu** → INSERT `vocabulary` (+ `dialogue`, `explanation_native`) + `user_vocabulary`
3. Màn học (FN-01) hiển thị bubbles + card giải thích

**API:** `POST /functions/v1/vocab-enrich` · **Quyền:** `allow_ai_vocab_enrich` · **Test:** Cucumber + Serenity/JS (`tests/features/fn17/`)

**Liên kết:** FN-01, FN-02, FN-15, FN-12 (phase sau — reuse API)

---

### FN-15 — Cấu hình thương hiệu & quyền hệ thống (Admin only)

**Nguyên tắc:** Người học (learner) **chỉ đọc** brand + quyền; **chỉ Admin** được đổi logo, màu chủ đạo, tên brand và feature flags.

#### Phân quyền

| Vai trò | Đọc brand/quyền | Sửa logo/màu/tên | Sửa quyền hệ thống | Kênh |
| ------- | --------------- | ---------------- | ------------------- | ---- |
| **Learner** (Device ID / anon auth) | Có | **Không** | **Không** | App mobile |
| **Admin** (`app_admins`) | Có | **Có** | **Có** | Admin portal / Supabase Dashboard / Edge Function |

**Bảng admin:** `app_admins` (`user_id`, `email`, `role`: `super_admin` \| `brand_admin` \| `ops_admin`).

#### Cấu hình brand — `app_brand_config` (singleton)

| Trường | Learner app | Admin sửa |
| ------ | ----------- | --------- |
| `logo_url` / `logo_storage_path` | Hiển thị logo | Upload Storage + cập nhật DB |
| `brand_name`, `brand_tagline`, `brand_subtitle` | Hiển thị Splash/Home | Form admin |
| `brand_primary_hex`, `brand_primary_light_hex` | Theme runtime (đọc DB) | Color picker admin |
| Storage `brand-assets/*` | GET public | INSERT/UPDATE/DELETE **admin only** (RLS) |

**MVP admin:** Supabase Dashboard (SQL Editor, Storage, Table Editor) hoặc seed `app_admins` sau khi tạo user Auth. **Phase sau:** Web Admin portal (REQ-13 mở rộng).

#### Cấu hình quyền — `app_system_config.permissions` (JSON)

| Key (gợi ý) | Mặc định | Ý nghĩa |
| ------------- | -------- | ------- |
| `allow_user_vocab_crud` | `true` | FN-02 CRUD từ cá nhân |
| `allow_quick_capture` | `true` | FN-12 Share/Overlay |
| `allow_ai_tutor` | `true` | FN-07 Gia sư AI |
| `allow_social_rank` | `false` | FN-14 (Phase 2) |
| `allow_web_sync` | `false` | FN-13 (Phase 2) |
| `allow_vocab_import` | `true` | FN-16 import Excel/CSV/JSON |
| `allow_ai_vocab_enrich` | `true` | FN-17 AI dialogue + giải thích |

App fetch `app_system_config` lúc khởi động → ẩn/hiện menu & tính năng theo flag (không hardcode).

#### Quy định bảo mật

- RLS: `is_app_admin()` mới UPDATE `app_brand_config`, `app_system_config`; upload Storage `brand-assets`.
- **Không** có màn Cài đặt learner để đổi logo/màu brand.
- Audit (phase sau): `updated_by` trên `app_system_config`; log admin actions.

**Liên kết:** § UI/UX `sys_design_ux_ui.md` §2.7 · `fn15_brand_config/` · migration admin RLS.

---


| Nhóm                | Yêu cầu                                                                                      |
| ------------------- | -------------------------------------------------------------------------------------------- |
| **Performance**     | Startup < 3s; API < 500ms; animation 60fps; offline learning                                 |
| **Security**        | **MVP:** không đăng nhập; Device ID local; HTTPS; mã hóa local cơ bản · **Phase 2:** liên kết thiết bị bằng **mã 6 số** (pairing), không email/mật khẩu bắt buộc |
| **Scalability**     | Modular; mở rộng AI; scale độc lập                                                           |
| **Maintainability** | SOLID, Clean Architecture, Repository Pattern, DI                                            |
| **Availability**    | Uptime ≥ 99.5%; auto backup DB                                                               |


---

### Database (thô)

**vocabulary:** id, word, meaning, pronunciation, part_of_speech, context, example, topic, difficulty_level, **dialogue (jsonb)** — `{ scenario, workplace_role, lines: [{ speaker, text }] }`, line count **2–5**, created_at

**vocab_import_batches:** id, imported_by (device_id hoặc admin user_id), source_filename, format (csv|xlsx|json), total_rows, success_count, error_log (jsonb), created_at

**user_vocabulary:** id, device_id, vocab_id, is_favorite, is_difficult, created_at

**user_sentences:** id, device_id, sentence, translation, context, topic, created_at

**learning_progress:** id, device_id, vocab_id, repetition_level, next_review, accuracy, review_count

**notification_settings:** id, device_id, enabled, window_start, window_end, interval_hours, reminder_types (jsonb), updated_at

**vocab_capture:** id, device_id, word, meaning, context, source_app, source_url, collection_id, created_at

**learning_collections:** id, device_id, title, description, created_at

**collection_items:** id, collection_id, item_type, item_id

**conversation_scenarios:** id, title, description, level, topic

**conversation_logs:** id, device_id, scenario_id, transcript (jsonb), score, created_at

**app_brand_config:** id (singleton = 1), brand_name, brand_tagline, brand_subtitle, logo_url, logo_storage_path, brand_primary_hex, brand_primary_light_hex, updated_at

**app_admins:** user_id (PK → auth.users), email, role, created_at

**app_system_config:** id (singleton = 1), permissions (jsonb), updated_at, updated_by

> Logo/màu/tên: **admin sửa** · learner **chỉ đọc**. Storage `brand-assets` ghi = admin RLS.

---

### API (thô)

**Vocabulary:** GET/POST `/vocabularies`, GET/PUT/DELETE `/vocabularies/:id`

**Import (FN-16):** POST `/vocabularies/import` (multipart file hoặc JSON body) — admin catalog; POST `/user-vocabularies/import` — learner + `collection_id` tuỳ chọn; GET `/vocabularies/import/template` — tải CSV/JSON mẫu

**Sentence:** POST/GET `/sentences`

**Collection:** POST/GET `/collections`, POST `/collections/:id/items`

**Learning:** POST `/learning/review`, GET `/learning/schedule`

**Notification:** GET/PUT `/notifications/settings`, POST `/notifications/schedule-local`

**Capture:** POST `/vocabularies/capture` (từ Share/overlay — body: word, context, collection_id, source_*)

**AI enrich (FN-17):** POST `/functions/v1/vocab-enrich` — body mode, word, partial fields, native_language; preview trước khi lưu vocabulary

**Brand (learner read):** GET `/brand/config`, GET `/system/permissions`

**Brand (admin only):** PUT `/admin/brand/config`, PUT `/admin/system/permissions`, POST Storage `brand-assets/*` — yêu cầu `app_admins` + JWT authenticated

**Conversation:** POST `/conversation/start`, POST `/conversation/message`

**Speech:** POST `/speech-to-text`, POST `/pronunciation-score`

---

### UI/UX (thô)

**Style:** Minimal, modern, mobile-first, **light + dark theme**, clean typography. UI SSOT: `[docs/02_system_design/sys_design_ux_ui.md](../02_system_design/sys_design_ux_ui.md)`.

**Mục tiêu UX:** Học nhanh, không chán; focus speaking & context; tương tác đơn giản.

**Màn hình chính:** Splash, Home, Vocabulary Learning (**card từ + hội thoại 2–5 câu**), Context Review, Speaking Practice, AI Chat, Collection (**Import file**), Progress Dashboard, **Quick Capture (Share sheet / Overlay panel)**, **Cài đặt nhắc ngắt quãng** (trong Settings).

---

### Âm thanh & phản hồi (SFX)

> **SSOT file:** [`brand/AUDIO_MANIFEST.md`](../../brand/AUDIO_MANIFEST.md) · **Thư mục drop:** [`brand/`](../../brand/)

**Phản hồi chọn đáp án (đúng / sai):**

| Sự kiện | File | Quy định |
| -------- | ----- | -------- |
| Đáp án đúng | `answer_correct.mp3` | Phát ngay khi chọn; kết hợp màu xanh / +XP |
| Đáp án sai | `answer_wrong.mp3` | Phát ngay; kết hợp màu đỏ; không chói tai |
| +XP / streak | `xp_gain.mp3`, `streak_tick.mp3` | Tuỳ chọn sau câu đúng / hoàn mục tiêu ngày |

**Nhắc học (FN-11):**

| Biến thể | File | Khi dùng |
| -------- | ----- | -------- |
| Mặc định | `reminder_default.mp3` | Mốc nhắc ngắt quãng trong khung giờ |
| Nhẹ | `reminder_gentle.mp3` | User chọn kiểu nhắc nhẹ |
| Khẩn | `reminder_urgent.mp3` | Streak sắp mất |

**Cài đặt:** Cài đặt → **Âm thanh** — bật/tắt riêng «Âm thanh học tập» và «Âm thanh nhắc nhở»; tôn trọng chế độ im lặng hệ thống.

**Bộ nhận diện:** Logo, mascot Cuder, hình rank, illustration → `brand/logo/`, `brand/images/`.

**Cấu hình brand (FN-15):** Learner **không** sửa logo/màu; admin qua portal/Supabase. App đọc DB + áp dụng quyền từ `app_system_config`.

---

### Gamification (thô)

**XP:** XP points, daily streak, learning level.

**Hạng leo rank (Phase 2 — FN-14):** Theo **điểm rank** tích lũy (XP tuần + streak bonus + thử thách nhóm). Theme vui «gà học» — có thể đổi skin Bee sau.


| Hạng | Tên hiển thị | Ngưỡng rank point (gợi ý) |
| ---- | ------------ | ------------------------- |
| 1 | **Gà con** | 0 – 499 |
| 2 | **Gà mới lớn** | 500 – 1.999 |
| 3 | **Gà chiến** | 2.000 – 4.999 |
| 4 | **Chiến thần gà** | 5.000 – 9.999 |
| 5 | **Thần IELTS 10 điểm** | 10.000 – 19.999 |
| 6 | **Cuder tối thượng** *(tuỳ chọn)* | ≥ 20.000 |


| Achievement        | Điều kiện                |
| ------------------ | ------------------------ |
| 7-day streak       | Học liên tục 7 ngày      |
| 100 learned words  | 100 từ đã học            |
| First conversation | Hoàn thành hội thoại đầu |
| Speaking master    | Điểm speaking cao        |
| Top 3 tuần         | Lọt top 3 bảng xếp hạng bạn bè (Phase 2) |


---

### Testing (thô)


| Loại        | Phạm vi                                               |
| ----------- | ----------------------------------------------------- |
| Unit        | Learning algorithm, business logic, review scheduling |
| Integration | API, DB, AI service                                   |
| E2E         | Learning flow, Speaking flow, Review flow             |


---

### Mở rộng tương lai (Phase 2 — ngoài MVP)

> **Ghi chú phạm vi:** MVP vẫn **mobile-only**, không bắt buộc đăng nhập. Phase 2 bổ sung **Web + đồng bộ mã 6 số + bạn bè/rank** — chi tiết FN-13, FN-14 bên dưới.

**Khác (chưa chi tiết hoá):**

- AI: speaking coach, pronunciation correction, roadmap/context generation
- Smart recommendation: từ hay quên, chủ đề yếu, gợi ý context/review/chủ đề

---

#### FN-13 — Web học tập & đồng bộ đa thiết bị (Mã thiết bị 6 số)

**Mục tiêu:** Học từ vựng trên **giao diện Web** (desktop/tablet/mobile browser) và **đồng bộ** với app điện thoại — thuận tiện khi làm việc trên máy tính.

**Xác thực — không email/mật khẩu:**

| Bước | Mobile (đã có Device ID) | Web |
| ---- | ------------------------ | --- |
| 1 | **Cài đặt → Mã đồng bộ** — hiển thị **mã 6 số** (vd. `482913`); TTL ~10 phút, có nút **Tạo mã mới** | Màn **Nhập mã thiết bị** — 6 ô số |
| 2 | User xác nhận «Cho phép liên kết Web» trên điện thoại (tuỳ chọn) | Gửi mã → server ghép `web_session` ↔ `device_id` |
| 3 | — | Web vào **Home học** — dữ liệu pull từ cloud |

**Quy định mã 6 số:**

- Chỉ chữ số `0–9`; **6 ký tự**; không trùng mã đang active; hết hạn sau TTL.
- Brute-force: giới hạn số lần nhập sai / IP; khóa tạm nếu vượt ngưỡng.
- Một `device_id` có thể liên kết **nhiều phiên Web** (giới hạn cấu hình, vd. tối đa 3).
- **Huỷ liên kết:** trên mobile hoặc Web → logout → xóa session; dữ liệu trên cloud giữ theo `device_id`.

**Phạm vi đồng bộ (ưu tiên):**

| Dữ liệu | Chiều sync | Ghi chú |
| -------- | ----------- | ------- |
| Từ vựng cá nhân (`user_vocabulary`) | ↔ hai chiều | Merge theo `updated_at`; conflict → hỏi user hoặc last-write-wins |
| Collection + items | ↔ | |
| Learning progress / lịch ôn (FN-05) | ↔ | Web có thể ôn flashcard |
| Câu giao tiếp | ↔ | |
| Streak, XP, rank (FN-14) | ↔ | |
| Speaking / AI chat | Mobile ưu tiên | Web phase 2.1: có thể chỉ đọc lịch sử |

**Giao diện Web (tối thiểu):**

- Responsive; dùng chung design token [`sys_design_ux_ui.md`](../02_system_design/sys_design_ux_ui.md).
- Màn: Login mã 6 số, Home, Danh sách từ/collection, Flashcard ôn, Cài đặt (huỷ liên kết).
- **Không** bắt buộc Quick Capture overlay trên Web (chỉ mobile).

**Công nghệ gợi ý:** Next.js hoặc Expo Web + Supabase Realtime / sync API.

**Liên kết:** FN-02, FN-04, FN-05, FN-10.

---

#### FN-14 — Kết nối bạn bè & bảng xếp hạng (Leo rank)

**Mục tiêu:** Học cùng bạn bè, so kè **XP / streak / tiến độ tuần**, leo **hạng rank** theo theme vui.

**Kết nối bạn:**

| Cách | Mô tả |
| ---- | ----- |
| **Mã bạn bè** | Mỗi user có **mã hoặc username** hiển thị (sinh từ `device_id` / nickname tự đặt); gửi cho bạn → **Thêm bạn** |
| **Mời link** | Link deeplink/web mời kết bạn (Phase 2.1) |
| **Trạng thái** | Pending → Accepted; chặn / huỷ kết bạn |

**Bảng xếp hạng:**

- **Bạn bè:** xếp hạng trong danh sách bạn (XP tuần, streak hiện tại, số từ đã học tuần).
- **Tuần / Tháng:** reset bảng tuần; rank point tích lũy **không** reset (leo hạng vĩnh viễn).
- Hiển thị **hạng hiện tại** + thanh tiến độ lên hạng kế (vd. «Gà chiến → Chiến thần gà: còn 1.200 điểm»).

**Hạng rank (SSOT tên):**

1. **Gà con**
2. **Gà mới lớn**
3. **Gà chiến**
4. **Chiến thần gà**
5. **Thần IELTS 10 điểm**
6. *(Tuỳ chọn mở rộng)* **Cuder tối thượng** — cấp cao nhất, đồng bộ mascot app

**Quy định:**

- Chỉ so sánh **metric công khai** user đồng ý (privacy toggle trong Cài đặt).
- Không chat riêng bắt buộc MVP social — có thể chỉ leaderboard + «cùng học thử thách tuần» (Phase 2.1).
- Chống gian lận: XP từ hoạt động học hợp lệ (có session duration tối thiểu, không spam review).

**Thử thách nhóm (tuỳ chọn Phase 2.1):** Nhóm bạn chung mục tiêu tuần (vd. 50 từ) — bonus rank point khi hoàn thành.

**Liên kết:** FN-10 (dashboard, XP), FN-13 (cần sync cloud để rank đa thiết bị).

---

#### Phase 2 — Database bổ sung (thô)

**device_pairing_codes:** id, device_id, code (6 char), expires_at, used_at, created_at

**web_sessions:** id, device_id, session_token, user_agent, last_active_at, created_at

**user_profiles:** device_id (PK), display_name, friend_code, rank_points, rank_tier, privacy_settings (jsonb), updated_at

**friendships:** id, requester_device_id, addressee_device_id, status, created_at

**leaderboard_snapshots:** id, period (week/month), device_id, xp, words_learned, streak, rank_position, computed_at

---

#### Phase 2 — API bổ sung (thô)

**Sync / Auth:** POST `/pairing/code` (mobile tạo mã), POST `/pairing/link` (web nhập mã), DELETE `/sessions/web`, GET `/sync/pull`, POST `/sync/push`

**Friends:** POST `/friends/request`, POST `/friends/accept`, GET `/friends`, DELETE `/friends/:id`

**Leaderboard:** GET `/leaderboard/friends?period=week`, GET `/profile/rank`

---

## Kết luận (tóm tắt khách hàng)

Nền tảng học tiếng Anh hiện đại: **context-based learning**, **communication-first**, **long-term memory**, **AI-assisted speaking** — dễ mở rộng, maintain, production-ready, tối ưu mobile.

---

## Người liên hệ / ngày

- **Nguồn tài liệu:** SRS — Ứng Dụng Học Tiếng Anh Giao Tiếp Công Việc
- **Ngày ghi nhận vào requirement_base:** 2026-05-28
- **Bổ sung 2026-05-31:** FN-12 Quick Capture (Share/Overlay); FN-11 nhắc ngắt quãng theo giờ + liên FN-05
- **Bổ sung 2026-05-31:** Phase 2 — FN-13 Web + mã đồng bộ 6 số; FN-14 bạn bè & leo rank (Gà con → Thần IELTS 10 điểm)
- **Bổ sung 2026-05-31:** FN-15 Cấu hình brand (admin only); `brand_name` DB
- **Bổ sung 2026-05-31:** FN-01 bổ sung **hội thoại 2–5 câu** theo vai BA/Tester/PM/DEV/Khách hàng/DevOps/Network…; **FN-16** import bộ từ Excel/CSV/JSON theo format app
- **Liên hệ:** *(bổ sung khi có)*

