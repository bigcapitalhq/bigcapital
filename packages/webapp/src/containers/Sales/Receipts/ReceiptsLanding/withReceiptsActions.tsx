// @ts-nocheck
import { connect } from 'react-redux';
import {
  setReceiptsTableState,
  resetReceiptsTableState,
  setReceiptsSelectedRows,
} from '@/store/receipts/receipts.actions';

const mapDispatchToProps = (dispatch) => ({
  setReceiptsTableState: (queries) => dispatch(setReceiptsTableState(queries)),
  resetReceiptsTableState: () => dispatch(resetReceiptsTableState()),
  setReceiptsSelectedRows: (selectedRows) =>
    dispatch(setReceiptsSelectedRows(selectedRows)),
});

export const withReceiptsActions = connect(null, mapDispatchToProps);
