import { connect } from 'react-redux';
import {
  getVendorsCreditNoteTableStateFactory,
  isVendorsCreditNoteTableStateChangedFactory,
} from '../../../../store/vendorsCreditNotes/vendorsCreditNotes.selector';

export default (mapState) => {
  const getVendorsCreditNoteTableState =
    getVendorsCreditNoteTableStateFactory();
  const isVendorsCreditNoteTableChanged =
    isVendorsCreditNoteTableStateChangedFactory();

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
