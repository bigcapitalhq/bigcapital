// @ts-nocheck
import { connect } from 'react-redux';
import { setInventoryAdjustmentsTableState } from '@/store/inventoryAdjustments/inventoryAdjustment.actions';

const mapDispatchToProps = (dispatch) => ({
  setInventoryAdjustmentTableState: (queries) =>
    dispatch(setInventoryAdjustmentsTableState(queries)),
});

export const withInventoryAdjustmentActions = connect(null, mapDispatchToProps);
