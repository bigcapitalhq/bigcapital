import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import type { ComponentType } from 'react';
import { toggleInventoryItemDetailsFilterDrawer } from '@/store/financial-statement/financial-statements.actions';

export interface WithInventoryItemDetailsActionsProps {
  toggleInventoryItemDetailsFilterDrawer: (toggle?: boolean) => void;
}

const mapActionsToProps = (
  dispatch: Dispatch,
): WithInventoryItemDetailsActionsProps => ({
  toggleInventoryItemDetailsFilterDrawer: (toggle) =>
    dispatch(toggleInventoryItemDetailsFilterDrawer(toggle)),
});

export function withInventoryItemDetailsActions<P>(
  WrappedComponent: ComponentType<P>,
): ComponentType<Omit<P, keyof WithInventoryItemDetailsActionsProps>> {
  const Connected = connect(
    null,
    mapActionsToProps,
  )(WrappedComponent as ComponentType<any>);
  return Connected as unknown as ComponentType<
    Omit<P, keyof WithInventoryItemDetailsActionsProps>
  >;
}
