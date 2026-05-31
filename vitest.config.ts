import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/fn**/*.spec.ts', 'tests/shared/**/*.spec.ts'],
    environment: 'node',
    reporters: ['default'],
    testTimeout: 60_000,
  },
});
