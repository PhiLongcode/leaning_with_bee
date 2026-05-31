import { Actor, Cast, configure } from '@serenity-js/core';
import { ConsoleReporter } from '@serenity-js/console-reporter';

/** Cast mặc định — domain tests không cần browser abilities. */
export class Actors implements Cast {
  prepare(actor: Actor) {
    return actor;
  }
}

configure({
  crew: [ConsoleReporter.forDarkTerminals()],
});
