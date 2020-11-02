import { connect } from 'react-redux';
import { getResourceViews } from 'store/customViews/customViews.selectors';
import {
  getInvoiceCurrentPageFactory,
  getInvoicePaginationMetaFactory,
  getInvoiceTableQueryFactory,
  getCustomerReceivableInvoicesFactory,
  getPaymentReceivableInvoicesFactory,
  getPaymentReceiveReceivableInvoicesFactory
} from 'store/Invoice/invoices.selector';

export default (mapState) => {
  const getInvoicesItems = getInvoiceCurrentPageFactory();

  const getInvoicesPaginationMeta = getInvoicePaginationMetaFactory();
  const getInvoiceTableQuery = getInvoiceTableQueryFactory();

  // const getPaymentReceivableInvoices = getPaymentReceivableInvoicesFactory();
  // const getCustomerReceivableInvoices = getCustomerReceivableInvoicesFactory();
  
  const getPaymentReceiveReceivableInvoices = getPaymentReceiveReceivableInvoicesFactory();

  const mapStateToProps = (state, props) => {
    const query = getInvoiceTableQuery(state, props);

    const mapped = {
      invoicesCurrentPage: getInvoicesItems(state, props, query),
      invoicesViews: getResourceViews(state, props, 'sales_invoices'),
      invoicesItems: state.salesInvoices.items,
      invoicesTableQuery: query,
      invoicesPageination: getInvoicesPaginationMeta(state, props, query),
      invoicesLoading: state.salesInvoices.loading,

      paymentReceiveReceivableInvoices: getPaymentReceiveReceivableInvoices(state, props),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
