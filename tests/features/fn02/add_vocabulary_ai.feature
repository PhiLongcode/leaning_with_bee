@REQ-02 @FN-02
Feature: Thêm từ vựng với AI preview

  Scenario: Full mode chỉ cần word
    Given mode full với word "hotfix"
    When kiểm tra request enrich
    Then request enrich được chấp nhận

  Scenario: Mock enrich trả dialogue và explanation
    Given mock enrich cho word "deploy" ngôn ngữ "vi"
    When gọi enrich vocabulary
    Then kết quả có dialogue ít nhất 2 câu
    And kết quả có explanationNative ngôn ngữ "vi"
