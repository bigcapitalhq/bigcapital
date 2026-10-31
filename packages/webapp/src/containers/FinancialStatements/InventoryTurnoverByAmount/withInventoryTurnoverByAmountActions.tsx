import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import type { ComponentType } from 'react';
import { toggleInventoryTurnoverByAmountFilterDrawer } from '@/store/financial-statement/financial-statements.actions';

export interface WithInventoryTurnoverByAmountActionsProps {
  toggleInventoryTurnoverByAmountFilterDrawer: (toggle?: boolean) => void;
}

const mapActionsToProps = (
  dispatch: Dispatch,
): WithInventoryTurnoverByAmountActionsProps => ({
  toggleInventoryTurnoverByAmountFilterDrawer: (toggle) =>
    dispatch(toggleInventoryTurnoverByAmountFilterDrawer(toggle)),
});

export function withInventoryTurnoverByAmountActions<P>(
  WrappedComponent: ComponentType<P>,
): ComponentType<Omit<P, keyof WithInventoryTurnoverByAmountActionsProps>> {
  const Connected = connect(
    null,
    mapActionsToProps,
  )(WrappedComponent as ComponentType<any>);
  return Connected as unknown as ComponentType<
    Omit<P, keyof WithInventoryTurnoverByAmountActionsProps>
  >;
}
