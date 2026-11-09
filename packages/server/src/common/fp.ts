export const when =
  <T>(pred: (x: T) => boolean, f: (x: T) => T) =>
  (x: T): T =>
    pred(x) ? f(x) : x;

export const unless =
  <T>(pred: (x: T) => boolean, f: (x: T) => T) =>
  (x: T): T =>
    pred(x) ? x : f(x);

export const ifElse =
  <T, R1, R2>(
    pred: (x: T) => boolean,
    onTrue: (x: T) => R1,
    onFalse: (x: T) => R2,
  ) =>
  (x: T): R1 | R2 =>
    pred(x) ? onTrue(x) : onFalse(x);

export const assoc = <K extends string | number | symbol, V, O extends object>(
  key: K,
  value: V,
  obj: O,
): O & Record<K, V> => ({ ...obj, [key]: value }) as O & Record<K, V>;
