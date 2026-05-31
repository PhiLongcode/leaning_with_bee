import { mkdirSync } from 'node:fs';
import { AfterAll, Before, BeforeAll, setDefaultTimeout } from '@cucumber/cucumber';
import { ArtifactArchiver, configure, engage, serenity } from '@serenity-js/core';
import { SerenityBDDReporter } from '@serenity-js/serenity-bdd';
import { Actors, featuresRoot, serenityOut } from '../serenity.config.ts';
import './ui-hooks.js';
import './perf-hooks.js';

setDefaultTimeout(60_000);

BeforeAll(() => {
  mkdirSync(serenityOut, { recursive: true });
  configure({
    crew: [
      SerenityBDDReporter.fromJSON({ specDirectory: featuresRoot }),
      ArtifactArchiver.storingArtifactsAt(serenityOut),
    ],
  });
});

Before({ tags: 'not @ui and not @perf' }, () => {
  engage(new Actors());
});

AfterAll(async () => {
  await serenity.waitForNextCue();
});
