export const transformToMapKeyValue = <T, K extends string | number>(
  collection: T[],
  key: keyof T,
): Map<K, T> => {
  // @ts-ignore
  return new Map(collection.map((item) => [item[key], item]));
};
