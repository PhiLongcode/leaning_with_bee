import { expect } from 'vitest';
import type { Result } from '../../../src/shared/result';

export function expectOk<T>(result: Result<T>): asserts result is { ok: true; value: T } {
  if (!result.ok) {
    expect.fail(`Expected ok result, got error: ${result.error}`);
  }
}
