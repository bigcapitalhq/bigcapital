import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import type { ComponentType } from 'react';
import { toggleInventoryValuationFilterDrawer } from '@/store/financial-statement/financial-statements.actions';

export interface WithInventoryValuationActionsProps {
  toggleInventoryValuationFilterDrawer: (toggle?: boolean) => void;
}

export const mapDispatchToProps = (
  dispatch: Dispatch,
): WithInventoryValuationActionsProps => ({
  toggleInventoryValuationFilterDrawer: (toggle?: boolean) =>
    dispatch(toggleInventoryValuationFilterDrawer(toggle)),
});

export function withInventoryValuationActions<P>(
  WrappedComponent: ComponentType<P>,
): ComponentType<Omit<P, keyof WithInventoryValuationActionsProps>> {
  const Connected = connect(
    null,
    mapDispatchToProps,
  )(WrappedComponent as ComponentType<any>);
  return Connected as unknown as ComponentType<
    Omit<P, keyof WithInventoryValuationActionsProps>
  >;
}
