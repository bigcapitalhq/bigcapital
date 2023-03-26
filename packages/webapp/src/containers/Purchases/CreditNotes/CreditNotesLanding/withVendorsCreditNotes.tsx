// @ts-nocheck
import { connect } from 'react-redux';
import {
  getVendorCreditTableStateFactory,
  isVendorCreditTableStateChangedFactory,
} from '@/store/VendorCredit/vendorCredit.selector';

export default (mapState) => {
  const getVendorsCreditNoteTableState = getVendorCreditTableStateFactory();
  const isVendorsCreditNoteTableChanged =
    isVendorCreditTableStateChangedFactory();

  const mapStateToProps = (state, props) => {
    const mapped = {
      vendorsCreditNoteTableState: getVendorsCreditNoteTableState(state, props),
      vendorsCreditNoteTableStateChanged: isVendorsCreditNoteTableChanged(
        state,
        props,
      ),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
