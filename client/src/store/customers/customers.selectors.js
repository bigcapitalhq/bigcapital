import { paginationLocationQuery } from 'store/selectors';
import { createDeepEqualSelector } from 'utils';

const customerTableStateSelector = (state) => state.customers.tableState;

export const getCustomersTableStateFactory = () =>
  createDeepEqualSelector(
    paginationLocationQuery,
    customerTableStateSelector,
    (locationQuery, tableState) => {
      return {
        ...locationQuery,
        ...tableState,
      };
    },
  );
