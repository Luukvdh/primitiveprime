// Non-auto IIFE: expose applyPrimitives and pkit on globalThis/window without auto-applying prototypes
import { applyPrimitivesGlobally, pkit } from "./primitives.js";

// Keep the function named applyPrimitives for consumer familiarity
const applyPrimitives = applyPrimitivesGlobally;

// Attach to globalThis
(globalThis as any).applyPrimitives = applyPrimitives;
(globalThis as any).pkit = pkit;

// Also mirror to window if present
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
if (typeof window !== "undefined") {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  Object.assign(window, { applyPrimitives, pkit });
}

// Provide a default export to satisfy IIFE globalName if needed
export default { applyPrimitives, pkit };
