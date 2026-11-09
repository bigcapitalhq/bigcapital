import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import type { TableQuery } from '@/store/store.types';
import type { ComponentType } from 'react';
import {
  setInvoicesTableState,
  resetInvoicesTableState,
  setInvoicesSelectedRows,
  resetInvoicesSelectedRows,
} from '@/store/invoice/invoices.actions';

export interface WithInvoiceActionsProps {
  setInvoicesTableState: (queries: Partial<TableQuery>) => void;
  resetInvoicesTableState: () => void;
  setInvoicesSelectedRows: (selectedRows: Array<unknown>) => void;
  resetInvoicesSelectedRows: () => void;
}

export const mapDipatchToProps = (
  dispatch: Dispatch,
): WithInvoiceActionsProps => ({
  setInvoicesTableState: (queries: Partial<TableQuery>) =>
    dispatch(setInvoicesTableState(queries)),
  resetInvoicesTableState: () => dispatch(resetInvoicesTableState()),
  setInvoicesSelectedRows: (selectedRows: Array<unknown>) =>
    dispatch(setInvoicesSelectedRows(selectedRows)),
  resetInvoicesSelectedRows: () => dispatch(resetInvoicesSelectedRows()),
});

export function withInvoiceActions<P>(
  WrappedComponent: ComponentType<P>,
): ComponentType<Omit<P, keyof WithInvoiceActionsProps>> {
  const Connected = connect(
    null,
    mapDipatchToProps,
  )(WrappedComponent as ComponentType<any>);
  return Connected as unknown as ComponentType<
    Omit<P, keyof WithInvoiceActionsProps>
  >;
}
