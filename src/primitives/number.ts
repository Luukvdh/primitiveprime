import { addToPrototype } from "./addToPrototype.js";
export function extendNumber() {
  addToPrototype(Number.prototype, "percentage", function (this: number, percent: number): number {
    return (this * percent) / 100;
  });

  addToPrototype(Number.prototype, "isEven", function (this: number): boolean {
    return this % 2 === 0;
  });

  addToPrototype(Number.prototype, "isOdd", function (this: number): boolean {
    return this % 2 !== 0;
  });

  addToPrototype(Number.prototype, "toFixedNumber", function (this: number, decimals = 2): number {
    return parseFloat(this.toFixed(decimals));
  });

  addToPrototype(Number.prototype, "between", function (this: number, min: number, max: number): boolean {
    return this >= min && this <= max;
  });

  addToPrototype(Number.prototype, "clamp", function (this: number, min: number, max: number): number {
    return Math.min(Math.max(this, min), max);
  });

  addToPrototype(Number.prototype, "times", function (this: number, fn: (i: number) => void): void {
    for (let i = 0; i < this; i++) fn(i);
  });

  addToPrototype(Number.prototype, "toStringWithLeadingZeros", function (this: number, length: number): string {
    return String(this).padStart(length, "0");
  });

  addToPrototype(Number.prototype, "toTimeCode", function (this: number): string {
    const totalSeconds = Math.floor(this);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    // gebruik je eigen toStringWithLeadingZeros
    return `${hours}:${(minutes as any).toStringWithLeadingZeros(2)}:${(seconds as any).toStringWithLeadingZeros(2)}`;
  });
}
