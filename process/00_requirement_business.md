<!-- @file: process/00_requirement_business.md | @role: SSOT BDD — bảng REQ tổng | @source: docs/00_input_raw/requirement_base.md -->

# 00_requirement_business — SSOT nghiệp vụ (BDD)

> **Nguồn thô:** [`docs/00_input_raw/requirement_base.md`](../docs/00_input_raw/requirement_base.md)  
> **Sản phẩm:** Ứng dụng học tiếng Anh giao tiếp công việc · Android / iOS · không đăng nhập (Device ID)  
> **Cập nhật lần đầu:** 2026-05-28 — bootstrap từ SRS (FN-01…FN-11)

---

## 1. Tóm tắt sản phẩm

Ứng dụng mobile học tiếng Anh theo **ngữ cảnh công việc**, **spaced repetition**, **speaking / AI conversation**, gamification (XP, streak). Kiến trúc: Clean Architecture, React Native (Expo) + Node/Express + Supabase.

**Actor chính:** Người học (Learner) — sinh viên, developer, nhân viên văn phòng.

**Out of scope MVP (ghi nhận base):** Smart recommendation AI nâng cao — xem `requirement_base` § Mở rộng. **Phase 2 (đã ghi chi tiết base):** Web + mã đồng bộ 6 số (FN-13), bạn bè & leo rank (FN-14) — xem §9.

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
| REQ-12 | 12 | FN-12 | `fn12_quick_capture_vocab/` |
| REQ-15 | 15 | FN-15 | `fn15_brand_config/` |
| REQ-16 | 16 | FN-16 | `fn16_vocab_import/` |
| REQ-17 | 17 | FN-17 | `fn17_vocab_ai_enrich/` |

**Tham chiếu kỹ thuật (không tách REQ riêng):** NFR, schema DB, API, UI shell, gamification, testing — mô tả trong `requirement_base`; chi tiết thiết kế → `docs/02_system_design/`, `docs/03_quality_assurance/` khi bootstrap tiếp.

---

## 5. Bảng yêu cầu nghiệp vụ (SSOT)

