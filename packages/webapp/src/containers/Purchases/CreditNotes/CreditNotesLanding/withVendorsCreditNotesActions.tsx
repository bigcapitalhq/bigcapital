import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import type { TableQuery } from '@/store/store.types';
import type { ComponentType } from 'react';
import {
  setVendorCreditTableState,
  resetVendorCreditTableState,
  setVendorCreditsSelectedRows,
  resetVendorCreditsSelectedRows,
} from '@/store/vendor-credit/vendor-credit.actions';

export interface WithVendorsCreditNotesActionsProps {
  setVendorsCreditNoteTableState: (queries: Partial<TableQuery>) => void;
  resetVendorsCreditNoteTableState: () => void;
  setVendorsCreditNoteSelectedRows: (selectedRows: Array<unknown>) => void;
  resetVendorsCreditNoteSelectedRows: () => void;
}

export const mapDispatchToProps = (
  dispatch: Dispatch,
): WithVendorsCreditNotesActionsProps => ({
  setVendorsCreditNoteTableState: (queries: Partial<TableQuery>) =>
    dispatch(setVendorCreditTableState(queries)),
  resetVendorsCreditNoteTableState: () =>
    dispatch(resetVendorCreditTableState()),
  setVendorsCreditNoteSelectedRows: (selectedRows: Array<unknown>) =>
    dispatch(setVendorCreditsSelectedRows(selectedRows)),
  resetVendorsCreditNoteSelectedRows: () =>
    dispatch(resetVendorCreditsSelectedRows()),
});

export function withVendorsCreditNotesActions<P>(
  WrappedComponent: ComponentType<P>,
): ComponentType<Omit<P, keyof WithVendorsCreditNotesActionsProps>> {
  const Connected = connect(
    null,
    mapDispatchToProps,
  )(WrappedComponent as ComponentType<any>);
  return Connected as unknown as ComponentType<
    Omit<P, keyof WithVendorsCreditNotesActionsProps>
  >;
}
