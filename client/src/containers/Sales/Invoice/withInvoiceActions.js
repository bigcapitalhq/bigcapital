import { connect } from 'react-redux';
import {
  submitInvoice,
  editInvoice,
  deleteInvoice,
  fetchInvoice,
  fetchInvoicesTable,
} from 'store/Invoice/invoices.actions';
import t from 'store/types';

const mapDipatchToProps = (dispatch) => ({
  requestSubmitInvoice: (form) => dispatch(submitInvoice({ form })),
  requsetFetchInvoice: (id) => dispatch(fetchInvoice({ id })),
  requestEditInvoice: (id, form) => dispatch(editInvoice( id, form )),
  requestFetchInvoiceTable: (query = {}) =>
    dispatch(fetchInvoicesTable({ query: { ...query } })),
  requestDeleteInvoice: (id) => dispatch(deleteInvoice({ id })),

  changeInvoiceView: (id) =>
    dispatch({
      type: t.INVOICES_SET_CURRENT_VIEW,
      currentViewId: parseInt(id, 10),
    }),
  addInvoiceTableQueries: (_queries) =>
    dispatch({
      type: t.INVOICES_TABLE_QUERIES_ADD,
      _queries,
    }),
});

export default connect(null, mapDipatchToProps);
