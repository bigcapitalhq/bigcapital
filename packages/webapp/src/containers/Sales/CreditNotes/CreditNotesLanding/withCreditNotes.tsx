import { connect } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import {
  getCreditNotesTableStateFactory,
  isCreditNotesTableStateChangedFactory,
} from '@/store/credit-note/credit-note.selector';
import { ApplicationState } from '@/store/reducers';

export interface WithCreditNotesProps {
  creditNoteTableState: ReturnType<
    ReturnType<typeof getCreditNotesTableStateFactory>
  >;
  creditNoteTableStateChanged: ReturnType<
    ReturnType<typeof isCreditNotesTableStateChangedFactory>
  >;
  creditNotesSelectedRows: unknown[];
}

export const withCreditNotes = <
  Props extends { location?: { search: string } },
>(
  mapState?: MapState<WithCreditNotesProps, Props>,
) => {
  const getCreditNoteTableState = getCreditNotesTableStateFactory();
  const isCreditNoteTableChanged = isCreditNotesTableStateChangedFactory();

  const mapStateToProps = (state: ApplicationState, props: Props) => {
    const mapped: WithCreditNotesProps = {
      creditNoteTableState: getCreditNoteTableState(state, props),
      creditNoteTableStateChanged: isCreditNoteTableChanged(state),
      creditNotesSelectedRows: state.creditNotes?.selectedRows || [],
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