| STT | REQ | Tên chức năng | Biểu mẫu (BM) | Quy định (QĐ) | Ghi chú |
|-----|-----|---------------|---------------|---------------|---------|
| 1 | REQ-01 | Học từ vựng theo ngữ cảnh | Màn **Vocabulary Learning**; entity `vocabulary` (+ `dialogue` jsonb) | Mỗi từ **bắt buộc** context + example + topic + **hội thoại 2–5 câu** (≥2 vai: BA, Tester, PM, DEV, Customer, DevOps, Network…); từ mục tiêu xuất hiện trong dialogue; **không** học từ đơn lẻ; audio phát âm | Nền tảng FN-05, FN-06; import FN-16 |
| 2 | REQ-02 | Quản lý từ vựng cá nhân | Form **Thêm từ + AI preview**; danh sách; `user_vocabulary` | CRUD gắn `device_id`; **preview AI** (FN-17) trước lưu; favorite/difficult realtime | Liên FN-17 |
| 3 | REQ-03 | Quản lý câu giao tiếp | Màn quản lý câu; `user_sentences` (sentence, translation, context, topic) | CRUD câu theo chủ đề (Standup, Scrum, Interview, Team, Email…); câu có context | Liên kết collection FN-04 |
| 4 | REQ-04 | Learning Collection | Màn **Collection**; `learning_collections`, `collection_items` (item_type, item_id) | Tạo/sửa/xóa bộ học; thêm từ hoặc câu vào bộ; một item thuộc đúng một collection tại thời điểm thêm | |
| 5 | REQ-05 | Học theo Spaced Repetition | Flashcard / queue ôn; `learning_progress` (repetition_level, next_review, accuracy, review_count) | Thuật toán **Leitner hoặc SM-2**; sau học user chọn Again/Hard/Good/Easy → hệ thống tính `next_review`; GET `/learning/schedule` trả việc hôm nay | POST `/learning/review`; **nội dung nhắc ôn** cho FN-11 |
| 6 | REQ-06 | Context Review Mode | Màn **Context Review** | Hiển thị đoạn hội thoại/ngữ cảnh; hỗ trợ đoán nghĩa, điền từ, trả lời theo context; kết quả ghi vào progress | Phụ thuộc REQ-01, REQ-05 |
| 7 | REQ-07 | AI Conversation Practice | Màn **AI Chat**; `conversation_scenarios`, `conversation_logs` | Chọn scenario (Interview, Scrum, Team, Presentation, Customer…); POST start/message; lưu transcript + score | OpenAI / backend proxy |
| 8 | REQ-08 | Speech-to-Text | Màn **Speaking Practice**; API POST `/speech-to-text` | Ghi âm → text; so sánh với mẫu; highlight lỗi (UI) | Whisper hoặc tương đương |
| 9 | REQ-09 | Pronunciation Scoring | Kết quả speaking sau STT; POST `/pronunciation-score` | AI trả điểm/theo tiêu chí: pronunciation, fluency, accuracy, confidence; lưu vào log/dashboard | Liên FN-08, FN-10 |
| 10 | REQ-10 | Dashboard học tập | Màn **Progress Dashboard** | Hiển thị streak, XP, thống kê tuần/tháng, speaking score; đồng bộ từ progress & conversation logs | Gamification: achievement — base § Gamification |
| 11 | REQ-11 | Notification Reminder | Màn **Cài đặt → Thông báo**; local notification | **Nhắc ngắt quãng theo giờ:** khung giờ/ngày + khoảng cách hoặc số lần nhắc; chia mốc đều trong khung; nội dung ưu tiên từ đến hạn ôn (FN-05), sau đó habit/streak; không spam; tắt được | Offline: lịch local |
| 12 | REQ-12 | Quick Capture từ vựng (Share & Overlay) | Share sheet **Cuder Học Tiếng**; panel/bong bóng overlay; form thu gọn chọn collection | Chỉ text user chọn/dán; bắt buộc context (FN-01); lưu `user_vocabulary` + collection (FN-04); metadata nguồn; trùng từ → cập nhật hoặc bỏ qua | Liên FN-02, FN-04, FN-05 |
| 15 | REQ-15 | Cấu hình thương hiệu & quyền | Admin portal / Supabase; `app_brand_config`, `app_system_config`, `app_admins` | **Chỉ admin** sửa logo, màu, tên, feature flags; learner **read-only**; RLS `is_app_admin()` | `fn15_brand_config/` |
| 16 | REQ-16 | Import bộ từ vựng | Màn **Collection → Import**; template CSV/JSON; API import | Excel/CSV/JSON format app v1; validate dialogue 2–5 câu; admin → catalog; learner → user_vocab + collection | Liên FN-01, FN-02, FN-04 |
| 17 | REQ-17 | AI enrich hội thoại | Edge **`vocab-enrich`**; form FN-02 preview | Mode full/enrich; dialogue 2–5 câu; explanation_native theo ngôn ngữ mẹ đẻ; flag `allow_ai_vocab_enrich` | `fn17_vocab_ai_enrich/` |

---

## 6. Gherkin tóm tắt (theo REQ)

### REQ-01 — Học từ vựng theo ngữ cảnh

