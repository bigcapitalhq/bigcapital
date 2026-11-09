import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import type { ComponentType } from 'react';
import { toggleTrialBalanceSheetFilterDrawer } from '@/store/financial-statement/financial-statements.actions';

export interface WithTrialBalanceActionsProps {
  toggleTrialBalanceFilterDrawer: (toggle?: boolean) => void;
}

export const mapDispatchToProps = (
  dispatch: Dispatch,
): WithTrialBalanceActionsProps => ({
  toggleTrialBalanceFilterDrawer: (toggle?: boolean) =>
    dispatch(toggleTrialBalanceSheetFilterDrawer(toggle)),
});

export function withTrialBalanceActions<P>(
  WrappedComponent: ComponentType<P>,
): ComponentType<Omit<P, keyof WithTrialBalanceActionsProps>> {
  const Connected = connect(
    null,
    mapDispatchToProps,
  )(WrappedComponent as ComponentType<any>);
  return Connected as unknown as ComponentType<
    Omit<P, keyof WithTrialBalanceActionsProps>
  >;
}
