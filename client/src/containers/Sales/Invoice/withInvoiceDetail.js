import { connect } from 'react-redux';
import { getInvoiceById } from 'store/Invoice/invoices.selector';

export default () => {
  const getInvoiceById = getInvoiceById();

  const mapStateToProps = (state, props) => ({
    invoice: getInvoiceById(state, props),
  });
  return connect(mapStateToProps);
};
