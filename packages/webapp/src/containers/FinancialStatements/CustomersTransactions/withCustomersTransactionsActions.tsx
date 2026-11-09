import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import type { ComponentType } from 'react';
import { toggleCustomersTransactionsFilterDrawer } from '@/store/financial-statement/financial-statements.actions';

export interface WithCustomersTransactionsActionsProps {
  toggleCustomersTransactionsFilterDrawer: (toggle?: boolean) => void;
}

const mapActionsToProps = (
  dispatch: Dispatch,
): WithCustomersTransactionsActionsProps => ({
  toggleCustomersTransactionsFilterDrawer: (toggle) =>
    dispatch(toggleCustomersTransactionsFilterDrawer(toggle)),
});

export function withCustomersTransactionsActions<P>(
  WrappedComponent: ComponentType<P>,
): ComponentType<Omit<P, keyof WithCustomersTransactionsActionsProps>> {
  const Connected = connect(
    null,
    mapActionsToProps,
  )(WrappedComponent as ComponentType<any>);
  return Connected as unknown as ComponentType<
    Omit<P, keyof WithCustomersTransactionsActionsProps>
  >;
}
