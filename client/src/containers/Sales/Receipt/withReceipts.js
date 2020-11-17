import { connect } from 'react-redux';
import { getResourceViews } from 'store/customViews/customViews.selectors';
import {
  getReceiptCurrentPageFactory,
  getReceiptsTableQueryFactory,
  getReceiptsPaginationMetaFactory,
  getReceiptsCurrentViewIdFactory
} from 'store/receipt/receipt.selector';

export default (mapState) => {
  const getReceiptsItems = getReceiptCurrentPageFactory();
  const getReceiptPaginationMeta = getReceiptsPaginationMetaFactory();
  const getReceiptsTableQuery = getReceiptsTableQueryFactory();
  const getReceiptsCurrentViewId = getReceiptsCurrentViewIdFactory();

  const mapStateToProps = (state, props) => {
    const tableQuery = getReceiptsTableQuery(state, props);

    const mapped = {
      receiptsCurrentPage: getReceiptsItems(state, props, tableQuery),
      receiptview: getResourceViews(state, props, 'sales_receipts'),
      receiptItems: state.salesReceipts.items,
      receiptTableQuery: tableQuery,
      receiptsPagination: getReceiptPaginationMeta(state, props, tableQuery),

      receiptsLoading: state.salesReceipts.loading,
      receiptNumberChanged: state.salesReceipts.journalNumberChanged,

      receiptsCurrentViewId: getReceiptsCurrentViewId(state, props),
    };

    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
