import { paginationLocationQuery } from 'store/selectors';
import { createDeepEqualSelector } from 'utils';

const billsTableStateSelector = (state) => state.bills.tableState;

// Get bills table state marged with location query.
export const getBillsTableStateFactory = () =>
  createDeepEqualSelector(
    paginationLocationQuery,
    billsTableStateSelector,
    (locationQuery, tableState) => {
      return {
        ...locationQuery,
        ...tableState,
      };
    },
  );
