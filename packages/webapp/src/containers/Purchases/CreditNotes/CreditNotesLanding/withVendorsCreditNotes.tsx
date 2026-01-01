// @ts-nocheck
import { connect } from 'react-redux';
import {
  getVendorCreditTableStateFactory,
  isVendorCreditTableStateChangedFactory,
  getVendorsCreditNoteSelectedRowsFactory,
} from '@/store/VendorCredit/vendorCredit.selector';

export const withVendorsCreditNotes = (mapState) => {
  const getVendorsCreditNoteTableState = getVendorCreditTableStateFactory();
  const isVendorsCreditNoteTableChanged =
    isVendorCreditTableStateChangedFactory();
  const getVendorsCreditNoteSelectedRows =
    getVendorsCreditNoteSelectedRowsFactory();

  const mapStateToProps = (state, props) => {
    const mapped = {
      vendorsCreditNoteTableState: getVendorsCreditNoteTableState(state, props),
      vendorsCreditNoteTableStateChanged: isVendorsCreditNoteTableChanged(
        state,
        props,
      ),
      vendorsCreditNoteSelectedRows: getVendorsCreditNoteSelectedRows(state, props),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
