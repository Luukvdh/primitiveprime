import { extendArray } from "./array.js";
import { extendNumber } from "./number.js";
import { extendObject } from "./object.js";
import { extendString } from "./string.js";
import pkit from "./primitivetools.js";
export type { Pkit, PrimeString, PrimeNumber, PrimeArray, PrimeObject } from "./primitivetools.js";
import { extendPath } from "./pathShim.js";
import { extendMathUtils } from "./math.js";
// --- apply all prototypes ---
export function applyPrimitives() {
  extendString();
  extendArray();
  extendNumber();
  extendObject();
  extendPath();
  extendMathUtils();
}
export { applyPrimitives as applyPrimitivesGlobally };
export { pkit };
