# primitiveprimer

Extend String, Array, Number, Object with generally useful helpers, plus lightweight DOM utils and a browser-safe path shim. Ships ESM, CJS, and an IIFE global build (`PrimitivePrimer`).

## Install

```bash
npm i primitiveprimer
```

## Use

This package is opt-in to avoid surprising prototype changes. Call `applyPrimitives()` once at startup.

ESM:

```ts
import { applyPrimitives } from "primitiveprimer";
applyPrimitives();
// now String/Array/Number/Object have extra helpers
```

CommonJS (Node.js):

```js
const { applyPrimitives } = require("primitiveprimer");
applyPrimitives();
```

IIFE global (CDN):

```html
<script src="https://unpkg.com/primitiveprimer"></script>
<script>
  // window.PrimitivePrimer is available
  console.log("ready");
  console.log("hello".toTitleCase());
</script>
```

## Copying public assets into your app's /public

If you want to ship or customize static assets (e.g., vendored files) from this package into your app's `./public` folder, use the provided CLI.

- Default destination: `./public/primitiveprimer`
- Flat mode: copy directly into `./public` with `--flat`

Quick start:

```bash
npx primitiveprimer-copy
# or flat into ./public
npx primitiveprimer-copy --flat
# or choose a custom destination
npx primitiveprimer-copy --dest public/vendor/primitiveprimer --clean
```

You can also add an npm script:

```json
{
  "scripts": {
    "pp:copy": "primitiveprimer-copy --flat --clean"
  }
}
```

> Note: Copying into a consumer project's filesystem is intentionally opt-in (via the CLI) to avoid surprise side effects on install. Bundlers like Vite/Webpack can also copy from `node_modules/primitiveprimer/public` using their copy plugins.

## Server-side Node usage

- Works in Node ESM and CommonJS—see examples above. The library only touches the DOM when you call DOM-related helpers; importing it on the server is safe as long as you don’t call browser-only functions.
- If you prefer zero prototype changes on the server, skip `applyPrimitives()` and import specific pure helpers instead (e.g., `import { mathUtils } from "primitiveprimer"`).

## Available Functions

### String

toHsp()

reverse()

toTitleCase()

words()

slashreverse(str)

slashwin()

slashlinux()

strip()

stripCompare(otherStr)

toWordCapitalized()

truncate(length, suffix?)

isJson()

safeParseJson()

nullParseJson()

filenameCompare(otherPath)

### Number

percentage(percent)

isEven()

isOdd()

toFixedNumber(decimals?)

between(min, max)

clamp(min, max)

times(fn)

### Array

findByKey(key, value)

sumByKey(key)

autoParseKeys()

unique()

shuffle()

highestByKey(key)

lowestByKey(key)

sortByKey(key, ascending?)

sortByKeyName(key, ascending?)

### Object

parseKeys(keys: string[])

### Math

randomRangeFloat(min, max)

randomRangeInt(min, max)

clamp(value, min, max)

percentageInRange(min, max, percent)

lerp(min, max, t)

mapRange(value, inMin, inMax, outMin, outMax)

---
