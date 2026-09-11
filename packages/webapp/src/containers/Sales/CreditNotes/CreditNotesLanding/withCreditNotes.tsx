import { connect } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import type { ComponentType } from 'react';
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
  Mapped extends object = WithCreditNotesProps,
>(
  mapState?: MapState<WithCreditNotesProps, Props, Mapped>,
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
  return function withHOC<P>(
    WrappedComponent: ComponentType<P>,
  ): ComponentType<Omit<P, keyof Mapped>> {
    const Connected = connect(mapStateToProps)(
      WrappedComponent as ComponentType<any>,
    );
    return Connected as unknown as ComponentType<Omit<P, keyof Mapped>>;
  };
};
