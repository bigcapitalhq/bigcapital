import { connect } from 'react-redux';
import {
  submitInventoryAdjustment,
  deleteInventoryAdjustment,
  fetchInventoryAdjustmentsTable,
} from 'store/inventoryAdjustments/inventoryAdjustment.actions';
import t from 'store/types';

const mapDispatchToProps = (dispatch) => ({
  requestSubmitInventoryAdjustment: ({ form }) =>
    dispatch(submitInventoryAdjustment({ form })),
  requestFetchInventoryAdjustmentTable: (query = {}) =>
    dispatch(fetchInventoryAdjustmentsTable({ query: { ...query } })),
  requestDeleteInventoryAdjustment: (id) =>
    dispatch(deleteInventoryAdjustment({ id })),

  addInventoryAdjustmentTableQueries: (queries) =>
    dispatch({
      type: t.INVENTORY_ADJUSTMENTS_TABLE_QUERIES_ADD,
      payload: { queries },
    }),
});

export default connect(null, mapDispatchToProps);
