// @ts-nocheck
import { connect } from 'react-redux';
import {
  getWarehouseTransfersTableStateFactory,
  isWarehouseTransferTableStateChangedFactory,
} from '@/store/WarehouseTransfer/warehouseTransfer.selector';

export default (mapState) => {
  const getWarehouseTransferTableState = getWarehouseTransfersTableStateFactory();
  const isWarehouseTransferTableChanged = isWarehouseTransferTableStateChangedFactory();

  const mapStateToProps = (state, props) => {
    const mapped = {
      warehouseTransferTableState: getWarehouseTransferTableState(state, props),
      warehouseTransferTableStateChanged: isWarehouseTransferTableChanged(state, props),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
