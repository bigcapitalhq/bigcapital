// @ts-nocheck
import { connect } from 'react-redux';
import {
  getManualJournalsSelectedRowsFactory,
  getManualJournalsTableStateFactory,
  manualJournalTableStateChangedFactory,
} from '@/store/manualJournals/manualJournals.selectors';

export default (mapState) => {
  const getJournalsTableQuery = getManualJournalsTableStateFactory();
  const manualJournalTableStateChanged =
    manualJournalTableStateChangedFactory();
  const getSelectedRows = getManualJournalsSelectedRowsFactory();

  const mapStateToProps = (state, props) => {
    const mapped = {
      manualJournalsTableState: getJournalsTableQuery(state, props),
      manualJournalTableStateChanged: manualJournalTableStateChanged(
        state,
        props,
      ),
      manualJournalsSelectedRows: getSelectedRows(state, props),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
