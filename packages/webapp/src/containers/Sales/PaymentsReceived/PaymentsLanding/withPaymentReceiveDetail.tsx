// @ts-nocheck
import { connect } from 'react-redux';
import {
  getPaymentReceiveByIdFactory,
  getPaymentReceiveEntriesFactory,
} from '@/store/payment-receives/payment-receives.selector';

export const withPaymentReceiveDetail = () => {
  const getPaymentReceiveById = getPaymentReceiveByIdFactory();
  const getPaymentReceiveEntries = getPaymentReceiveEntriesFactory();

  const mapStateToProps = (state, props) => ({
    paymentReceive: getPaymentReceiveById(state, props),
    paymentReceiveEntries: getPaymentReceiveEntries(state, props),
  });
  return connect(mapStateToProps);
};
