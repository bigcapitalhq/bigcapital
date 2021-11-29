import { connect } from 'react-redux';
import {
  setVendorsCreditNoteTableState,
  resetVendorsCreditNoteTableState,
} from '../../../../store/vendorsCreditNotes/vendorsCreditNotes.actions';

const mapDispatchToProps = (dispatch) => ({
  setVendorsCreditNoteTableState: (state) =>
    dispatch(setVendorsCreditNoteTableState(state)),
  resetVendorsCreditNoteTableState: () =>
    dispatch(resetVendorsCreditNoteTableState()),
});

export default connect(null, mapDispatchToProps);
