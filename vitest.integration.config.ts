import { defineConfig } from 'vitest/config';

/** Chỉ integration API — tách khỏi `test:unit` (mock, không Supabase). */
export default defineConfig({
  test: {
    include: ['tests/integration/**/*.api.spec.ts'],
    environment: 'node',
    reporters: ['default'],
    testTimeout: 60_000,
    hookTimeout: 60_000,
    maxWorkers: 1,
    fileParallelism: false,
    isolate: false,
  },
});
