import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import type { ComponentType } from 'react';
import { toggleProfitLossFilterDrawer } from '@/store/financial-statement/financial-statements.actions';

export interface WithProfitLossActionsProps {
  toggleProfitLossFilterDrawer: (toggle: boolean) => void;
}

export const mapDispatchToProps = (
  dispatch: Dispatch,
): WithProfitLossActionsProps => ({
  toggleProfitLossFilterDrawer: (toggle: boolean) =>
    dispatch(toggleProfitLossFilterDrawer(toggle)),
});

export function withProfitLossActions<P>(
  WrappedComponent: ComponentType<P>,
): ComponentType<Omit<P, keyof WithProfitLossActionsProps>> {
  const Connected = connect(
    null,
    mapDispatchToProps,
  )(WrappedComponent as ComponentType<any>);
  return Connected as unknown as ComponentType<
    Omit<P, keyof WithProfitLossActionsProps>
  >;
}
