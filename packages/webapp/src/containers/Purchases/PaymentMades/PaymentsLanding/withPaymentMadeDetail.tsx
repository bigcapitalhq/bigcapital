// @ts-nocheck
import { connect } from 'react-redux';
import { getPaymentMadeByIdFactory } from '@/store/PaymentMades/paymentMade.selector';

export default () => {
  const getPaymentMadeById = getPaymentMadeByIdFactory();

  const mapStateToProps = (state, props) => ({
    paymentMade: getPaymentMadeById(state, props),
  });
  return connect(mapStateToProps);
};
