// @ts-nocheck
import { connect } from 'react-redux';
import {
  setVendorCreditTableState,
  resetVendorCreditTableState,
} from '@/store/VendorCredit/vendorCredit.actions';

const mapDipatchToProps = (dispatch) => ({
  setVendorCreditsTableState: (queries) =>
    dispatch(setVendorCreditTableState(queries)),
  resetVendorCreditsTableState: () => dispatch(resetVendorCreditTableState()),
});

export default connect(null, mapDipatchToProps);
