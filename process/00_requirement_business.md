<!-- @file: process/00_requirement_business.md | @role: SSOT BDD — bảng REQ tổng | @source: docs/00_input_raw/requirement_base.md -->

# 00_requirement_business — SSOT nghiệp vụ (BDD)

> **Nguồn thô:** [`docs/00_input_raw/requirement_base.md`](../docs/00_input_raw/requirement_base.md)  
> **Sản phẩm:** Ứng dụng học tiếng Anh giao tiếp công việc · Android / iOS · không đăng nhập (Device ID)  
> **Cập nhật lần đầu:** 2026-05-28 — bootstrap từ SRS (FN-01…FN-11)

---

## 1. Tóm tắt sản phẩm

Ứng dụng mobile học tiếng Anh theo **ngữ cảnh công việc**, **spaced repetition**, **speaking / AI conversation**, gamification (XP, streak). Kiến trúc: Clean Architecture, React Native (Expo) + Node/Express + Supabase.

**Actor chính:** Người học (Learner) — sinh viên, developer, nhân viên văn phòng.

**Out of scope MVP (ghi nhận base):** Social, multi-device cloud sync đầy đủ, smart recommendation AI nâng cao — xem `requirement_base` § Mở rộng tương lai.

---

## 2. Map REQ ↔ Module `src/`

> **SSOT tài liệu FN:** 5 file `01`…`05` nằm **cùng thư mục module** dưới `src/` (rule `12-src-feature-docs.mdc`). Không dùng `process/features/`.

| REQ | STT | Feature ID | Thư mục `src/` |
|-----|-----|------------|----------------|
| REQ-01 | 1 | FN-01 | `fn01_hoc_tu_vung_ngu_canh/` |
| REQ-02 | 2 | FN-02 | `fn02_quan_ly_tu_vung_ca_nhan/` |
| REQ-03 | 3 | FN-03 | `fn03_quan_ly_cau_giao_tiep/` |
| REQ-04 | 4 | FN-04 | `fn04_learning_collection/` |
| REQ-05 | 5 | FN-05 | `fn05_spaced_repetition/` |
| REQ-06 | 6 | FN-06 | `fn06_context_review/` |
| REQ-07 | 7 | FN-07 | `fn07_ai_conversation/` |
| REQ-08 | 8 | FN-08 | `fn08_speech_to_text/` |
| REQ-09 | 9 | FN-09 | `fn09_pronunciation_scoring/` |
| REQ-10 | 10 | FN-10 | `fn10_dashboard_hoc_tap/` |
| REQ-11 | 11 | FN-11 | `fn11_notification_reminder/` |

**Tham chiếu kỹ thuật (không tách REQ riêng):** NFR, schema DB, API, UI shell, gamification, testing — mô tả trong `requirement_base`; chi tiết thiết kế → `docs/02_system_design/`, `docs/03_quality_assurance/` khi bootstrap tiếp.

---

## 5. Bảng yêu cầu nghiệp vụ (SSOT)

| STT | REQ | Tên chức năng | Biểu mẫu (BM) | Quy định (QĐ) | Ghi chú |
|-----|-----|---------------|---------------|---------------|---------|
| 1 | REQ-01 | Học từ vựng theo ngữ cảnh | Màn **Vocabulary Learning**; entity `vocabulary` (word, meaning, pronunciation, part_of_speech, context, example, topic, difficulty_level) | Mỗi từ **bắt buộc** có context + example + topic; **không** hiển thị học từ đơn lẻ không ngữ cảnh; hỗ trợ audio phát âm | Nền tảng cho FN-05, FN-06 |
| 2 | REQ-02 | Quản lý từ vựng cá nhân | Form thêm/sửa từ; danh sách từ; `user_vocabulary` (favorite, difficult) | CRUD từ gắn `device_id`; favorite/difficult cập nhật realtime trên thiết bị; xóa không ảnh hưởng từ hệ thống chung nếu tách catalog | |
| 3 | REQ-03 | Quản lý câu giao tiếp | Màn quản lý câu; `user_sentences` (sentence, translation, context, topic) | CRUD câu theo chủ đề (Standup, Scrum, Interview, Team, Email…); câu có context | Liên kết collection FN-04 |
| 4 | REQ-04 | Learning Collection | Màn **Collection**; `learning_collections`, `collection_items` (item_type, item_id) | Tạo/sửa/xóa bộ học; thêm từ hoặc câu vào bộ; một item thuộc đúng một collection tại thời điểm thêm | |
| 5 | REQ-05 | Học theo Spaced Repetition | Flashcard / queue ôn; `learning_progress` (repetition_level, next_review, accuracy, review_count) | Thuật toán **Leitner hoặc SM-2**; sau học user chọn Again/Hard/Good/Easy → hệ thống tính `next_review`; GET `/learning/schedule` trả việc hôm nay | POST `/learning/review` |
| 6 | REQ-06 | Context Review Mode | Màn **Context Review** | Hiển thị đoạn hội thoại/ngữ cảnh; hỗ trợ đoán nghĩa, điền từ, trả lời theo context; kết quả ghi vào progress | Phụ thuộc REQ-01, REQ-05 |
| 7 | REQ-07 | AI Conversation Practice | Màn **AI Chat**; `conversation_scenarios`, `conversation_logs` | Chọn scenario (Interview, Scrum, Team, Presentation, Customer…); POST start/message; lưu transcript + score | OpenAI / backend proxy |
| 8 | REQ-08 | Speech-to-Text | Màn **Speaking Practice**; API POST `/speech-to-text` | Ghi âm → text; so sánh với mẫu; highlight lỗi (UI) | Whisper hoặc tương đương |
| 9 | REQ-09 | Pronunciation Scoring | Kết quả speaking sau STT; POST `/pronunciation-score` | AI trả điểm/theo tiêu chí: pronunciation, fluency, accuracy, confidence; lưu vào log/dashboard | Liên FN-08, FN-10 |
| 10 | REQ-10 | Dashboard học tập | Màn **Progress Dashboard** | Hiển thị streak, XP, thống kê tuần/tháng, speaking score; đồng bộ từ progress & conversation logs | Gamification: achievement — base § Gamification |
| 11 | REQ-11 | Notification Reminder | Local/push notification (platform) | Daily, review due, streak; không spam; tôn trọng cài đặt tắt thông báo | Offline: nhắc khi có lịch local |

