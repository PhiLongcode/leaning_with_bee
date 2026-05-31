# Audio manifest — Cuder Học Tiếng

> **SSOT:** `brand/audio/` · **Bundle app:** `apps/mobile/assets/brand/audio/`  
> **Tạo lại file mặc định:** `python scripts/generate-brand-audio.py` (WAV 44.1 kHz mono)

## SFX — Phản hồi khi chọn đáp án ( học / review )

| File | Sự kiện | Mô tả | UI trigger |
|------|---------|-------|------------|
| `answer_correct.wav` | Trả lời **đúng** | Hợp âm major ngắn (~0.4s) | Flashcard, Context Review, quiz |
| `answer_wrong.wav` | Trả lời **sai** | Tông trầm mềm (~0.3s) | Cùng các màn trên |
| `answer_partial.wav` | Gần đúng | Hai nốt trung tính | Speaking score trung bình |
| `xp_gain.wav` | +XP | Ting cao ngắn | Sau câu đúng / hoàn bài |
| `streak_tick.wav` | Giữ streak | Pop nhẹ | Hoàn thành mục tiêu ngày |

> Có thể thay bằng `.mp3` chất lượng cao hơn — cập nhật `brandAssets.ts` + chạy lại require.

**Quy định UX:**

- Phát **ngay** khi user chọn đáp án (trước hoặc song song animation).
- **Không** lặp chồng cùng lúc — dừng SFX cũ nếu user bấm nhanh.
- Tôn trọng **Cài đặt → Âm thanh** (bật/tắt SFX học tập).
- Khi tắt SFX: vẫn có visual feedback (màu đúng/sai).

## Reminder — Nhắc học (FN-11)

| File | Biến thể | Mô tả |
|------|----------|-------|
| `reminder_default.wav` | Mặc định | Arpeggio chuông ~1s |
| `reminder_gentle.wav` | Nhẹ | Arpeggio chậm, volume thấp |
| `reminder_urgent.wav` | Streak sắp mất | Nhịp nhanh hơn, tông cao |

**Quy định:**

- Gắn với local notification — phát khi user **mở** từ notification hoặc trong app (tuỳ OS).
- Tôn trọng **khung giờ** và toggle **Nhắc nhở luyện tập** (Settings).
- Không phát reminder SFX khi user tắt **Âm thanh nhắc nhở** (tách toggle với SFX học).

## Cài đặt app (Settings → Âm thanh)

| Toggle | Ảnh hưởng |
|--------|-----------|
| Âm thanh học tập | `answer_*`, `xp_gain`, `streak_tick` |
| Âm thanh nhắc nhở | `reminder_*` |
| Rung (tuỳ chọn) | Haptic khi đúng/sai trên mobile |

## Implement

- Constants: [`apps/mobile/src/constants/brandAssets.ts`](../apps/mobile/src/constants/brandAssets.ts)
- Service: [`apps/mobile/src/services/soundFeedback.ts`](../apps/mobile/src/services/soundFeedback.ts)
- Spec UI: [`docs/02_system_design/sys_design_ux_ui.md`](../docs/02_system_design/sys_design_ux_ui.md) §11
