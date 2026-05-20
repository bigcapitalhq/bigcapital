// @ts-nocheck
import { connect } from 'react-redux';
import {
  setPaymentReceivesTableState,
  resetPaymentReceivesTableState,
  setPaymentReceivesSelectedRows,
} from '@/store/payment-receives/payment-receives.actions';

const mapDispatchToProps = (dispatch) => ({
  setPaymentReceivesTableState: (state) =>
    dispatch(setPaymentReceivesTableState(state)),

  resetPaymentReceivesTableState: () =>
    dispatch(resetPaymentReceivesTableState()),

  setPaymentReceivesSelectedRows: (selectedRows: number[]) =>
    dispatch(setPaymentReceivesSelectedRows(selectedRows)),
});

export const withPaymentsReceivedActions = connect(null, mapDispatchToProps);
