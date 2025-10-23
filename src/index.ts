// Types are exposed via package root index.d.ts + global.d.ts; no direct reference here to avoid DTS build conflicts.
// Waarom: centraliseer side-effectful entry (voert alle polyfills/prototype-extensies uit).
export { applyPrimitives, applyPrimitivesGlobally } from "./primitives.js"; // if you have pure helpers, re-export here
export * from "./primitives.js"; // if you have pure helpers, re-export here
export * from "./math.js";
import "./polyfills.js";
import "./string.js";
import "./array.js";
import "./number.js";
import "./object.js";
import "./object.js";
