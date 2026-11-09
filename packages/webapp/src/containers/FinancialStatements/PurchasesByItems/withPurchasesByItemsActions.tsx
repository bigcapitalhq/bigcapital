import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import type { ComponentType } from 'react';
import { togglePurchasesByItemsFilterDrawer } from '@/store/financial-statement/financial-statements.actions';

export interface WithPurchasesByItemsActionsProps {
  togglePurchasesByItemsFilterDrawer: (toggle?: boolean) => void;
}

export const mapDispatchToProps = (
  dispatch: Dispatch,
): WithPurchasesByItemsActionsProps => ({
  togglePurchasesByItemsFilterDrawer: (toggle?: boolean) =>
    dispatch(togglePurchasesByItemsFilterDrawer(toggle)),
});

export function withPurchasesByItemsActions<P>(
  WrappedComponent: ComponentType<P>,
): ComponentType<Omit<P, keyof WithPurchasesByItemsActionsProps>> {
  const Connected = connect(
    null,
    mapDispatchToProps,
  )(WrappedComponent as ComponentType<any>);
  return Connected as unknown as ComponentType<
    Omit<P, keyof WithPurchasesByItemsActionsProps>
  >;
}
