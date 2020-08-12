import { connect } from 'react-redux';
import { getInvoiecsByIdFactory } from 'store/Invoice/invoices.selector';

export default () => {
  const getInvoiceById = getInvoiecsByIdFactory();
  
  const mapStateToProps = (state, props) => ({
    invoice: getInvoiceById(state, props),
  });
  return connect(mapStateToProps);
};
