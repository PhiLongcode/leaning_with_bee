import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Actor, Cast } from '@serenity-js/core';

const testsRoot = path.dirname(fileURLToPath(import.meta.url));
export const serenityOut = path.join(testsRoot, 'target/site/serenity');
export const featuresRoot = path.join(testsRoot, 'features');

/** Cast mặc định — domain tests không cần browser abilities. */
export class Actors implements Cast {
  prepare(actor: Actor) {
    return actor;
  }
}
