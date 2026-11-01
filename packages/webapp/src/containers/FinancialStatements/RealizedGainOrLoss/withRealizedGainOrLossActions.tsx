import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import type { ComponentType } from 'react';
import { toggleRealizedGainOrLossFilterDrawer } from '@/store/financial-statement/financial-statements.actions';

export interface WithRealizedGainOrLossActionsProps {
  toggleRealizedGainOrLossFilterDrawer: (toggle?: boolean) => void;
}

export const mapDispatchToProps = (
  dispatch: Dispatch,
): WithRealizedGainOrLossActionsProps => ({
  toggleRealizedGainOrLossFilterDrawer: (toggle?: boolean) =>
    dispatch(toggleRealizedGainOrLossFilterDrawer(toggle)),
});

export function withRealizedGainOrLossActions<P>(
  WrappedComponent: ComponentType<P>,
): ComponentType<Omit<P, keyof WithRealizedGainOrLossActionsProps>> {
  const Connected = connect(
    null,
    mapDispatchToProps,
  )(WrappedComponent as ComponentType<any>);
  return Connected as unknown as ComponentType<
    Omit<P, keyof WithRealizedGainOrLossActionsProps>
  >;
}
