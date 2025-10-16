import { extendArray } from "./array.js";
import { extendNumber } from "./number.js";
import { extendObject } from "./object.js";
import { extendString } from "./string.js";

// --- apply all prototypes ---
export function applyPrimitives() {
  extendArray();
  extendNumber();
  extendObject();
  extendString();
}
// --- DOMUtils singleton ---
export const DOMUtils = {
  dom: {} as Record<string, HTMLElement>,
  initIDs() {
    const elements = document.querySelectorAll<HTMLElement>("[id]");
    elements.forEach((el) => (DOMUtils.dom[el.id] = el));
  },
  measureElement(el: HTMLElement) {
    const clone = el.cloneNode(true) as HTMLElement;
    clone.style.position = "absolute";
    clone.style.visibility = "hidden";
    clone.style.left = "-9999px";
    clone.style.top = "-9999px";
    document.body.appendChild(clone);

    const rect = clone.getBoundingClientRect();
    const size = { width: rect.width, height: rect.height };

    document.body.removeChild(clone);
    return size;
  },
};
