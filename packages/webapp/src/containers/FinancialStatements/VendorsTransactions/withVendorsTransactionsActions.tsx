import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import type { ComponentType } from 'react';
import { toggleVendorsTransactionsFilterDrawer } from '@/store/financial-statement/financial-statements.actions';

export interface WithVendorsTransactionsActionsProps {
  toggleVendorsTransactionsFilterDrawer: (toggle?: boolean) => void;
}

export const mapActionsToProps = (
  dispatch: Dispatch,
): WithVendorsTransactionsActionsProps => ({
  toggleVendorsTransactionsFilterDrawer: (toggle?: boolean) =>
    dispatch(toggleVendorsTransactionsFilterDrawer(toggle)),
});

export function withVendorsTransactionsActions<P>(
  WrappedComponent: ComponentType<P>,
): ComponentType<Omit<P, keyof WithVendorsTransactionsActionsProps>> {
  const Connected = connect(
    null,
    mapActionsToProps,
  )(WrappedComponent as ComponentType<any>);
  return Connected as unknown as ComponentType<
    Omit<P, keyof WithVendorsTransactionsActionsProps>
  >;
}
