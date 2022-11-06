// @ts-nocheck
import { connect } from 'react-redux';
import {
  setManualJournalsTableState,
} from '@/store/manualJournals/manualJournals.actions';

const mapActionsToProps = (dispatch) => ({
  setManualJournalsTableState: (queries) =>
    dispatch(setManualJournalsTableState(queries)),
});

export default connect(null, mapActionsToProps);
