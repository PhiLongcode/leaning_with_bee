import { AfterAll, Before, BeforeAll, setDefaultTimeout } from '@cucumber/cucumber';
import { engage } from '@serenity-js/core';
import { UiActors } from '../ui/cast/UiActors.js';
import { closeSharedBrowser, getSharedBrowser } from './ui-browser.js';

setDefaultTimeout(60_000);

BeforeAll({ tags: '@ui' }, async () => {
  await getSharedBrowser();
});

Before({ tags: '@ui' }, async () => {
  const browser = await getSharedBrowser();
  engage(new UiActors(browser));
});

AfterAll({ tags: '@ui' }, async () => {
  await closeSharedBrowser();
});