```gherkin
Feature: Học từ vựng theo ngữ cảnh
  Là người học, tôi muốn xem từ trong ngữ cảnh công việc để hiểu cách dùng thực tế.

  Scenario: Hiển thị từ đủ trường bắt buộc kèm hội thoại
    Given từ "deploy" có context, example, topic và dialogue 3 câu (PM và DEV)
    When tôi mở bài học từ đó
    Then tôi thấy nghĩa, phát âm, loại từ, ví dụ và đoạn hội thoại dạng chat
    And từ "deploy" xuất hiện trong ít nhất một câu hội thoại
    And không có màn chỉ hiển thị từ đơn lẻ không context

  Scenario: Từ chối dữ liệu thiếu hội thoại
    Given bản ghi từ chỉ có context mà không có dialogue
    When hệ thống validate (import hoặc seed)
    Then bản ghi bị từ chối với lỗi thiếu dialogue
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
  Scenario: Nhắc ngắt quãng theo giờ đã cấu hình
    Given tôi bật nhắc với khung 08:00–20:00 và khoảng 3 giờ
    And có 2 từ đến hạn ôn hôm nay
    When đến mốc nhắc 11:00
    Then thiết bị hiển thị thông báo gợi ý ôn từ đến hạn
    And không gửi thêm thông báo trùng trong cùng mốc

  Scenario: Tắt thông báo
    Given tôi tắt notification trong cài đặt
    When đến mốc nhắc
    Then không gửi thông báo
```

### REQ-12 — Quick Capture

```gherkin
Feature: Quick Capture từ vựng từ app khác
  Scenario: Thêm từ qua Share sau khi bôi đen
    Given tôi bôi đen "deadline" trên trình duyệt
    When tôi chọn Share → Cuder Học Tiếng
    Then form hiển thị từ "deadline" và câu xung quanh làm context
    When tôi chọn collection "Email Communication" và lưu
    Then từ xuất hiện trong collection và sổ cá nhân

  Scenario: Thêm từ qua overlay
    Given tôi đã bật bong bóng phụ trợ
    When tôi mở panel overlay và dán cụm từ kèm context
    And tôi lưu vào bộ từ vựng
    Then từ được lưu với metadata nguồn nếu có
```

### REQ-16 — Import bộ từ vựng (Excel / CSV / JSON)

```gherkin
Feature: Import từ vựng theo format app
  Scenario: Import CSV hợp lệ vào collection
    Given file CSV đúng header format v1 với dialogue 3 câu mỗi từ
    When tôi chọn Import trong Collection "Scrum Vocabulary"
    Then hệ thống báo số dòng thành công
    And các từ xuất hiện trong collection với đủ hội thoại

  Scenario: Từ chối dòng thiếu dialogue
    Given file có 1 dòng chỉ 1 câu dialogue
    When tôi import
    Then dòng đó bị báo lỗi "dialogue cần 2–5 câu"
    And các dòng hợp lệ khác vẫn được import

  Scenario: Admin import catalog hệ thống
    Given tôi là admin và upload file JSON format v1
    When import hoàn tất
    Then từ được ghi vào vocabulary catalog cho mọi learner
```

### REQ-17 — AI enrich hội thoại (FN-17)

```gherkin
Feature: AI sinh hội thoại khi thêm từ
  Scenario: Full mode chỉ cần word
    Given tôi chọn ngôn ngữ mẹ đẻ "vi"
    When tôi gọi vocab-enrich mode full với word "deploy"
    Then preview có dialogue 2-5 câu tiếng Anh
    And preview có explanationNative bằng tiếng Việt

  Scenario: Enrich mode giữ meaning user nhập
    Given tôi nhập word "blocker" và meaning "vấn đề chặn tiến độ"
    When tôi gọi vocab-enrich mode enrich
    Then meaning trong preview giữ "vấn đề chặn tiến độ"
    And dialogue được sinh tự động
```

### REQ-15 — Cấu hình thương hiệu (Admin)

```gherkin
Feature: Brand và quyền — chỉ Admin
  Scenario: Learner không sửa được logo/màu
    Given tôi là người học (không có trong app_admins)
    When tôi mở Cài đặt
    Then không có màn đổi logo hoặc màu brand
    And app hiển thị logo/tên từ app_brand_config

  Scenario: Admin cập nhật màu brand
    Given tôi đăng nhập admin và có trong app_admins
    When tôi đổi brand_primary_hex thành "#0085E5"
    Then learner mở app lại thấy theme màu mới

  Scenario: Admin tắt tính năng qua permissions
    Given permissions.allow_ai_tutor = false
    When learner mở app
    Then tab Gia sư AI bị ẩn hoặc disabled
```

---

