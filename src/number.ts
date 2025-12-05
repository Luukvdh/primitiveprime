declare type numberMethod = [string, fn: (this: number, ...args: any[]) => any];

export const numberMethods: numberMethod[] = [
  [
    "percentage",
    function (this: number, percent: number): number {
      return (this * percent) / 100;
    },
  ] as numberMethod,
  [
    "isEven",
    function (this: number): boolean {
      return this % 2 === 0;
    },
  ] as numberMethod,
  [
    "isOdd",
    function (this: number): boolean {
      return this % 2 !== 0;
    },
  ] as numberMethod,
  [
    "toFixedNumber",
    function (this: number, decimals = 2): number {
      return parseFloat(this.toFixed(decimals));
    },
  ] as numberMethod,
  [
    "between",
    function (this: number, min: number, max: number): boolean {
      return this >= min && this <= max;
    },
  ] as numberMethod,
  [
    "clamp",
    function (this: number, min: number, max: number): number {
      return Math.min(Math.max(this, min), max);
    },
  ] as numberMethod,
  [
    "times",
    function (this: number, fn: (i: number) => void): void {
      for (let i = 0; i < this; i++) fn(i);
    },
  ] as numberMethod,
  [
    "toStringWithLeadingZeros",
    function (this: number, length: number): string {
      return String(this).padStart(length, "0");
    },
  ] as numberMethod,
  [
    "toTimeCode",
    function (this: number): string {
      const totalSeconds = Math.floor(this);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      // gebruik je eigen toStringWithLeadingZeros
      return `${hours}:${(minutes as any).toStringWithLeadingZeros(2)}:${(seconds as any).toStringWithLeadingZeros(2)}`;
    },
  ],
  [
    "percentOf",
    function (this: number, total: number) {
      return total === 0 ? 0 : (this / total) * 100;
    },
  ] as numberMethod,
  [
    "ratioOf",
    function (this: number, total: number) {
      return total === 0 ? 0 : this / total;
    },
  ] as numberMethod,
];

export function extendNumber() {
  for (const method of numberMethods) {
    Object.defineProperty(Number.prototype, method[0], {
      value: method[1],
      writable: true,
      configurable: true,
    });
  }
}
