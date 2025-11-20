// @ts-nocheck
import { connect } from 'react-redux';
import {
  setCreditNoteTableState,
  resetCreditNoteTableState,
  setCreditNotesSelectedRows,
} from '@/store/CreditNote/creditNote.actions';

const mapDipatchToProps = (dispatch) => ({
  setCreditNotesTableState: (queries) =>
    dispatch(setCreditNoteTableState(queries)),
  resetCreditNotesTableState: () => dispatch(resetCreditNoteTableState()),
  setCreditNotesSelectedRows: (selectedRows) => dispatch(setCreditNotesSelectedRows(selectedRows)),
});

export default connect(null, mapDipatchToProps);
