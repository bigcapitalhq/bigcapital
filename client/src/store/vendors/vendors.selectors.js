import { createDeepEqualSelector } from 'utils';
import {
  paginationLocationQuery,
} from 'store/selectors';

const vendorsTableStateSelector = (state) => state.vendors.tableState;

/**
 * Retrieve vendors table state.
 */
export const getVendorsTableStateFactory = () =>
  createDeepEqualSelector(
    paginationLocationQuery,
    vendorsTableStateSelector,
    (locationQuery, tableState) => {
      return {
        ...locationQuery,
        ...tableState,
      };
    },
  );

 