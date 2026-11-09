import { ComponentType } from 'react';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import type { RootState } from '@/store/reducers';
import type { TableQuery } from '@/store/store.types';
import {
  setExpensesTableState,
  resetExpensesTableState,
  setExpensesSelectedRows,
  resetExpensesSelectedRows,
} from '@/store/expenses/expenses.actions';

export interface WithExpensesActionsProps {
  setExpensesTableState: (state: Partial<TableQuery>) => void;
  resetExpensesTableState: () => void;
  setExpensesSelectedRows: (selectedRows: Array<unknown>) => void;
  resetExpensesSelectedRows: () => void;
}

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, unknown, AnyAction>,
): WithExpensesActionsProps => ({
  setExpensesTableState: (state) => dispatch(setExpensesTableState(state)),
  resetExpensesTableState: () => dispatch(resetExpensesTableState()),
  setExpensesSelectedRows: (selectedRows) =>
    dispatch(setExpensesSelectedRows(selectedRows)),
  resetExpensesSelectedRows: () => dispatch(resetExpensesSelectedRows()),
});

export function withExpensesActions<P>(
  WrappedComponent: ComponentType<P>,
): ComponentType<Omit<P, keyof WithExpensesActionsProps>> {
  const Connected = connect(
    null,
    mapDispatchToProps,
  )(WrappedComponent as ComponentType<any>);
  return Connected as unknown as ComponentType<
    Omit<P, keyof WithExpensesActionsProps>
  >;
}
