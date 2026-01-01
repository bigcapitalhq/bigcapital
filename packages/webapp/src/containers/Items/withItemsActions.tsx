// @ts-nocheck
import { connect } from 'react-redux';
import {
  setItemsTableState,
  resetItemsTableState,
  setItemsSelectedRows,
} from '@/store/items/items.actions';

export const mapDispatchToProps = (dispatch) => ({
  setItemsTableState: (queries) => dispatch(setItemsTableState(queries)),
  resetItemsTableState: () => dispatch(resetItemsTableState()),
  setItemsSelectedRows: (selectedRows) => dispatch(setItemsSelectedRows(selectedRows)),
});

export const withItemsActions = connect(null, mapDispatchToProps);
