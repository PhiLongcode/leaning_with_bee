@REQ-01 @FN-01 @ui
Feature: UI — Học từ vựng theo ngữ cảnh (Expo Web)

  Là người học, trên giao diện web tôi muốn thấy từ kèm context, ví dụ và hội thoại.

  Background:
    Given ứng dụng web đang chạy

  Scenario: Màn học hiển thị từ deploy với dialogue
    When tôi mở bài học từ vựng qua deep link E2E
    Then tôi thấy từ "deploy" trên màn hình
    And tôi thấy khối dialogue hội thoại
    And dialogue chứa từ "deploy"

  Scenario: Màn học hiển thị context và example
    When tôi mở bài học từ vựng qua deep link E2E
    Then tôi thấy ngữ cảnh vocabulary không rỗng
    And tôi thấy ví dụ vocabulary không rỗng

  Scenario: Điều hướng từ splash tới bài học
    When tôi đi từ splash tới bài học từ vựng
    Then tôi thấy khối dialogue hội thoại
