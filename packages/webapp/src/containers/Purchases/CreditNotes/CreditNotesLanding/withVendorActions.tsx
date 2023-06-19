// @ts-nocheck
import { connect } from 'react-redux';
import {
  setVendorCreditTableState,
  resetVendorCreditTableState,
} from '@/store/VendorCredit/vendorCredit.actions';

const mapDispatchToProps = (dispatch) => ({
  setVendorCreditsTableState: (queries) =>
    dispatch(setVendorCreditTableState(queries)),
  resetVendorCreditsTableState: () => dispatch(resetVendorCreditTableState()),
});

export default connect(null, mapDispatchToProps);
