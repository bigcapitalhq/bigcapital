import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import type { TableQuery } from '@/store/store.types';
import {
  setPaymentReceivesTableState,
  resetPaymentReceivesTableState,
  setPaymentReceivesSelectedRows,
  resetPaymentReceivesSelectedRows,
} from '@/store/payment-receives/payment-receives.actions';

export interface WithPaymentsReceivedActionsProps {
  setPaymentReceivesTableState: (state: Partial<TableQuery>) => void;
  resetPaymentReceivesTableState: () => void;
  setPaymentReceivesSelectedRows: (selectedRows: number[]) => void;
  resetPaymentReceivesSelectedRows: () => void;
}

export const mapDispatchToProps = (
  dispatch: Dispatch,
): WithPaymentsReceivedActionsProps => ({
  setPaymentReceivesTableState: (state: Partial<TableQuery>) =>
    dispatch(setPaymentReceivesTableState(state)),

  resetPaymentReceivesTableState: () =>
    dispatch(resetPaymentReceivesTableState()),

  setPaymentReceivesSelectedRows: (selectedRows: number[]) =>
    dispatch(setPaymentReceivesSelectedRows(selectedRows)),

  resetPaymentReceivesSelectedRows: () =>
    dispatch(resetPaymentReceivesSelectedRows()),
});

export const withPaymentsReceivedActions = connect(null, mapDispatchToProps);
