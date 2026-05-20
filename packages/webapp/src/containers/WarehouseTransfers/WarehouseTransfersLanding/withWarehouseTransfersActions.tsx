// @ts-nocheck
import { connect } from 'react-redux';
import {
  setWarehouseTransferTableState,
  resetWarehouseTransferTableState,
} from '@/store/warehouse-transfer/warehouse-transfer.actions';

const mapDipatchToProps = (dispatch) => ({
  setWarehouseTransferTableState: (queries) =>
    dispatch(setWarehouseTransferTableState(queries)),
  resetWarehouseTransferTableState: () => dispatch(resetWarehouseTransferTableState()),
});

export const withWarehouseTransfersActions = connect(null, mapDipatchToProps);