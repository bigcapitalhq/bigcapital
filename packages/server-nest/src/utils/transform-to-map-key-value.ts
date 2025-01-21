export const transformToMapKeyValue = <T, K extends string | number>(
  collection: T[],
  key: keyof T,
): Map<K, T> => {
  return new Map(collection.map((item) => [item[key], item]));
};
