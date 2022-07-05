import { connect } from 'react-redux';
import {
  getPaymentReceiveByIdFactory,
  getPaymentReceiveEntriesFactory,
} from '@/store/PaymentReceive/paymentReceive.selector';

export default () => {
  const getPaymentReceiveById = getPaymentReceiveByIdFactory();
  const getPaymentReceiveEntries = getPaymentReceiveEntriesFactory();

  const mapStateToProps = (state, props) => ({
    paymentReceive: getPaymentReceiveById(state, props),
    paymentReceiveEntries: getPaymentReceiveEntries(state, props),
  });
  return connect(mapStateToProps);
};
