import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import type { TableQuery } from '@/store/store.types';
import type { ComponentType } from 'react';
import {
  setRecurringJournalsTableState,
  resetRecurringJournalsTableState,
  setRecurringJournalsSelectedRows,
  resetRecurringJournalsSelectedRows,
} from '@/ee/recurring-journals/store/recurring-journals.actions';

export interface WithRecurringJournalsActionsProps {
  setRecurringJournalsTableState: (queries: Partial<TableQuery>) => void;
  resetRecurringJournalsTableState: () => void;
  setRecurringJournalsSelectedRows: (selectedRows: Array<unknown>) => void;
  resetRecurringJournalsSelectedRows: () => void;
}

export const mapDispatchToProps = (
  dispatch: Dispatch,
): WithRecurringJournalsActionsProps => ({
  setRecurringJournalsTableState: (queries: Partial<TableQuery>) =>
    dispatch(setRecurringJournalsTableState(queries)),
  resetRecurringJournalsTableState: () =>
    dispatch(resetRecurringJournalsTableState()),
  setRecurringJournalsSelectedRows: (selectedRows: Array<unknown>) =>
    dispatch(setRecurringJournalsSelectedRows(selectedRows)),
  resetRecurringJournalsSelectedRows: () =>
    dispatch(resetRecurringJournalsSelectedRows()),
});

export function withRecurringJournalsActions<P>(
  WrappedComponent: ComponentType<P>,
): ComponentType<Omit<P, keyof WithRecurringJournalsActionsProps>> {
  const Connected = connect(
    null,
    mapDispatchToProps,
  )(WrappedComponent as ComponentType<any>);
  return Connected as unknown as ComponentType<
    Omit<P, keyof WithRecurringJournalsActionsProps>
  >;
}
