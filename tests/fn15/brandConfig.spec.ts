import { describe, expect, it } from 'vitest';
import { getAppBrandConfig } from '../../src/fn15_brand_config/application/brandConfigUseCases';
import { getAppSystemConfig } from '../../src/fn15_brand_config/application/systemConfigUseCases';
import { DEFAULT_APP_BRAND_CONFIG } from '../../src/fn15_brand_config/domain/brandConfig';
import { createMockBrandConfigRepository } from '../../src/fn15_brand_config/infrastructure/brandConfigRepository';
import { createMockSystemConfigRepository } from '../../src/fn15_brand_config/infrastructure/systemConfigRepository';

describe('FN-15 brand & system config', () => {
  it('returns default brand config from mock', async () => {
    const repo = createMockBrandConfigRepository();
    const r = await getAppBrandConfig(repo, 'https://example.supabase.co');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.brandName).toBe(DEFAULT_APP_BRAND_CONFIG.brandName);
  });

  it('returns system config from mock', async () => {
    const repo = createMockSystemConfigRepository();
    const r = await getAppSystemConfig(repo);
    expect(r.ok).toBe(true);
    if (r.ok) expect(typeof r.value.permissions.allowAiVocabEnrich).toBe('boolean');
  });
});
