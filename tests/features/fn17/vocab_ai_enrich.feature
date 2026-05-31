@REQ-17 @FN-17
Feature: AI sinh hội thoại và giải thích tiếng mẹ đẻ khi thêm từ

  Là người học, tôi muốn AI tạo hội thoại công việc và giải thích bằng ngôn ngữ mẹ đẻ khi thêm từ mới.

  Scenario Outline: Validate dialogue hợp lệ
    Given từ mục tiêu "<word>"
    And dialogue có <lineCount> câu với speakers "<speakers>"
    When validate dialogue theo quy tắc REQ-01
    Then kết quả validate là "<result>"

    Examples:
      | word   | lineCount | speakers   | result  |
      | deploy | 3         | PM,DEV     | valid   |
      | deploy | 1         | PM         | invalid |
      | deploy | 6         | PM,DEV,QA  | invalid |
      | deploy | 2         | PM,PM      | invalid |

  Scenario: Enrich mode yêu cầu ít nhất một trường user
    Given mode enrich với word "blocker"
    And user không nhập meaning, context hay example
    When kiểm tra request enrich
    Then request enrich bị từ chối

  Scenario: Enrich mode chấp nhận khi có meaning
    Given mode enrich với word "blocker"
    And user nhập meaning "vấn đề chặn tiến độ"
    When kiểm tra request enrich
    Then request enrich được chấp nhận

  Scenario: Explanation native phải có summary và usage
    Given explanation native ngôn ngữ "vi"
    And summary "Deploy = triển khai phần mềm."
    And usageInContext "Dùng khi nói về release."
    When validate explanation native
    Then explanation native hợp lệ
