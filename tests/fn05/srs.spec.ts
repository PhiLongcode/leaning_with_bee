import { describe, expect, it } from 'vitest';
import { isDue, scheduleAfterReview } from '../../src/shared/srs';

describe('FN-05 SRS (Leitner intervals)', () => {
  it('schedules again same day', () => {
    const r = scheduleAfterReview('again', 2);
    expect(r.repetitionLevel).toBe(0);
    const diff = new Date(r.nextReview).getTime() - Date.now();
    expect(diff).toBeLessThan(24 * 60 * 60 * 1000);
  });

  it('increases level on good', () => {
    const r = scheduleAfterReview('good', 1);
    expect(r.repetitionLevel).toBe(2);
  });

  it('isDue when nextReview in past', () => {
    const past = new Date(Date.now() - 86400000).toISOString();
    expect(isDue(past)).toBe(true);
    expect(isDue(null)).toBe(true);
  });
});
