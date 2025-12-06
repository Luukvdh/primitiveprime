// Types are exposed via package root index.d.ts + global.d.ts; no direct reference here to avoid DTS build conflicts.
export * from "./primitives.js";
import "./polyfills.js";
import "./string.js";
import "./array.js";
import "./number.js";
import "./object.js";
