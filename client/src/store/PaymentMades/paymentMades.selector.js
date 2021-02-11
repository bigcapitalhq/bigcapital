import { paginationLocationQuery } from 'store/selectors';
import { createDeepEqualSelector } from 'utils';

const paymentMadesTableStateSelector = (state) => state.paymentMades.tableState;

// Get payment mades table state marged with location query.
export const getPaymentMadesTableStateFactory = () =>
  createDeepEqualSelector(
    paginationLocationQuery,
    paymentMadesTableStateSelector,
    (locationQuery, tableState) => {
      return {
        ...locationQuery,
        ...tableState,
      };
    },
  );
