import { createSelector } from '@reduxjs/toolkit';

const billByIdSelector = (state, props) => state.bills.items[props.billId];

export const getBillById = () =>
  createSelector(billByIdSelector, (_bill) => _bill);
