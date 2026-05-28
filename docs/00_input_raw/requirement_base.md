# requirement_base — INPUT THÔ (SSOT)

> **SSOT thô** — bản chính thức. Bản mẫu ban đầu: `requirement_base.SAMPLE.md` (cùng nội dung).  
> **Đã đồng bộ** → [`process/00_requirement_business.md`](../../process/00_requirement_business.md) (2026-05-28).  
> **Sản phẩm:** **Học cùng Bee** — ứng dụng học tiếng Anh giao tiếp công việc (Workplace English with Bee)  
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

| Hạng mục | Chi tiết |
|----------|----------|
| Nền tảng | Android, iOS |
| Đối tượng | Sinh viên, Developer, Fresher IT, nhân viên văn phòng, người đi làm cần giao tiếp tiếng Anh |

### Công nghệ (tham chiếu)

| Layer | Công nghệ |
|-------|-----------|
| Frontend Mobile | React Native, TypeScript, Expo |
| Backend / Data | **Supabase only** — PostgreSQL, PostgREST, Edge Functions, Storage, Realtime |
| AI Services | OpenAI, Whisper, TTS — **chỉ qua Supabase Edge Functions** (không Express riêng) |
| State Management | Zustand |
| Local Storage | AsyncStorage, MMKV |
| Deployment | Supabase (cloud) + EAS Build |

### Kiến trúc (tham chiếu)

- Clean Architecture, SOLID, Modular Monolith
- **Presentation:** Screens, Components, Navigation, Hooks
- **Application:** Use Cases, Services, DTO
- **Domain:** Entities, Business Rules, Interfaces
- **Infrastructure:** Database, External APIs, Repository, Storage

**Thành phần hệ thống:**

| Thành phần | Mô tả |
|------------|--------|
| Mobile Application | UI/UX, `supabase-js`, Audio, Flashcard, Speaking, Context learning |
| Supabase | PostgreSQL + RLS, PostgREST, Edge Functions (SRS, AI, STT), Storage, Realtime |

---

## Yêu cầu thô

### FN-01 — Học từ vựng theo ngữ cảnh

Học từ qua ngữ cảnh, hội thoại, đoạn chat, tình huống công việc — **không** học từ riêng lẻ. Mỗi từ bắt buộc có **context**, **example**, **topic**.

**Trường từ vựng:** Word, Meaning (VI), Pronunciation, Part of speech, Context, Example, Topic, Difficulty level.

**Ví dụ:** Word: Deploy · Meaning: Triển khai · Context: *"We will deploy the new version tonight."* · Topic: Software Development

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

| Mức | Mô tả |
|-----|--------|
| Again | Chưa nhớ, học lại ngay |
| Hard | Khó, review gần |
| Good | Ổn, review bình thường |
| Easy | Dễ, review xa hơn |

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

Daily reminder, Review reminder, Streak reminder.

---

### Yêu cầu phi chức năng

| Nhóm | Yêu cầu |
|------|---------|
| **Performance** | Startup < 3s; API < 500ms; animation 60fps; offline learning |
| **Security** | Không đăng nhập; không lưu thông tin nhạy cảm; Device ID đồng bộ; HTTPS; mã hóa local cơ bản |
| **Scalability** | Modular; mở rộng AI; scale độc lập |
| **Maintainability** | SOLID, Clean Architecture, Repository Pattern, DI |
| **Availability** | Uptime ≥ 99.5%; auto backup DB |

---

### Database (thô)

**vocabulary:** id, word, meaning, pronunciation, part_of_speech, context, example, topic, difficulty_level, created_at

**user_vocabulary:** id, device_id, vocab_id, is_favorite, is_difficult, created_at

**user_sentences:** id, device_id, sentence, translation, context, topic, created_at

**learning_progress:** id, device_id, vocab_id, repetition_level, next_review, accuracy, review_count

**learning_collections:** id, device_id, title, description, created_at

**collection_items:** id, collection_id, item_type, item_id

**conversation_scenarios:** id, title, description, level, topic

**conversation_logs:** id, device_id, scenario_id, transcript (jsonb), score, created_at

---

### API (thô)

**Vocabulary:** GET/POST `/vocabularies`, GET/PUT/DELETE `/vocabularies/:id`

**Sentence:** POST/GET `/sentences`

**Collection:** POST/GET `/collections`, POST `/collections/:id/items`

**Learning:** POST `/learning/review`, GET `/learning/schedule`

**Conversation:** POST `/conversation/start`, POST `/conversation/message`

**Speech:** POST `/speech-to-text`, POST `/pronunciation-score`

---

### UI/UX (thô)

**Style:** Minimal, modern, mobile-first, **light + dark theme**, clean typography. UI SSOT: [`docs/02_system_design/sys_design_ux_ui.md`](../02_system_design/sys_design_ux_ui.md).

**Mục tiêu UX:** Học nhanh, không chán; focus speaking & context; tương tác đơn giản.

**Màn hình chính:** Splash, Home, Vocabulary Learning, Context Review, Speaking Practice, AI Chat, Collection, Progress Dashboard.

---

### Gamification (thô)

**XP:** XP points, daily streak, learning level.

| Achievement | Điều kiện |
|-------------|-----------|
| 7-day streak | Học liên tục 7 ngày |
| 100 learned words | 100 từ đã học |
| First conversation | Hoàn thành hội thoại đầu |
| Speaking master | Điểm speaking cao |

---

### Testing (thô)

| Loại | Phạm vi |
|------|---------|
| Unit | Learning algorithm, business logic, review scheduling |
| Integration | API, DB, AI service |
| E2E | Learning flow, Speaking flow, Review flow |

---

### Mở rộng tương lai (ngoài MVP — ghi nhận)

- AI: speaking coach, pronunciation correction, roadmap/context generation
- Smart recommendation: từ hay quên, chủ đề yếu, gợi ý context/review/chủ đề
- Social: leaderboard, team learning, community
- Cloud sync: multi-device, backup, restore progress

---

## Kết luận (tóm tắt khách hàng)

Nền tảng học tiếng Anh hiện đại: **context-based learning**, **communication-first**, **long-term memory**, **AI-assisted speaking** — dễ mở rộng, maintain, production-ready, tối ưu mobile.

---

## Người liên hệ / ngày

- **Nguồn tài liệu:** SRS — Ứng Dụng Học Tiếng Anh Giao Tiếp Công Việc
- **Ngày ghi nhận vào requirement_base:** 2026-05-28
- **Liên hệ:** _(bổ sung khi có)_
