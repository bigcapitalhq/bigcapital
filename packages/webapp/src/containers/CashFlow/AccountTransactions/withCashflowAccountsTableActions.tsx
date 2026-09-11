import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import type { TableQuery } from '@/store/store.types';
import type { ComponentType } from 'react';
import {
  setCashflowAccountsTableState,
  resetCashflowAccountsTableState,
} from '@/store/cashflow-accounts/cashflow-accounts.actions';

export interface WithCashflowAccountsTableActionsProps {
  setCashflowAccountsTableState: (queries: Partial<TableQuery>) => void;
  resetCashflowAccountsTableState: () => void;
}

export const mapActionsToProps = (
  dispatch: Dispatch,
): WithCashflowAccountsTableActionsProps => ({
  setCashflowAccountsTableState: (queries: Partial<TableQuery>) =>
    dispatch(setCashflowAccountsTableState(queries)),

  resetCashflowAccountsTableState: () =>
    dispatch(resetCashflowAccountsTableState()),
});

export function withCashflowAccountsTableActions<P>(
  WrappedComponent: ComponentType<P>,
): ComponentType<Omit<P, keyof WithCashflowAccountsTableActionsProps>> {
  const Connected = connect(
    null,
    mapActionsToProps,
  )(WrappedComponent as ComponentType<any>);
  return Connected as unknown as ComponentType<
    Omit<P, keyof WithCashflowAccountsTableActionsProps>
  >;
}
