import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import type { ComponentType } from 'react';
import { toggleBalanceSheetFilterDrawer } from '@/store/financial-statement/financial-statements.actions';

export interface WithBalanceSheetActionsProps {
  toggleBalanceSheetFilterDrawer: (toggle?: boolean) => void;
}

export const mapDispatchToProps = (
  dispatch: Dispatch,
): WithBalanceSheetActionsProps => ({
  toggleBalanceSheetFilterDrawer: (toggle) =>
    dispatch(toggleBalanceSheetFilterDrawer(toggle)),
});

export function withBalanceSheetActions<P>(
  WrappedComponent: ComponentType<P>,
): ComponentType<Omit<P, keyof WithBalanceSheetActionsProps>> {
  const Connected = connect(
    null,
    mapDispatchToProps,
  )(WrappedComponent as ComponentType<any>);
  return Connected as unknown as ComponentType<
    Omit<P, keyof WithBalanceSheetActionsProps>
  >;
}
