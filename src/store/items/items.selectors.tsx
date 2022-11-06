// @ts-nocheck
import { isEqual } from 'lodash';

import { paginationLocationQuery } from '@/store/selectors';
import { createDeepEqualSelector } from '@/utils';
import { defaultTableQuery } from './items.reducer';

const itemsTableStateSelector = (state) => state.items.tableState;

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
