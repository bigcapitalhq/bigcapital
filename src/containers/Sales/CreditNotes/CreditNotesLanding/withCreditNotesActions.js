import { connect } from 'react-redux';
import {
  setCreditNotesTableState,
  resetCreditNotesTableState,
} from '../../../../store/CreditNotes/creditNotes.actions';

const mapDispatchToProps = (dispatch) => ({
  setCreditNoteTableState: (state) => dispatch(setCreditNotesTableState(state)),
  resetCreditNoteTableState: () => dispatch(resetCreditNotesTableState()),
});

export default connect(null, mapDispatchToProps);
