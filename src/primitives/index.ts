import { extendString } from "./string.js";
import { extendArray } from "./array.js";
import { extendNumber } from "./number.js";
import { extendObject } from "./object.js";
import { DOMUtils } from "./domutils.js";
import { mathUtils } from "./math.js";
import { createBrowserPathShim } from "./pathShim.js";

export function applyPrimitivesGlobally() {
  // --- Prototypes ---
  extendString();
  extendArray();
  extendNumber();
  extendObject();

  // --- DOMUtils ---
  if (!(globalThis as any).DOMUtils) {
    (globalThis as any).DOMUtils = DOMUtils;
    (globalThis as any).MathUtils = mathUtils;
  }

  // --- pathShim ---
  if (!(globalThis as any).path) {
    (globalThis as any).path = createBrowserPathShim();
  }
}
