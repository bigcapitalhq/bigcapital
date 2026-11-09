import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import type { TableQuery } from '@/store/store.types';
import type { ComponentType } from 'react';
import {
  setCreditNoteTableState,
  resetCreditNoteTableState,
  setCreditNotesSelectedRows,
  resetCreditNotesSelectedRows,
} from '@/store/credit-note/credit-note.actions';

export interface WithCreditNotesActionsProps {
  setCreditNotesTableState: (queries: Partial<TableQuery>) => void;
  resetCreditNotesTableState: () => void;
  setCreditNotesSelectedRows: (selectedRows: Array<unknown>) => void;
  resetCreditNotesSelectedRows: () => void;
}

export const mapDipatchToProps = (
  dispatch: Dispatch,
): WithCreditNotesActionsProps => ({
  setCreditNotesTableState: (queries: Partial<TableQuery>) =>
    dispatch(setCreditNoteTableState(queries)),
  resetCreditNotesTableState: () => dispatch(resetCreditNoteTableState()),
  setCreditNotesSelectedRows: (selectedRows: Array<unknown>) =>
    dispatch(setCreditNotesSelectedRows(selectedRows)),
  resetCreditNotesSelectedRows: () => dispatch(resetCreditNotesSelectedRows()),
});

export function withCreditNotesActions<P>(
  WrappedComponent: ComponentType<P>,
): ComponentType<Omit<P, keyof WithCreditNotesActionsProps>> {
  const Connected = connect(
    null,
    mapDipatchToProps,
  )(WrappedComponent as ComponentType<any>);
  return Connected as unknown as ComponentType<
    Omit<P, keyof WithCreditNotesActionsProps>
  >;
}
