
export type Constructor = new (...args: any[]) => {};
export type GConstructor<T> = new (...args: any[]) => T;