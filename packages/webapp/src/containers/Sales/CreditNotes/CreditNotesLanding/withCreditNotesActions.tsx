// @ts-nocheck
import { connect } from 'react-redux';
import {
  setCreditNoteTableState,
  resetCreditNoteTableState,
  setCreditNotesSelectedRows,
} from '@/store/credit-note/credit-note.actions';

const mapDipatchToProps = (dispatch) => ({
  setCreditNotesTableState: (queries) =>
    dispatch(setCreditNoteTableState(queries)),
  resetCreditNotesTableState: () => dispatch(resetCreditNoteTableState()),
  setCreditNotesSelectedRows: (selectedRows) => dispatch(setCreditNotesSelectedRows(selectedRows)),
});

export const withCreditNotesActions = connect(null, mapDipatchToProps);
