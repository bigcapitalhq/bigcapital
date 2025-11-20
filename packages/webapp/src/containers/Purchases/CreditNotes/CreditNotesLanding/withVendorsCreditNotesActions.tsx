// @ts-nocheck
import { connect } from 'react-redux';
import {
  setVendorCreditTableState,
  resetVendorCreditTableState,
  setVendorCreditsSelectedRows,
} from '@/store/VendorCredit/vendorCredit.actions';

const mapDispatchToProps = (dispatch) => ({
  setVendorsCreditNoteTableState: (queries) =>
    dispatch(setVendorCreditTableState(queries)),
  resetVendorsCreditNoteTableState: () =>
    dispatch(resetVendorCreditTableState()),
  setVendorsCreditNoteSelectedRows: (selectedRows) =>
    dispatch(setVendorCreditsSelectedRows(selectedRows)),
});

export default connect(null, mapDispatchToProps);
