import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import type { TableQuery } from '@/store/store.types';
import type { ComponentType } from 'react';
import {
  setManualJournalsTableState,
  setManualJournalsSelectedRows,
  resetManualJournalsSelectedRows,
} from '@/store/manual-journals/manual-journals.actions';

export interface WithManualJournalsActionsProps {
  setManualJournalsTableState: (queries: Partial<TableQuery>) => void;
  setManualJournalsSelectedRows: (selectedRows: Array<unknown>) => void;
  resetManualJournalsSelectedRows: () => void;
}

export const mapDispatchToProps = (
  dispatch: Dispatch,
): WithManualJournalsActionsProps => ({
  setManualJournalsTableState: (queries) =>
    dispatch(setManualJournalsTableState(queries)),
  setManualJournalsSelectedRows: (selectedRows) =>
    dispatch(setManualJournalsSelectedRows(selectedRows)),
  resetManualJournalsSelectedRows: () =>
    dispatch(resetManualJournalsSelectedRows()),
});

export function withManualJournalsActions<P>(
  WrappedComponent: ComponentType<P>,
): ComponentType<Omit<P, keyof WithManualJournalsActionsProps>> {
  const Connected = connect(
    null,
    mapDispatchToProps,
  )(WrappedComponent as ComponentType<any>);
  return Connected as unknown as ComponentType<
    Omit<P, keyof WithManualJournalsActionsProps>
  >;
}
