/**
 * Global type declarations for primitiveprimer browser bundle
 *
 * Add this to your tsconfig.json:
 * {
 *   "compilerOptions": {
 *     "types": ["primitiveprimer/browser"]
 *   }
 * }
 *
 * Or reference directly in your TypeScript file:
 * /// <reference types="primitiveprimer/browser" />
 *
 */

export type { Pkit, PrimeString, PrimeNumber, PrimeArray, PrimeObject } from "./dist/primitiveprimer";

import type { Pkit } from "./dist/primitiveprimer";

declare global {
  var pkit: Pkit;
}
