import { applyPrimitives as _apply, applyPrimitivesGlobally as _applyGlobal } from "./primitives.js";
export { pkit } from "./primitives.js";

// Auto-apply on import
_applyGlobal();

// Also export the apply functions for completeness
export const applyPrimitives = _apply;
export const applyPrimitivesGlobally = _applyGlobal;