## 7. Phụ lục — NFR & ràng buộc chung (từ base, một REQ không tách)

| Nhóm | Quy định |
|------|----------|
| Performance | Startup < 3s; API < 500ms; 60fps; học offline được phần core |
| Security | **MVP:** không login; Device ID; HTTPS · **Phase 2:** pairing mã 6 số (FN-13) |
| Availability | Uptime ≥ 99.5%; backup DB |
| UI | **Cuder Học Tiếng** — minimal, light + dark; SFX đúng/sai + nhắc âm thanh; assets [`brand/`](../../brand/) — SSOT: [`docs/02_system_design/sys_design_ux_ui.md`](../docs/02_system_design/sys_design_ux_ui.md) |

---

## 9. Phase 2 — Yêu cầu mở rộng (ngoài MVP)

> **SSOT chi tiết:** [`requirement_base.md`](../docs/00_input_raw/requirement_base.md) § FN-13, FN-14. Chưa scaffold `src/fn13_*`, `src/fn14_*` cho đến khi kickoff Phase 2.

| STT | REQ | Tên | Biểu mẫu (BM) | Quy định (QĐ) |
|-----|-----|-----|---------------|---------------|
| 13 | REQ-13 | Web & đồng bộ mã 6 số | Web responsive; màn nhập mã; mobile **Cài đặt → Mã đồng bộ** | Mã 6 số TTL; ghép web ↔ device_id; sync ↔ từ/collection/progress; conflict `updated_at`; không bắt buộc email/password |
| 14 | REQ-14 | Bạn bè & leo rank | Bảng xếp hạng bạn; hồ sơ hạng; thêm bạn bằng mã/username | Rank: Gà con → Gà mới lớn → Gà chiến → Chiến thần gà → Thần IELTS 10 điểm; XP tuần + rank point tích lũy; privacy toggle; chống spam XP |

### Gherkin tóm tắt (Phase 2)

```gherkin
Feature: Đồng bộ Web bằng mã 6 số
  Scenario: Liên kết Web từ điện thoại
    Given trên mobile tôi thấy mã đồng bộ 6 số còn hiệu lực
    When tôi nhập mã đó trên Web
    Then Web hiển thị từ vựng và collection giống trên điện thoại
    And tôi có thể ôn flashcard trên Web

Feature: Leo rank với bạn bè
  Scenario: Xem bảng xếp hạng bạn bè
    Given tôi đã kết bạn với ít nhất 1 người
    When tôi mở bảng xếp hạng tuần
    Then tôi thấy thứ hạng XP tuần và hạng rank hiện tại (vd. "Gà chiến")
```

---

## 8. Lịch sử thay đổi

| Ngày | Thay đổi | Nguồn |
|------|----------|-------|
| 2026-05-28 | Thêm REQ-01…REQ-11 (bootstrap SRS) | `requirement_base.md` FN-01…FN-11 |
| 2026-05-31 | **Thêm REQ-12** Quick Capture (Share/Overlay); **Cập nhật REQ-11** nhắc ngắt quãng theo giờ + liên FN-05 | `requirement_base.md` STT khách 2026-05-31 |
| 2026-05-31 | **Phase 2:** REQ-13 Web + mã 6 số; REQ-14 bạn bè & leo rank | `requirement_base.md` § FN-13, FN-14 |
| 2026-05-31 | Rebrand **Cuder Học Tiếng**; `brand/` assets; SFX đúng/sai + nhắc âm thanh | `requirement_base`, `sys_design_ux_ui.md` |
| 2026-05-31 | **REQ-15** FN-15 cấu hình brand — admin only | `requirement_base.md` § FN-15 |
| 2026-05-31 | **Cập nhật REQ-01** hội thoại 2–5 câu (BA/PM/DEV/…); **Thêm REQ-16** import Excel/CSV/JSON | `requirement_base.md` § FN-01, FN-16 |
| 2026-05-28 | Chuyển SSOT FN doc: `process/features/` → `src/fn**/` | Quyết định dự án + rule `12` |
