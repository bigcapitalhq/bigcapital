import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import type { ComponentType } from 'react';
import { toggleSalesTaxLiabilitySummaryFilterDrawer } from '@/store/financial-statement/financial-statements.actions';

export interface WithSalesTaxLiabilitySummaryActionsProps {
  toggleSalesTaxLiabilitySummaryFilterDrawer: (toggle?: boolean) => void;
}

export const mapDispatchToProps = (
  dispatch: Dispatch,
): WithSalesTaxLiabilitySummaryActionsProps => ({
  toggleSalesTaxLiabilitySummaryFilterDrawer: (toggle?: boolean) =>
    dispatch(toggleSalesTaxLiabilitySummaryFilterDrawer(toggle)),
});

export function withSalesTaxLiabilitySummaryActions<P>(
  WrappedComponent: ComponentType<P>,
): ComponentType<Omit<P, keyof WithSalesTaxLiabilitySummaryActionsProps>> {
  const Connected = connect(
    null,
    mapDispatchToProps,
  )(WrappedComponent as ComponentType<any>);
  return Connected as unknown as ComponentType<
    Omit<P, keyof WithSalesTaxLiabilitySummaryActionsProps>
  >;
}
