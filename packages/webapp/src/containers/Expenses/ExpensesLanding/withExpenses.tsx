import { connect, MapStateToProps } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import {
  expensesTableStateChangedFactory,
  getExpensesSelectedRowsFactory,
  getExpensesTableStateFactory,
} from '@/store/expenses/expenses.selectors';
import { ApplicationState } from '@/store/reducers';

export interface WithExpensesProps {
  expensesTableState: ReturnType<
    ReturnType<typeof getExpensesTableStateFactory>
  >;
  expensesTableStateChanged: ReturnType<
    ReturnType<typeof expensesTableStateChangedFactory>
  >;
  expensesSelectedRows: ReturnType<
    ReturnType<typeof getExpensesSelectedRowsFactory>
  >;
}

export function withExpenses<Props = unknown>(
  mapState?: MapState<WithExpensesProps, Props>,
) {
  const getExpensesTableState = getExpensesTableStateFactory();
  const expensesTableStateChanged = expensesTableStateChangedFactory();
  const getSelectedRows = getExpensesSelectedRowsFactory();

  const mapStateToProps: MapStateToProps<
    WithExpensesProps,
    Props,
    ApplicationState
  > = (state, props) => {
    const mapped: WithExpensesProps = {
      expensesTableState: getExpensesTableState(state, props as never),
      expensesTableStateChanged: expensesTableStateChanged(state),
      expensesSelectedRows: getSelectedRows(state),
    };
    return mapState
      ? (mapState(mapped, state, props) as WithExpensesProps)
      : mapped;
  };
  return connect(mapStateToProps);
}
