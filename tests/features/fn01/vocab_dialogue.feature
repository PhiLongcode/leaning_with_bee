@REQ-01 @FN-01
Feature: Dialogue và giải thích trên bài học từ vựng

  Scenario: Vocabulary hợp lệ khi có dialogue 2-5 câu
    Given vocabulary "deploy" có dialogue 3 câu
    When kiểm tra vocabulary hợp lệ
    Then vocabulary được coi là hợp lệ

  Scenario: Vocabulary không hợp lệ khi thiếu dialogue
    Given vocabulary "sync" chỉ có context và example
    When kiểm tra vocabulary hợp lệ (strict dialogue)
    Then vocabulary không hợp lệ vì thiếu dialogue

  Scenario: Highlight từ mục tiêu trong câu hội thoại
    Given câu tiếng Anh "Can we deploy the hotfix tonight?"
    And từ cần highlight "deploy"
    When highlight từ trong câu
    Then phần highlight chứa "deploy"
