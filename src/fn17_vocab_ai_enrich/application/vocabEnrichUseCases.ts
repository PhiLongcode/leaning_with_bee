import { err, ok, type Result } from '../../shared/result';
import type { VocabEnrichRequest, VocabEnrichResult } from '../domain/vocabEnrich';
import { validateEnrichRequest } from '../domain/vocabValidation';
import type { VocabEnrichRepository } from '../infrastructure/vocabEnrichRepository';

export async function enrichVocabulary(
  repo: VocabEnrichRepository,
  request: VocabEnrichRequest,
): Promise<Result<VocabEnrichResult>> {
  const check = validateEnrichRequest(request);
  if (!check.valid) {
    return err(check.reason ?? 'Request không hợp lệ');
  }
  return repo.enrich(request);
}
