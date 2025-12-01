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
 * @example
 * ```ts
 * // String operations
 * pkit("hello world").toTitleCase().unwrap(); // "Hello World"
 *
 * // Number operations
 * pkit(42).percentage(50); // 21
 *
 * // Array operations
 * pkit([1, 2, 3, 4, 5]).shuffle();
 *
 * // Math utilities
 * pkit.math.randomRangeInt(1, 10);
 *
 * // Path utilities
 * pkit.path.basename("/path/to/file.txt"); // "file.txt"
 * ```
 */

export type { Pkit, PrimeString, PrimeNumber, PrimeArray, PrimeObject } from "./dist/primitivetools.js";

import type { Pkit } from "./dist/primitivetools.js";

declare global {
  var pkit: Pkit;
}
