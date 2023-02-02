// @ts-nocheck
import { connect } from 'react-redux';
import {
  getPaymentReceiveTableStateFactory,
  paymentsTableStateChangedFactory
} from '@/store/PaymentReceives/paymentReceives.selector';

export default (mapState) => {
  const getPaymentReceiveTableState = getPaymentReceiveTableStateFactory();
  const paymentsTableStateChanged = paymentsTableStateChangedFactory();

  const mapStateToProps = (state, props) => {
    const mapped = {
      paymentReceivesTableState: getPaymentReceiveTableState(state, props),
      paymentsTableStateChanged: paymentsTableStateChanged(state, props),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
