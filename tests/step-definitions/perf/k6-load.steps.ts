import { Given, Then, When } from '@cucumber/cucumber';
import { Ensure, equals, isLessThan } from '@serenity-js/assertions';
import { actorCalled } from '@serenity-js/core';
import { isPerfEnvConfigured, runK6Script } from '../../perf/runK6.js';

const actor = () => actorCalled('Operator');

let p95ThresholdMs = 2000;
let lastRun: ReturnType<typeof runK6Script> | null = null;

Given('ngưỡng p95 latency {int} ms', (ms: number) => {
  p95ThresholdMs = ms;
  process.env.PERF_P95_MS = String(ms);
});

Given('PERF_SUPABASE_URL đã cấu hình', async () => {
  if (!isPerfEnvConfigured()) {
    return 'pending';
  }
});

When('k6 chạy script {string}', async (script: string) => {
  lastRun = runK6Script(script);
  if (lastRun.skipped) {
    return 'pending';
  }
  await actor().attemptsTo(
    Ensure.that(lastRun.exitCode, equals(0)),
  );
});

Then('k6 thỏa ngưỡng latency và error rate', async () => {
  if (!lastRun || lastRun.skipped) {
    return 'pending';
  }
  if (lastRun.p95Ms != null) {
    await actor().attemptsTo(
      Ensure.that(lastRun.p95Ms, isLessThan(p95ThresholdMs + 1)),
    );
  }
  if (lastRun.errorRate != null) {
    await actor().attemptsTo(
      Ensure.that(lastRun.errorRate, isLessThan(0.05)),
    );
  }
});
