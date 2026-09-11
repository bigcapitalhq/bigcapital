import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import type { ComponentType } from 'react';
import { toggleSalesByItemsFilterDrawer } from '@/store/financial-statement/financial-statements.actions';

export interface WithSalesByItemsActionsProps {
  toggleSalesByItemsFilterDrawer: (toggle?: boolean) => void;
}

export const mapDispatchToProps = (
  dispatch: Dispatch,
): WithSalesByItemsActionsProps => ({
  toggleSalesByItemsFilterDrawer: (toggle?: boolean) =>
    dispatch(toggleSalesByItemsFilterDrawer(toggle)),
});

export function withSalesByItemsActions<P>(
  WrappedComponent: ComponentType<P>,
): ComponentType<Omit<P, keyof WithSalesByItemsActionsProps>> {
  const Connected = connect(
    null,
    mapDispatchToProps,
  )(WrappedComponent as ComponentType<any>);
  return Connected as unknown as ComponentType<
    Omit<P, keyof WithSalesByItemsActionsProps>
  >;
}
