import { groupBy } from 'lodash';

export const transformToMapBy = <T>(
  collection: T[],
  key: keyof T,
): Map<string, T[]> => {
  return new Map(Object.entries(groupBy(collection, key)));
};
