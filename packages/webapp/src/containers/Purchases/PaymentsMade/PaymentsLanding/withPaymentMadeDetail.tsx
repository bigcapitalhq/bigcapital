// @ts-nocheck
import { connect } from 'react-redux';
import { getPaymentMadeByIdFactory } from '@/store/payment-mades/payment-mades.selector';

export const withPaymentMadeDetail = () => {
  const getPaymentMadeById = getPaymentMadeByIdFactory();

  const mapStateToProps = (state, props) => ({
    paymentMade: getPaymentMadeById(state, props),
  });
  return connect(mapStateToProps);
};
