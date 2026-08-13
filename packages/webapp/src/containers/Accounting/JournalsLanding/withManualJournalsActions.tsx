import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import type { TableQuery } from '@/store/store.types';
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

export const withManualJournalsActions = connect(null, mapDispatchToProps);
