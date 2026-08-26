export const transformToMapKeyValue = <T, K extends string | number>(
  collection: T[],
  key: keyof T,
): Map<K, T> => {
  // @ts-expect-error -- TODO: fix underlying type error
  return new Map(collection.map((item) => [item[key], item]));
};
