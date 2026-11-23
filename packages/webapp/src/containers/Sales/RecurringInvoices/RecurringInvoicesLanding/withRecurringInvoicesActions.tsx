import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import type { TableQuery } from '@/store/store.types';
import type { ComponentType } from 'react';
import {
  setRecurringInvoicesTableState,
  resetRecurringInvoicesTableState,
  setRecurringInvoicesSelectedRows,
  resetRecurringInvoicesSelectedRows,
} from '@/store/recurring-invoices/recurring-invoices.actions';

export interface WithRecurringInvoiceActionsProps {
  setRecurringInvoicesTableState: (queries: Partial<TableQuery>) => void;
  resetRecurringInvoicesTableState: () => void;
  setRecurringInvoicesSelectedRows: (selectedRows: Array<unknown>) => void;
  resetRecurringInvoicesSelectedRows: () => void;
}

export const mapDispatchToProps = (
  dispatch: Dispatch,
): WithRecurringInvoiceActionsProps => ({
  setRecurringInvoicesTableState: (queries: Partial<TableQuery>) =>
    dispatch(setRecurringInvoicesTableState(queries)),
  resetRecurringInvoicesTableState: () =>
    dispatch(resetRecurringInvoicesTableState()),
  setRecurringInvoicesSelectedRows: (selectedRows: Array<unknown>) =>
    dispatch(setRecurringInvoicesSelectedRows(selectedRows)),
  resetRecurringInvoicesSelectedRows: () =>
    dispatch(resetRecurringInvoicesSelectedRows()),
});

export function withRecurringInvoicesActions<P>(
  WrappedComponent: ComponentType<P>,
): ComponentType<Omit<P, keyof WithRecurringInvoiceActionsProps>> {
  const Connected = connect(
    null,
    mapDispatchToProps,
  )(WrappedComponent as ComponentType<any>);
  return Connected as unknown as ComponentType<
    Omit<P, keyof WithRecurringInvoiceActionsProps>
  >;
}
