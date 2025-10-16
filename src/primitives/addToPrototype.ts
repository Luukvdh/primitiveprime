export function addToPrototype(proto: any, title: string, func: (...args: any[]) => any, options: PropertyDescriptor = { enumerable: false, configurable: true, writable: true }) {
  if (!(title in proto)) {
    Object.defineProperty(proto, title, { value: func, ...options });
  }
}
