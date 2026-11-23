import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import type { ComponentType } from 'react';
import { toggleBudgetVsActualFilterDrawer } from '@/store/financial-statement/financial-statements.actions';

export interface WithBudgetVsActualActionsProps {
  toggleBudgetVsActualFilterDrawer: (toggle?: boolean) => void;
}

export const mapDispatchToProps = (
  dispatch: Dispatch,
): WithBudgetVsActualActionsProps => ({
  toggleBudgetVsActualFilterDrawer: (toggle?: boolean) =>
    dispatch(toggleBudgetVsActualFilterDrawer(toggle)),
});

export function withBudgetVsActualActions<P>(
  WrappedComponent: ComponentType<P>,
): ComponentType<Omit<P, keyof WithBudgetVsActualActionsProps>> {
  const Connected = connect(
    null,
    mapDispatchToProps,
  )(WrappedComponent as ComponentType<any>);
  return Connected as unknown as ComponentType<
    Omit<P, keyof WithBudgetVsActualActionsProps>
  >;
}
