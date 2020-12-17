import { connect } from 'react-redux';
import { getResourceViews } from 'store/customViews/customViews.selectors';
import {
  getInvoiceCurrentPageFactory,
  getInvoicePaginationMetaFactory,
  getInvoiceTableQueryFactory,
  getCustomerReceivableInvoicesEntriesFactory,
  getInvoicesCurrentViewIdFactory,
} from 'store/Invoice/invoices.selector';

export default (mapState) => {
  const getInvoicesItems = getInvoiceCurrentPageFactory();

  const getInvoicesPaginationMeta = getInvoicePaginationMetaFactory();
  const getInvoiceTableQuery = getInvoiceTableQueryFactory();

  const getCustomerReceivableInvoicesEntries = getCustomerReceivableInvoicesEntriesFactory();

  const getInvoicesCurrentViewId = getInvoicesCurrentViewIdFactory();

  const mapStateToProps = (state, props) => {
    const query = getInvoiceTableQuery(state, props);

    const mapped = {
      invoicesCurrentPage: getInvoicesItems(state, props, query),
      invoicesCurrentViewId: getInvoicesCurrentViewId(state, props),

      invoicesViews: getResourceViews(state, props, 'sale_invoice'),
      invoicesItems: state.salesInvoices.items,
      invoicesTableQuery: query,
      invoicesPageination: getInvoicesPaginationMeta(state, props, query),
      invoicesLoading: state.salesInvoices.loading,
      customerInvoiceEntries: getCustomerReceivableInvoicesEntries(
        state,
        props,
      ),
      invoiceNumberChanged: state.salesInvoices.journalNumberChanged,
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
