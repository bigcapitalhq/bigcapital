import { createSelector } from '@reduxjs/toolkit';

const invoiceByIdSelector = (state, props) =>
  state.invoices.items[props.invoiceId];

export const getInvoiceById = () =>
  createSelector(invoiceByIdSelector, (_invoice) => {
    return _invoice;
  });
