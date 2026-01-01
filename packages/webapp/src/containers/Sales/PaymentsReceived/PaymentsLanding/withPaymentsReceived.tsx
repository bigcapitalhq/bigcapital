// @ts-nocheck
import { connect } from 'react-redux';
import {
  getPaymentReceiveTableStateFactory,
  paymentsTableStateChangedFactory,
  getPaymentReceivesSelectedRowsFactory
} from '@/store/PaymentReceives/paymentReceives.selector';

export const withPaymentsReceived = (mapState) => {
  const getPaymentReceiveTableState = getPaymentReceiveTableStateFactory();
  const paymentsTableStateChanged = paymentsTableStateChangedFactory();
  const getSelectedRows = getPaymentReceivesSelectedRowsFactory();

  const mapStateToProps = (state, props) => {
    const mapped = {
      paymentReceivesTableState: getPaymentReceiveTableState(state, props),
      paymentsTableStateChanged: paymentsTableStateChanged(state, props),
      paymentReceivesSelectedRows: getSelectedRows(state, props),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
