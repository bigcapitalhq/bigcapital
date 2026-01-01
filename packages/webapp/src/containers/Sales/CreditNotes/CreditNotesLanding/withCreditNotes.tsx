// @ts-nocheck
import { connect } from 'react-redux';
import {
  getCreditNotesTableStateFactory,
  isCreditNotesTableStateChangedFactory,
} from '@/store/CreditNote/creditNote.selector';

export const withCreditNotes = (mapState) => {
  const getCreditNoteTableState = getCreditNotesTableStateFactory();
  const isCreditNoteTableChanged = isCreditNotesTableStateChangedFactory();

  const mapStateToProps = (state, props) => {
    const mapped = {
      creditNoteTableState: getCreditNoteTableState(state, props),
      creditNoteTableStateChanged: isCreditNoteTableChanged(state, props),
      creditNotesSelectedRows: state.creditNotes?.selectedRows || [],
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
