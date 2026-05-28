# language: vi
@REQ-01 @FN-01
Feature: Học từ vựng theo ngữ cảnh

  Là người học, tôi muốn xem từ trong ngữ cảnh công việc để hiểu cách dùng thực tế.

  Scenario: Hiển thị từ "deploy" đầy đủ ngữ cảnh
    Given từ "deploy" có context, example và topic "Software Development"
    When tôi mở bài học từ đó
    Then tôi thấy nghĩa, phát âm, loại từ, ví dụ và ngữ cảnh

  Scenario: Không hiển thị từ đơn lẻ không context
    Given màn học từ
    When hiển thị nội dung
    Then không có màn chỉ hiển thị từ đơn lẻ không context

  Scenario: Phát âm khi bấm nghe
    Given từ có pronunciation
    When tôi bấm nghe phát âm
    Then audio phát đúng từ đó
