import { isEqual } from 'lodash';
import { defaultTableQuery } from './items.reducer';
import type { RootState } from '@/store/reducers';
import { paginationLocationQuery } from '@/store/selectors';
import { createDeepEqualSelector } from '@/utils';

const itemsTableStateSelector = (state: RootState) => state.items.tableState;

// Get items table state marged with location query.
export const getItemsTableStateFactory = () =>
  createDeepEqualSelector(
    paginationLocationQuery,
    itemsTableStateSelector,
    (locationQuery, tableState) => {
      return {
        ...locationQuery,
        ...tableState,
      };
    },
  );

export const isItemsTableStateChangedFactory = () =>
  createDeepEqualSelector(itemsTableStateSelector, (tableState) => {
    return !isEqual(tableState, defaultTableQuery);
  });
