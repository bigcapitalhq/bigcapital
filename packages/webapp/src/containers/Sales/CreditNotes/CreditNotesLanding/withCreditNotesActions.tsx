// @ts-nocheck
import { connect } from 'react-redux';
import {
  setCreditNoteTableState,
  resetCreditNoteTableState,
} from '@/store/CreditNote/creditNote.actions';

const mapDipatchToProps = (dispatch) => ({
  setCreditNotesTableState: (queries) =>
    dispatch(setCreditNoteTableState(queries)),
  resetCreditNotesTableState: () => dispatch(resetCreditNoteTableState()),
});

export default connect(null, mapDipatchToProps);
