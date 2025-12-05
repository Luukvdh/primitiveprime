import { extendArray } from "./array.js";
import { extendNumber } from "./number.js";
import { extendObject } from "./object.js";
import { extendString } from "./string.js";
import pkit from "./primitivetools.js";
export type { Pkit, PrimeString, PrimeNumber, PrimeArray, PrimeObject } from "./primitivetools.js";
import { extendPath } from "./pathShim.js";
import { extendMathUtils } from "./math.js";
export class AssertError extends Error {
  functionName: string;
  constructor(message: string, functionName?: string) {
    super(message);
    this.name = "AssertError";
    this.functionName = functionName ?? "";
  }
}
// --- apply all prototypes ---
export function applyPrimitives() {
  extendArray();
  extendNumber();
  extendObject();
  extendString();
  extendPath();
  extendMathUtils();
}
export { applyPrimitives as applyPrimitivesGlobally };
export { pkit };
