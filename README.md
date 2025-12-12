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

## Functionality list

### Array

- first(n?) — Return first element or first n elements.
- last(n?) — Return last element or last n elements.
- findByKey(key, value) — Find an item where key equals value.
- groupBy(fnOrKey) — Group items using a mapping function or by a property key.
- sumByKey(key) — Sum numeric values at the given key.
- autoParseKeys() — Parse item string fields where applicable.
- unique() — Return array with duplicates removed.
- shuffle() — Return a shuffled copy of the array.
- highestByKey(key) — Return item with highest value for key or null.
- lowestByKey(key) — Return item with lowest value for key or null.
- sortByKey(key, ascending?) — Sort array by key; ascending by default.
- sortByKeyName(key, ascending?) — Sort array by key name (string) with optional order.
- mapByKey(key) — Map array to values of the given key.
- sumKey(key) — Sum numeric values at key across objects.
- averageKey(key) — Average numeric values at key across objects.
- filterKey(key, pred) — Filter by a key using predicate.
- distinct(keyOrFn) — Unique objects by key or projection function.
- aggregate(keyOrFn, reducer, init) — Group-reduce objects by key or projection.
- sumBy(key) — Sum numeric values by key (string).
- averageBy(key) — Average numeric values by key (string).
- sum() — Sum all numeric values in the array.
- average() — Average all numeric values in the array.
- indexOfHighestNumber() — Return index of the highest number in the array.
- indexOfLowestNumber() — Return index of the lowest number in the array.
- toTable() — Group-reduce objects by key or projection into table form.
- seededShuffle(seed) — Shuffle array with pattern using a seed for reproducibility.
- intersect(other) — Items present in both arrays.
- difference(other) — Items present only in this array.
- validateEach(validatorFn) — Keep valid items; replace invalids with null.
- clearNil() — Remove null/undefined values and narrow the array.

### String

- changeExtension(ext) — Replace the file extension with ext.
- reverse() — Return the string reversed.
- toTitleCase() — Convert the string to Title Case.
- words() — Split string into words.
- slashreverse(str) — Reverse slashes relative to str.
- slashwin() — Convert slashes to Windows style.
- slashlinux() — Convert slashes to POSIX style.
- strip() — Trim whitespace from both ends.
- containsAny(...arr) — Return true if contains any of the provided substrings.
- toSlug() — Create a URL/file-system safe slug.
- stripCompare(other) — Compare strings after stripping/normalizing.
- toWordCapitalized() — Capitalize each word in the string.
- truncate(length, suffix?) — Truncate to length, appending optional suffix.
- isJson() — Return true if string contains valid JSON.
- toCamelCase() — Convert string to camelCase.
- safeParseJson() — Parse JSON and return value or original on failure.
- nullParseJson() — Parse JSON and return value or null on failure.
- filenameCompare(otherPath) — Compare two paths by filename only.
- substringFrom(startStr?, stopStr?) — Return substring between optional start and stop markers.
- escapeHTML() — Escape HTML special characters.
- unescapeHTML() — Unescape HTML entities to characters.
- humanize() — Humanize identifiers: split camelCase, replace dashes/underscores, capitalize sentences.
- underscore() — Convert to underscore_case.
- isEmpty() — True if trimmed string is empty.
- countOccurrence(str2, caseSens?) — Count occurrences of substring; case sensitive by default.
- isNumber() — True if string represents a number.
- isFloat() — True if string represents a float.
- isAlphaNumeric() — True if string is alphanumeric.
- isLower() — True if string is all lowercase (with letters present).
- isUpper() — True if string is all uppercase (with letters present).
- hashed(truncate?) — Simple non-crypto hash (hex); optional truncate.
- replaceLast(search, replacement) — Replace the last occurrence of search with replacement.
- latinise() — Remove diacritics (latinize).
- ellipsis(total) — Truncate with "..." to total width.
- toNumber() — Extract a numeric value from the string.
- toBoolean() — Parse boolean from common truthy/falsey words.
- assertNonEmptyString() — Assert value is non-empty string; returns NonEmpty or false.
- isNonEmty() — True if string is non-empty after trimming.

### Number

- percentage(percent) — Calculate percent of the number.
- isEven() — Return true if number is even.
- isOdd() — Return true if number is odd.
- toFixedNumber(decimals?) — Like toFixed but returns a number.
- between(min, max) — Check if number is between min and max (inclusive).
- clamp(min, max) — Clamp the number between min and max.
- times(fn) — Run fn n times with index.
- toStringWithLeadingZeros(length) — Return string with leading zeros to reach length.
- toTimeCode() — Convert seconds/number to a timecode string.
- percentOf(total) — Calculate what percent this number is of total.
- ratioOf(total) — Calculate what ratio this number is of total.
- assertNrBetween(min?, max?) — Assert number within bounds.
- isInteger() — True if integer.
- isFinite() — True if finite (not NaN/Infinity).
- isSafeInteger() — True if safe integer.
- isPositive() — True if > 0.
- isNegative() — True if < 0.
- isNonNegative() — True if >= 0.
- assertIsInteger() — Throw if not integer.
- assertIsFinite() — Throw if not finite.

### Object (constructor)

- keysMap(obj, fn) — Map object keys using fn into a new object.
- valuesMap(obj, fn) — Map object values using fn into a new object.
- parseKeys(...keys) — Parse specified keys on an object and return new object.
- fill(target, source) — Shallow-merge source into target and return the result.

### Object (instance)

- sortKeys(sorterFn?) — Return a new object with keys sorted by sorterFn.
- equals(other) — Shallow structural equality by keys and types.
- omit(...keys) — Return object without specified keys.
- pick(...keys) — Return object containing only specified keys.
- complement(src) — Fill missing keys from source without overwriting existing.
- ensureSchema(schema, opts?) — Ensure keys conform to schema; optional type coercion.
- filterEntries(predicate) — Filter object entries by predicate.
- merge(other, opts?) — Merge with another object; control array merge strategy.
- isObject() — Type guard for plain object (not array).
- assertHasKeys(...keys) — Assert object has required keys.
- asType<T>() — Cast after validation.
- isNonEmty() — True if all values are non-empty strings.
- mapEmptyToFalseyKeyObje() — Map keys to booleans indicating empty values.
- mapEmptyToFalseyValueArray() — Map values to booleans indicating empty values.

### PathShim

- sep — Platform path separator.
- normalize(p) — Normalize path separators.
- join(...parts) — Join path segments.
- basename(p) — Return basename of path.
- dirname(p) — Return directory name of path.
- extname(p) — Return extension of path.

### MathUtils (global)

- randomRangeFloat(min, max) — Random float in [min, max).
- randomRangeInt(min, max) — Random integer in [min, max].
- lerp(min, max, t) — Linear interpolate between min and max by t.
- clamp(value, min, max) — Clamp value between min and max.
- degToRad(degrees) — Convert degrees to radians.
- radToDeg(radians) — Convert radians to degrees.
- distance(x1, y1, x2, y2) — Euclidean distance between two points.
- roundTo(value, decimals?) — Round value to decimals places.
- isPowerOfTwo(value) — Return true if value is a power of two.
- nextPowerOfTwo(value) — Return next power of two >= value.
- normalize(value, min, max) — Normalize value from [min,max] to [0,1].
- smoothStep(edge0, edge1, x) — Smoothstep function between two edges.
- mix(x, y, a) — Mix two numbers by factor a.
- mixColors(hex1, hex2, mixPerc) — Mix two hex colors by percentage.

## How to use pkit() functionality wrapper

### The same functions without prototype manipulation!

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
