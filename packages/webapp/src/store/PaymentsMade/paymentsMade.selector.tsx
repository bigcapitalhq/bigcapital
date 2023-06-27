// @ts-nocheck
import { isEqual } from 'lodash';

import { paginationLocationQuery } from '@/store/selectors';
import { createDeepEqualSelector } from '@/utils';
import { defaultTableQuery } from './paymentsMade.reducer';

const paymentsMadeTableStateSelector = (state) => state.paymentsMade.tableState;

// Get payments made table state marged with location query.
export const getPaymentsMadeTableStateFactory = () =>
  createDeepEqualSelector(
    paginationLocationQuery,
    paymentsMadeTableStateSelector,
    (locationQuery, tableState) => {
      return {
        ...locationQuery,
        ...tableState,
      };
    },
  );

export const paymentsTableStateChangedFactory = () =>
  createDeepEqualSelector(paymentsMadeTableStateSelector, (tableState) => {
    return !isEqual(tableState, defaultTableQuery);
  });
