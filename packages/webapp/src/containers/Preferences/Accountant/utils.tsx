// @ts-nocheck

export const transferObjectOptionsToArray = (input) =>
  Object.entries(input).flatMap(([group, options]) =>
    Object.entries(options).map(([key, value]) => ({ group, key, value })),
  );
