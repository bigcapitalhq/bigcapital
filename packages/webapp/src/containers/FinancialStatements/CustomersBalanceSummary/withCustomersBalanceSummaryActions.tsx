import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import type { ComponentType } from 'react';
import { toggleCustomersBalanceSummaryFilterDrawer } from '@/store/financial-statement/financial-statements.actions';

export interface WithCustomersBalanceSummaryActionsProps {
  toggleCustomerBalanceFilterDrawer: (toggle?: boolean) => void;
}

const mapActionsToProps = (
  dispatch: Dispatch,
): WithCustomersBalanceSummaryActionsProps => ({
  toggleCustomerBalanceFilterDrawer: (toggle) =>
    dispatch(toggleCustomersBalanceSummaryFilterDrawer(toggle)),
});

export function withCustomersBalanceSummaryActions<P>(
  WrappedComponent: ComponentType<P>,
): ComponentType<Omit<P, keyof WithCustomersBalanceSummaryActionsProps>> {
  const Connected = connect(
    null,
    mapActionsToProps,
  )(WrappedComponent as ComponentType<any>);
  return Connected as unknown as ComponentType<
    Omit<P, keyof WithCustomersBalanceSummaryActionsProps>
  >;
}
