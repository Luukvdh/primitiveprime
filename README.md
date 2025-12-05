# primitiveprimer

Extend String, Array, Number, Object na Math with generally useful helpers, add a browser-safe version of node's path. Alternatively get all this functionality without defiling your prototypes in one handy wrapper pkit().

# Install

```bash
npm i primitiveprimer
```

# Use

You can:

- have prototype extentions be auto deployed with .global versions.
- install prototype extenions manually with applyPrimitives() in default versions.
- leave prototypes intact, and get the same functionality by using pkit() type recognizing wrapper

ESM:

```ts
import { applyPrimitives, pkit } from "primitiveprimer";
applyPrimitives();

//or to auto-deploy prototypes:
import "primitiveprimer/global"; // runs the bundle that auto-applies prototypes

// now String/Array/Number/Object have extra helpers
```

CommonJS (Node.js):

```js
const { applyPrimitives, pkit } = require("primitiveprimer");
applyPrimitives();

//or to auto-deploy prototypes:
require("primitiveprimer/global");

// now String/Array/Number/Object have extra helpers
```

CDN (IIFE):

```html
<script src="primitiveprimer.js"></script>
<script>
  applyPrimitives(); // opt-in;
  pkit("test.mp4").changeExtention("mp3"); // get functions via pkit();
</script>
<!-- OR FOR AUTOMATIC DEPLOYMENT OF PROTOTYPES: -->
<script src="primitiveprimer.global.js"></script>
<!-- prototypes are applied automatically -->
```

these are also available at https://unpkg.com/primitiveprimer

# Available Functions

```typescript
interface Array<T> {
  first(n?: 1): T | undefined;
  first(n: number): T[];
  last(n?: 1): T | undefined;
  last(n: number): T[];
  findByKey<K extends keyof T & string>(key: K, value: any): T | null;
  groupBy(fn: (item: T) => string): Record<string, T[]>;
  groupBy<K extends keyof T & string>(key: K): Record<string, T[]>;
  sumByKey<K extends keyof T & string>(key: K): number;
  autoParseKeys(): T[];
  unique(): T[];
  shuffle(): T[];
  highestByKey<K extends keyof T & string>(key: K): T | null;
  lowestByKey<K extends keyof T & string>(key: K): T | null;
  sortByKey<K extends keyof T & string>(key: K, ascending?: boolean): T[];
  sortByKeyName<K extends keyof T & string>(key: K, ascending?: boolean): T[];
  mapByKey<K extends keyof T & string>(key: K): Array<T[K]>;
}

interface String {
  changeExtension(ext: string): string;
  reverse(): string;
  toTitleCase(): string;
  words(): string[];
  slashreverse(str: string): string;
  slashwin(): string;
  slashlinux(): string;
  strip(): string;
  containsAny(...arr: string[]): boolean;
  toSlug(): string;
  stripCompare(other: string): boolean;
  toWordCapitalized(): string;
  truncate(length: number, suffix?: string): string;
  isJson(): boolean;
  toCamelCase(): string;
  safeParseJson(): any;
  nullParseJson(): any | null;
  filenameCompare(otherPath: string): boolean;
  substringFrom(startStr?: string, stopStr?: string): string;
}

interface Number {
  percentage(percent: number): number;
  isEven(): boolean;
  isOdd(): boolean;
  toFixedNumber(decimals?: number): number;
  between(min: number, max: number): boolean;
  clamp(min: number, max: number): number;
  times(fn: (i: number) => void): void;
  toStringWithLeadingZeros(length: number): string;
  toTimeCode(): string; //HH?:MM:SS
}

interface ObjectConstructor {
  keysMap(obj: Record<string, any>, fn: (k: string, v: any) => [string, any]): Record<string, any>;
  valuesMap(obj: Record<string, any>, fn: (v: any, k: string) => any): Record<string, any>;
  parseKeys(this: Record<string, any>, ...keys: string[]): Record<string, any>;
}

interface Object {
  sortKeys(sorterFn?: ((a: string, b: string) => number) | null): Record<string, any>;
  fill(T): Record<string, T>;
  assignFill(Record<string, any>): Record<string, any>;
}

interface Math {
  randomRangeFloat(min: number, max: number): number;
  randomRangeInt(min: number, max: number): number;
  lerp(min: number, max: number, t: number): number;
  clamp(value: number, min: number, max: number): number;
  degToRad(degrees: number): number;
  radToDeg(radians: number): number;
  distance(x1: number, y1: number, x2: number, y2: number): number;
  roundTo(value: number, decimals?: number): number;
  isPowerOfTwo(value: number): boolean;
  nextPowerOfTwo(value: number): number;
  normalize(value: number, min: number, max: number): number;
  smoothStep(edge0: number, edge1: number, x: number): number;
  mix(x: number, y: number, a: number): number;
  mixColors(hex1: string, hex2: string, mixPerc: number): string;
}
// only when browser is detected on not in use, path is added to browser window:
var path: {
  sep: string;
  normalize(p: string): string;
  join(...parts: string[]): string;
  basename(p: string): string;
  dirname(p: string): string;
  extname(p: string): string;
};
```

**How to use pkit() functionality wrapper**
If you or your situation object to the extending or primitive prototypes, the same functionality can be found by the pkit wrapper that will be placed on global/window.
Wrap your subject in pkit(\*) and the functions will be available from there.
Math functions and path shim can be found under _pkit.math_ and _pkit.path_

```html
<script>
  // pkit is now added globally
  const result = pkit("hello world").toTitleCase().unwrap(); // "Hello World"
  console.log(pkit.math.randomRangeInt(1, 10));
  console.log(pkit.path.basename("/path/to/file.txt"));
</script>
```

# Parsing JSON-like properties in objects with AutoParse

For rows fetched from e.g. SQLite that store JSON as strings, auto-parse object properties:

```ts
const row = { id: "1", meta: '{"tags":["a","b"]}', ok: "true" };
const parsed = pkit(row).autoParseKeys().unwrap();
// → { id: "1", meta: { tags: ["a","b"] }, ok: true }
```

Arrays of rows also support auto-parse:

```ts
const rows = [{ data: '{"x":1}' }, { data: '{"x":2}' }];
const parsedRows = pkit(rows).autoParseKeys().unwrap();
```

**TypeScript support for browser bundle:**

To get full IntelliSense/autocomplete when using the browser bundle in TypeScript projects:

```typescript
// Add to your TypeScript file:
/// <reference types="primitiveprimer" />

// Or add to tsconfig.json:
{
  "compilerOptions": {
    "types": ["primitiveprimer"]
  }
}
```

If you've installed via npm and want to serve the file locally:

```bash
# Using the built-in copy command (easiest)
npx primitiveprimer-copy-browser myhtml
# copies minified files to ./myhtml | You can use this in package scripts.
```

# Server-side Node usage

- Works in Node ESM and CommonJS—see examples above. The library only touches the DOM when you call DOM-related helpers; importing it on the server is safe as long as you don’t call browser-only functions.
