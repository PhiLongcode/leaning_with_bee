# language: vi
@REQ-17 @FN-17
Feature: AI sinh hội thoại và giải thích tiếng mẹ đẻ

  Scenario: Preview trước khi lưu từ
    Given tôi ở form thêm từ với word "deploy"
    When tôi bấm "Tạo hội thoại AI"
    Then tôi thấy preview dialogue dạng chat
    And tôi thấy khối giải thích tiếng mẹ đẻ
    When tôi bấm "Lưu vào sổ"
    Then từ được lưu kèm dialogue và explanation_native
