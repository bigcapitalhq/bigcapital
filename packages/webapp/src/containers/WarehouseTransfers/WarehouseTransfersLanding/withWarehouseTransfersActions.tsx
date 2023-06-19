// @ts-nocheck
import { connect } from 'react-redux';
import {
  setWarehouseTransferTableState,
  resetWarehouseTransferTableState,
} from '@/store/WarehouseTransfer/warehouseTransfer.actions';

const mapDispatchToProps = (dispatch) => ({
  setWarehouseTransferTableState: (queries) =>
    dispatch(setWarehouseTransferTableState(queries)),
  resetWarehouseTransferTableState: () => dispatch(resetWarehouseTransferTableState()),
});

export default connect(null, mapDispatchToProps);