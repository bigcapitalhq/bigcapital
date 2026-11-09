import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import type { ComponentType } from 'react';
import { toggleCashFlowStatementFilterDrawer } from '@/store/financial-statement/financial-statements.actions';

export interface WithCashFlowStatementActionsProps {
  toggleCashFlowStatementFilterDrawer: (toggle?: boolean) => void;
}

const mapDispatchToProps = (
  dispatch: Dispatch,
): WithCashFlowStatementActionsProps => ({
  toggleCashFlowStatementFilterDrawer: (toggle) =>
    dispatch(toggleCashFlowStatementFilterDrawer(toggle)),
});

export function withCashFlowStatementActions<P>(
  WrappedComponent: ComponentType<P>,
): ComponentType<Omit<P, keyof WithCashFlowStatementActionsProps>> {
  const Connected = connect(
    null,
    mapDispatchToProps,
  )(WrappedComponent as ComponentType<any>);
  return Connected as unknown as ComponentType<
    Omit<P, keyof WithCashFlowStatementActionsProps>
  >;
}
