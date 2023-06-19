// @ts-nocheck
import { connect } from 'react-redux';
import { getInventoryAdjsTableStateFactory } from '@/store/inventoryAdjustments/inventoryAdjustment.selector';

export default (mapState) => {
  const getInventoryAdjustmentTableState = getInventoryAdjsTableStateFactory();

  const mapStateToProps = (state, props) => {
    const mapped = {
      inventoryAdjustmentTableState: getInventoryAdjustmentTableState(
        state,
        props,
      ),
      inventoryAdjustmentsSelectedRows: state.inventoryAdjustments.selectedRows,
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
