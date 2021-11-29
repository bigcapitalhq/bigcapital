import { connect } from 'react-redux';
import {
  getCreditNoteTableStateFactory,
  isCreditNoteTableStateChangedFactory,
} from '../../../../store/CreditNotes/creditNotes.selector';

export default (mapState) => {
  const getCreditNoteTableState = getCreditNoteTableStateFactory();
  const isCreditNoteTableChanged = isCreditNoteTableStateChangedFactory();

  const mapStateToProps = (state, props) => {
    const mapped = {
      creditNoteTableState: getCreditNoteTableState(state, props),
      creditNoteTableStateChanged: isCreditNoteTableChanged(state, props),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
