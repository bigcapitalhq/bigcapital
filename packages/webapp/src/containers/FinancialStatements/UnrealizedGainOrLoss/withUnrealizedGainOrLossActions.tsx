import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import type { ComponentType } from 'react';
import { toggleUnrealizedGainOrLossFilterDrawer } from '@/store/financial-statement/financial-statements.actions';

export interface WithUnrealizedGainOrLossActionsProps {
  toggleUnrealizedGainOrLossFilterDrawer: (toggle?: boolean) => void;
}

export const mapDispatchToProps = (
  dispatch: Dispatch,
): WithUnrealizedGainOrLossActionsProps => ({
  toggleUnrealizedGainOrLossFilterDrawer: (toggle?: boolean) =>
    dispatch(toggleUnrealizedGainOrLossFilterDrawer(toggle)),
});

export function withUnrealizedGainOrLossActions<P>(
  WrappedComponent: ComponentType<P>,
): ComponentType<Omit<P, keyof WithUnrealizedGainOrLossActionsProps>> {
  const Connected = connect(
    null,
    mapDispatchToProps,
  )(WrappedComponent as ComponentType<any>);
  return Connected as unknown as ComponentType<
    Omit<P, keyof WithUnrealizedGainOrLossActionsProps>
  >;
}
