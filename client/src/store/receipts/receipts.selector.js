import { paginationLocationQuery } from 'store/selectors';
import { createDeepEqualSelector } from 'utils';

const receiptTableStateSelector = (state) => state.salesReceipts.tableState;

// Retrieve receipts table query.
export const getReceiptsTableStateFactory = () =>
  createDeepEqualSelector(
    paginationLocationQuery,
    receiptTableStateSelector,
    (locationQuery, tableState) => {
      return {
        ...locationQuery,
        ...tableState,
      };
    },
  );
