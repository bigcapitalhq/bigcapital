import { connect } from 'react-redux';
import {
  getPaymentReceiveByIdFactory,
  getPaymentReceiveInvoices,
} from 'store/PaymentReceive/paymentReceive.selector';

export default () => {
  const getPaymentReceiveById = getPaymentReceiveByIdFactory();

  const mapStateToProps = (state, props) => ({
    paymentReceive: getPaymentReceiveById(state, props),
    paymentReceiveInvoices: getPaymentReceiveInvoices(state, props),
  });
  return connect(mapStateToProps);
};
