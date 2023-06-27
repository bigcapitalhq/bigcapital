// @ts-nocheck
import { connect } from 'react-redux';
import { getPaymentMadeByIdFactory } from '@/store/PaymentsMade/paymentMade.selector';

export default () => {
  const getPaymentMadeById = getPaymentMadeByIdFactory();

  const mapStateToProps = (state, props) => ({
    paymentMade: getPaymentMadeById(state, props),
  });
  return connect(mapStateToProps);
};
