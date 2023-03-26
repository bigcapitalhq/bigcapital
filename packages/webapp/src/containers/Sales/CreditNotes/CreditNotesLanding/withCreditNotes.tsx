// @ts-nocheck
import { connect } from 'react-redux';
import {
  getCreditNotesTableStateFactory,
  isCreditNotesTableStateChangedFactory,
} from '@/store/CreditNote/creditNote.selector';

export default (mapState) => {
  const getCreditNoteTableState = getCreditNotesTableStateFactory();
  const isCreditNoteTableChanged = isCreditNotesTableStateChangedFactory();

  const mapStateToProps = (state, props) => {
    const mapped = {
      creditNoteTableState: getCreditNoteTableState(state, props),
      creditNoteTableStateChanged: isCreditNoteTableChanged(state, props),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
