import { AfterAll, Before, setDefaultTimeout } from '@cucumber/cucumber';
import { engage, serenity } from '@serenity-js/core';
import '../serenity.config.ts';
import { Actors } from '../serenity.config.ts';
import './ui-hooks.js';
import './perf-hooks.js';

setDefaultTimeout(60_000);

Before({ tags: 'not @ui and not @perf' }, () => {
  engage(new Actors());
});

AfterAll(async () => {
  await serenity.waitForNextCue();
});
