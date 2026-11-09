import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import type { ComponentType } from 'react';
import { toggleVendorsBalanceSummaryFilterDrawer } from '@/store/financial-statement/financial-statements.actions';

export interface WithVendorsBalanceSummaryActionsProps {
  toggleVendorSummaryFilterDrawer: (toggle: boolean) => void;
}

export const mapActionsToProps = (
  dispatch: Dispatch,
): WithVendorsBalanceSummaryActionsProps => ({
  toggleVendorSummaryFilterDrawer: (toggle: boolean) =>
    dispatch(toggleVendorsBalanceSummaryFilterDrawer(toggle)),
});

export function withVendorsBalanceSummaryActions<P>(
  WrappedComponent: ComponentType<P>,
): ComponentType<Omit<P, keyof WithVendorsBalanceSummaryActionsProps>> {
  const Connected = connect(
    null,
    mapActionsToProps,
  )(WrappedComponent as ComponentType<any>);
  return Connected as unknown as ComponentType<
    Omit<P, keyof WithVendorsBalanceSummaryActionsProps>
  >;
}
