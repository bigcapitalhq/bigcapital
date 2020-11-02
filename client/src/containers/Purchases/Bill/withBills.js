import { connect } from 'react-redux';
import { getResourceViews } from 'store/customViews/customViews.selectors';
import {
  getBillCurrentPageFactory,
  getBillPaginationMetaFactory,
  getBillTableQueryFactory,
  getVendorPayableBillsFactory,
  getPayableBillsByPaymentMadeFactory
} from 'store/Bills/bills.selectors';

export default (mapState) => {
  const getBillsItems = getBillCurrentPageFactory();
  const getBillsPaginationMeta = getBillPaginationMetaFactory();
  const getBillTableQuery = getBillTableQueryFactory();
  const getVendorPayableBills = getVendorPayableBillsFactory();
  const getPayableBillsByPaymentMade = getPayableBillsByPaymentMadeFactory();

  const mapStateToProps = (state, props) => {
    const tableQuery = getBillTableQuery(state, props);

    const mapped = {
      billsCurrentPage: getBillsItems(state, props, tableQuery),
      billsViews: getResourceViews(state, props, 'bills'),
      billsItems: state.bills.items,
      billsTableQuery: tableQuery,

      billsPageination: getBillsPaginationMeta(state, props, tableQuery),
      billsLoading: state.bills.loading,
      nextBillNumberChanged: state.bills.nextBillNumberChanged,

      vendorPayableBills: getVendorPayableBills(state, props),
      paymentMadePayableBills: getPayableBillsByPaymentMade(state, props),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
