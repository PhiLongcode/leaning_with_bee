import { Before, setDefaultTimeout } from '@cucumber/cucumber';
import { engage } from '@serenity-js/core';
import { Actors } from '../serenity.config.ts';

setDefaultTimeout(120_000);

Before({ tags: '@perf' }, () => {
  engage(new Actors());
});
