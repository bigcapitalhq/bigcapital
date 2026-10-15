import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import type { TableQuery } from '@/store/store.types';
import type { ComponentType } from 'react';
import {
  setBudgetsTableState,
  resetBudgetsTableState,
} from '@/store/budgets/budgets.actions';

export interface WithBudgetsActionsProps {
  setBudgetsTableState: (queries: Partial<TableQuery>) => void;
  resetBudgetsTableState: () => void;
}

export const mapDipatchToProps = (
  dispatch: Dispatch,
): WithBudgetsActionsProps => ({
  setBudgetsTableState: (queries: Partial<TableQuery>) =>
    dispatch(setBudgetsTableState(queries)),
  resetBudgetsTableState: () => dispatch(resetBudgetsTableState()),
});

export function withBudgetsActions<P>(
  WrappedComponent: ComponentType<P>,
): ComponentType<Omit<P, keyof WithBudgetsActionsProps>> {
  const Connected = connect(
    null,
    mapDipatchToProps,
  )(WrappedComponent as ComponentType<any>);
  return Connected as unknown as ComponentType<
    Omit<P, keyof WithBudgetsActionsProps>
  >;
}
