import { connect } from 'react-redux';
import { getResourceViews } from 'store/customViews/customViews.selectors';
import {
  getReceiptCurrentPageFactory,
  getReceiptsTableQueryFactory,
  getReceiptsPaginationMetaFactory,
} from 'store/receipt/receipt.selector';

export default (mapState) => {
  const getReceiptsItems = getReceiptCurrentPageFactory();
  const getReceiptPaginationMeta = getReceiptsPaginationMetaFactory();
  const getReceiptsTableQuery = getReceiptsTableQueryFactory();

  const mapStateToProps = (state, props) => {
    const tableQuery = getReceiptsTableQuery(state, props);

    const mapped = {
      receiptsCurrentPage: getReceiptsItems(state, props, tableQuery),
      receiptview:getResourceViews(state, props, 'sales_receipts'),
      receiptItems: state.sales_receipts.items,
      receiptTableQuery: tableQuery,
      receiptsPagination: getReceiptPaginationMeta(state, props, tableQuery),
      receiptsLoading: state.sales_receipts.loading,
    };

    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
