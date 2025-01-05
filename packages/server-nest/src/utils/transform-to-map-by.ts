import { groupBy } from 'lodash';

export const transformToMapBy = (collection, key) => {
  return new Map(Object.entries(groupBy(collection, key)));
};
