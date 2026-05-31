# language: vi
@REQ-01 @FN-01
Feature: Học từ vựng theo ngữ cảnh

  Là người học, tôi muốn xem từ trong ngữ cảnh công việc kèm hội thoại ngắn để hiểu cách dùng thực tế.

  Scenario: Hiển thị từ "deploy" đầy đủ ngữ cảnh và hội thoại
    Given từ "deploy" có context, example, topic "Release & Deploy" và dialogue 3 câu giữa PM và DEV
    When tôi mở bài học từ đó
    Then tôi thấy nghĩa, phát âm, loại từ, ví dụ và đoạn hội thoại dạng chat
    And từ "deploy" xuất hiện trong ít nhất một câu hội thoại

  Scenario: Không hiển thị từ đơn lẻ không context
    Given màn học từ
    When hiển thị nội dung
    Then không có màn chỉ hiển thị từ đơn lẻ không context hoặc không hội thoại

  Scenario: Phát âm khi bấm nghe
    Given từ có pronunciation
    When tôi bấm nghe phát âm
    Then audio phát đúng từ đó

  Scenario: Hội thoại đủ số câu theo quy định
    Given bài học từ hợp lệ
    Then đoạn hội thoại có từ 2 đến 5 câu
    And có ít nhất 2 vai (speaker) khác nhau
