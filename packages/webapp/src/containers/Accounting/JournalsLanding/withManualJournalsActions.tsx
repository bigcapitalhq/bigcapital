// @ts-nocheck
import { connect } from 'react-redux';
import {
  setManualJournalsTableState,
  setManualJournalsSelectedRows,
} from '@/store/manualJournals/manualJournals.actions';

const mapActionsToProps = (dispatch) => ({
  setManualJournalsTableState: (queries) =>
    dispatch(setManualJournalsTableState(queries)),
  setManualJournalsSelectedRows: (selectedRows) =>
    dispatch(setManualJournalsSelectedRows(selectedRows)),
});

export const withManualJournalsActions = connect(null, mapActionsToProps);
