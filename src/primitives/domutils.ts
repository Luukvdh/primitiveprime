export const DOMUtils = {

  dom: {} as Record<string, HTMLElement>,

  initIDs() {
    const elements = document.querySelectorAll<HTMLElement>("[id]");
    elements.forEach((el) => {
      try {
        DOMUtils.dom[el.id] = el;
      } catch (e) {}
    });
  },

  measureElement(el: HTMLElement): { width: number; height: number } {
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
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => DOMUtils.initIDs());
} else {
  DOMUtils.initIDs();
}

if (!(globalThis as any).DOMUtils) {
  (globalThis as any).DOMUtils = DOMUtils;
}
