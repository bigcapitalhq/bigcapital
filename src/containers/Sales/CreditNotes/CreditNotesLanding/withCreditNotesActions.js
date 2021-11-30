import { connect } from 'react-redux';
import {
  setCreditNotesTableState,
  resetCreditNotesTableState,
} from '../../../../store/CreditNotes/creditNotes.actions';

const mapDipatchToProps = (dispatch) => ({
  setCreditNotesTableState: (queries) =>
    dispatch(setCreditNotesTableState(queries)),
  resetCreditNotesTableState: () => dispatch(resetCreditNotesTableState()),
});

export default connect(null, mapDipatchToProps);
