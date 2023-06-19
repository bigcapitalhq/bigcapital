// @ts-nocheck
import { connect } from 'react-redux';
import {
  getPaymentsMadeTableStateFactory,
  paymentsTableStateChangedFactory,
} from '@/store/PaymentsMade/paymentsMade.selector';

export default (mapState) => {
  const getPaymentsMadeTableState = getPaymentsMadeTableStateFactory();
  const paymentsTableStateChanged = paymentsTableStateChangedFactory();

  const mapStateToProps = (state, props) => {
    const mapped = {
      paymentsMadeTableState: getPaymentsMadeTableState(state, props),
      paymentsTableStateChanged: paymentsTableStateChanged(state, props),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
