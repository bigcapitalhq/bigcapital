import { createSelector } from '@reduxjs/toolkit';
import {
  paginationLocationQuery,
} from 'store/selectors';

const paymentReceiveTableState = (state) => state.paymentReceives.tableState;

// Retrieve payment receives table fetch query.
export const getPaymentReceiveTableStateFactory = () => createSelector(
  paginationLocationQuery,
  paymentReceiveTableState,
  (locationQuery, tableState) => {
    return {
      ...locationQuery,
      ...tableState,
    };
  },
);