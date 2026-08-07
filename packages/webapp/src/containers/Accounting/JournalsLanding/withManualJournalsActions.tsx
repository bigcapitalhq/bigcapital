import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import type { TableQuery } from '@/store/store.types';
import {
  setManualJournalsTableState,
  setManualJournalsSelectedRows,
} from '@/store/manual-journals/manual-journals.actions';

export interface WithManualJournalsActionsProps {
  setManualJournalsTableState: (queries: Partial<TableQuery>) => void;
  setManualJournalsSelectedRows: (selectedRows: Array<unknown>) => void;
}

export const mapDispatchToProps = (
  dispatch: Dispatch,
): WithManualJournalsActionsProps => ({
  setManualJournalsTableState: (queries) =>
    dispatch(setManualJournalsTableState(queries)),
  setManualJournalsSelectedRows: (selectedRows) =>
    dispatch(setManualJournalsSelectedRows(selectedRows)),
});

export const withManualJournalsActions = connect(null, mapDispatchToProps);
