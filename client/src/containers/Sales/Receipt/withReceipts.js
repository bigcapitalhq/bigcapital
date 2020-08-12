import { connect } from 'react-redux';
import { getResourceViews } from 'store/customViews/customViews.selectors';
import {
  getReceiptCurrentPageFactory,
  getReceiptsTableQuery,
  getReceiptsPaginationMetaFactory,
} from 'store/receipt/receipt.selector';

export default (mapState) => {
  const getReceiptsItems = getReceiptCurrentPageFactory();
  const getReceiptPaginationMeta = getReceiptsPaginationMetaFactory();

  const mapStateToProps = (state, props) => {
    const query = getReceiptsTableQuery(state, props);
    const mapped = {
      receiptsCurrentPage: getReceiptsItems(state, props, query),
      receiptview:getResourceViews(state, props, 'sales_receipts'),
      receiptItems: state.sales_receipts.items,
      receiptTableQuery: query,
      receiptsPagination: getReceiptPaginationMeta(state, props, query),
      receiptsLoading: state.sales_receipts.loading,
    };

    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
