import { paginationLocationQuery } from 'store/selectors';
import { createDeepEqualSelector } from 'utils';

const invoicesTableStateSelector = (state) => state.salesInvoices.tableState;

/**
 * Retrieve invoices table state.
 */
export const getInvoicesTableStateFactory = () =>
  createDeepEqualSelector(
    paginationLocationQuery,
    invoicesTableStateSelector,
    (locationQuery, tableState) => {
      return {
        ...locationQuery,
        ...tableState,
      };
    },
  );
