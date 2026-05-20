// @ts-nocheck
import { connect } from 'react-redux';
import {
  getManualJournalsSelectedRowsFactory,
  getManualJournalsTableStateFactory,
  manualJournalTableStateChangedFactory,
} from '@/store/manual-journals/manual-journals.selectors';

export const withManualJournals = (mapState) => {
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
