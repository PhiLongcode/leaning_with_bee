<!-- @file: src/fn16_vocab_import/01_requirement.md | @role: SSOT FN — REQ-16 -->

# Import bộ từ vựng — Yêu cầu chức năng

## Metadata

| Field | Value |
|-------|-------|
| REQ | REQ-16 |
| Function ID | FN-16 |
| Tên | Import Excel / CSV / JSON |
| Trạng thái | Draft |

## Tóm tắt

| Biểu mẫu | Quy định |
|----------|----------|
| Collection → Import; API `/vocabularies/import` | File **CSV, Excel, JSON** format app v1; validate dialogue **2–5 câu** (FN-01); admin → catalog; learner → user_vocab + collection |

## Template mẫu

- [`docs/templates/vocabulary_import_template.csv`](../../docs/templates/vocabulary_import_template.csv)
- [`docs/templates/vocabulary_import_template.json`](../../docs/templates/vocabulary_import_template.json)

## Liên kết

- SSOT thô: [`requirement_base.md`](../../docs/00_input_raw/requirement_base.md) § FN-16
- BDD: [`00_requirement_business.md`](../../process/00_requirement_business.md) REQ-16