---

## 6. Gherkin tóm tắt (theo REQ)

### REQ-01 — Học từ vựng theo ngữ cảnh

```gherkin
Feature: Học từ vựng theo ngữ cảnh
  Là người học, tôi muốn xem từ trong ngữ cảnh công việc để hiểu cách dùng thực tế.

  Scenario: Hiển thị từ đủ trường bắt buộc
    Given từ "deploy" có context, example và topic Software Development
    When tôi mở bài học từ đó
    Then tôi thấy nghĩa, phát âm, loại từ, ví dụ và ngữ cảnh
    And không có màn chỉ hiển thị từ đơn lẻ không context
```

### REQ-02 — Quản lý từ vựng cá nhân

```gherkin
Feature: Quản lý từ vựng cá nhân
  Scenario: Đánh dấu favorite
    Given từ đã có trong sổ của tôi
    When tôi đánh dấu favorite
    Then từ xuất hiện trong danh sách yêu thích
```

### REQ-03 — Quản lý câu giao tiếp

```gherkin
Feature: Quản lý câu giao tiếp
  Scenario: Lưu câu standup
    Given tôi nhập câu tiếng Anh, bản dịch và context Daily Standup
    When tôi lưu
    Then câu hiển thị trong danh sách theo chủ đề Standup
```

### REQ-04 — Learning Collection

```gherkin
Feature: Learning Collection
  Scenario: Tạo bộ học theo chủ đề
    Given tôi tạo collection "Scrum Vocabulary"
    When tôi thêm từ vào collection
    Then collection hiển thị đúng số item
```

### REQ-05 — Spaced Repetition

```gherkin
Feature: Spaced Repetition
  Scenario: Lên lịch sau đánh giá Good
    Given từ đang trong hàng đợi ôn
    When tôi chọn mức "Good"
    Then hệ thống cập nhật next_review sau khoảng thời gian chuẩn thuật toán
    And từ xuất hiện trong lịch ôn tương ứng
```

### REQ-06 — Context Review

```gherkin
Feature: Context Review
  Scenario: Đoán nghĩa trong đoạn hội thoại
    Given đoạn "The backend team deployed the hotfix yesterday"
    When tôi trả lời nghĩa của "deploy"
    Then hệ thống chấm đúng/sai và ghi kết quả ôn
```

### REQ-07 — AI Conversation

```gherkin
Feature: AI Conversation Practice
  Scenario: Bắt đầu hội thoại interview
    Given scenario "Technical Interview"
    When tôi gửi tin nhắn đầu tiên
    Then AI phản hồi theo ngữ cảnh interview
    And transcript được lưu
```

### REQ-08 — Speech-to-Text

```gherkin
Feature: Speech-to-Text
  Scenario: Chuyển giọng nói thành chữ
    Given tôi ghi âm câu mẫu
    When tôi gửi audio lên server
    Then tôi nhận được bản text nhận dạng
```

### REQ-09 — Pronunciation Scoring

```gherkin
Feature: Pronunciation Scoring
  Scenario: Nhận điểm phát âm
    Given đã có text nhận dạng và câu mẫu
    When tôi yêu cầu chấm điểm
    Then tôi thấy điểm và các tiêu chí pronunciation, fluency, accuracy
```

### REQ-10 — Dashboard

```gherkin
Feature: Dashboard học tập
  Scenario: Xem streak và XP
    Given tôi đã học liên tục 3 ngày
    When tôi mở dashboard
    Then tôi thấy streak = 3 và XP tích lũy
```

### REQ-11 — Notification

```gherkin
Feature: Notification Reminder
  Scenario: Nhắc ôn tập
    Given có từ đến hạn review hôm nay
    When đến giờ nhắc đã cấu hình
    Then thiết bị hiển thị thông báo review
```

---

## 7. Phụ lục — NFR & ràng buộc chung (từ base, một REQ không tách)

| Nhóm | Quy định |
|------|----------|
| Performance | Startup < 3s; API < 500ms; 60fps; học offline được phần core |
| Security | Không login; Device ID; HTTPS; không PII nhạy cảm; mã hóa local cơ bản |
| Availability | Uptime ≥ 99.5%; backup DB |
| UI | **Học cùng Bee** — minimal, light + dark theme, 8 màn (Splash, Home, Vocab, Context Review, Speaking, AI Chat, Collection, Dashboard) — SSOT: [`docs/02_system_design/sys_design_ux_ui.md`](../docs/02_system_design/sys_design_ux_ui.md) |

---

## 8. Lịch sử thay đổi

| Ngày | Thay đổi | Nguồn |
|------|----------|-------|
| 2026-05-28 | Thêm REQ-01…REQ-11 (bootstrap SRS) | `requirement_base.md` FN-01…FN-11 |
| 2026-05-28 | Chuyển SSOT FN doc: `process/features/` → `src/fn**/` | Quyết định dự án + rule `12` |
