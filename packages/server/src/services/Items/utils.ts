import { IItemEntry } from '@/interfaces';
import { isNull, isUndefined } from 'lodash';

export function assocItemEntriesDefaultIndex<T>(
  entries: Array<T & { index?: number }>
): Array<T & { index: number }> {
  return entries.map((entry, index) => {
    return {
      index:
        isUndefined(entry.index) || isNull(entry.index)
          ? index + 1
          : entry.index,
      ...entry,
    };
  });
}
