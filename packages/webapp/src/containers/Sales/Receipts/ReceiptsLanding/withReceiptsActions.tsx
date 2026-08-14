import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import type { TableQuery } from '@/store/store.types';
import {
  setReceiptsTableState,
  resetReceiptsTableState,
  setReceiptsSelectedRows,
  resetReceiptsSelectedRows,
} from '@/store/receipts/receipts.actions';

export interface WithReceiptsActionsProps {
  setReceiptsTableState: (queries: Partial<TableQuery>) => void;
  resetReceiptsTableState: () => void;
  setReceiptsSelectedRows: (selectedRows: Array<unknown>) => void;
  resetReceiptsSelectedRows: () => void;
}

export const mapDispatchToProps = (
  dispatch: Dispatch,
): WithReceiptsActionsProps => ({
  setReceiptsTableState: (queries: Partial<TableQuery>) =>
    dispatch(setReceiptsTableState(queries)),
  resetReceiptsTableState: () => dispatch(resetReceiptsTableState()),
  setReceiptsSelectedRows: (selectedRows: Array<unknown>) =>
    dispatch(setReceiptsSelectedRows(selectedRows)),
  resetReceiptsSelectedRows: () => dispatch(resetReceiptsSelectedRows()),
});

export const withReceiptsActions = connect(null, mapDispatchToProps);
