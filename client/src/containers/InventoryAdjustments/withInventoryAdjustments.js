import { connect } from 'react-redux';
import {
  getInvoiceTableQueryFactory,
  getInventoryAdjustmentCurrentPageFactory,
  getInventoryAdjustmentPaginationMetaFactory,
} from 'store/inventoryAdjustments/inventoryAdjustment.selector';

export default (mapState) => {
  const getInventoryAdjustmentItems = getInventoryAdjustmentCurrentPageFactory();
  const getInventoryAdjustmentTableQuery = getInvoiceTableQueryFactory();
  const getInventoryAdjustmentsPaginationMeta = getInventoryAdjustmentPaginationMetaFactory();

  const mapStateToProps = (state, props) => {
    const query = getInventoryAdjustmentTableQuery(state, props);

    const mapped = {
      inventoryAdjustmentCurrentPage: getInventoryAdjustmentItems(
        state,
        props,
        query,
      ),
      inventoryAdjustmentItems: Object.values(state.inventoryAdjustments.items),
      inventoryAdjustmentTableQuery: query,
      inventoryAdjustmentsPagination: getInventoryAdjustmentsPaginationMeta(
        state,
        props,
        query,
      ),
      inventoryAdjustmentLoading: state.inventoryAdjustments.loading,
      inventoryAdjustmentsSelectedRows: state.inventoryAdjustments.selectedRows,
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
