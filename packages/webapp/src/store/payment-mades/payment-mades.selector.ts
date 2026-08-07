import { isEqual } from 'lodash';
import { createSelector } from 'reselect';
import { defaultTableQuery } from './payment-mades.reducer';
import type { RootState } from '@/store/reducers';
import { paginationLocationQuery } from '@/store/selectors';
import { createDeepEqualSelector } from '@/utils';

const paymentMadesTableStateSelector = (state: RootState) =>
  state.paymentMades.tableState;

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

export const paymentsTableStateChangedFactory = () =>
  createDeepEqualSelector(paymentMadesTableStateSelector, (tableState) => {
    return !isEqual(tableState, defaultTableQuery);
  });

export const getPaymentMadeByIdFactory = () =>
  createSelector(
    (_state: RootState, paymentMadeId: number | string) => paymentMadeId,
    (paymentMadeId): unknown => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _ = paymentMadeId;
      return undefined;
    },
  );
