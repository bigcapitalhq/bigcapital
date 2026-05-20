import { createSelector } from '@reduxjs/toolkit';
import { isEqual } from 'lodash';

import { paginationLocationQuery } from '@/store/selectors';
import { createDeepEqualSelector } from '@/utils';
import { defaultTableQuery } from './payment-receives.reducer';
import type { RootState } from '@/store/reducers';

const paymentReceiveTableState = (state: RootState) => state.paymentReceives.tableState;

// Retrieve payment receives table fetch query.
export const getPaymentReceiveTableStateFactory = () =>
  createSelector(
    paginationLocationQuery,
    paymentReceiveTableState,
    (locationQuery, tableState) => {
      return {
        ...locationQuery,
        ...tableState,
      };
    },
  );
export const paymentsTableStateChangedFactory = () =>
  createDeepEqualSelector(paymentReceiveTableState, (tableState) => {
    return !isEqual(tableState, defaultTableQuery);
  });

export const getPaymentReceivesSelectedRowsFactory = () =>
  createSelector(
    (state: RootState) => state.paymentReceives.selectedRows,
    (selectedRows) => selectedRows,
  );
