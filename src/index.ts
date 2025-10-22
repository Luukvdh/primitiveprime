// Waarom: centraliseer side-effectful entry (voert alle polyfills/prototype-extensies uit).
export * from "./primitives.js"; // if you have pure helpers, re-export here
export * from "./math.js";

import "./polyfills.js";
import "./string.js";
import "./array.js";
import "./number.js";
import "./object.js";
