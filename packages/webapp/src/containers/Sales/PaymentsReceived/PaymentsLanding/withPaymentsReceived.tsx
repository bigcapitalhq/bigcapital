import { connect } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import {
  getPaymentReceiveTableStateFactory,
  paymentsTableStateChangedFactory,
  getPaymentReceivesSelectedRowsFactory,
} from '@/store/payment-receives/payment-receives.selector';
import { ApplicationState } from '@/store/reducers';

export interface WithPaymentsReceivedProps {
  paymentReceivesTableState: ReturnType<
    ReturnType<typeof getPaymentReceiveTableStateFactory>
  >;
  paymentsTableStateChanged: ReturnType<
    ReturnType<typeof paymentsTableStateChangedFactory>
  >;
  paymentReceivesSelectedRows: ReturnType<
    ReturnType<typeof getPaymentReceivesSelectedRowsFactory>
  >;
}

export const withPaymentsReceived = <
  Props extends { location?: { search: string } },
>(
  mapState?: MapState<WithPaymentsReceivedProps, Props>,
) => {
  const getPaymentReceiveTableState = getPaymentReceiveTableStateFactory();
  const paymentsTableStateChanged = paymentsTableStateChangedFactory();
  const getSelectedRows = getPaymentReceivesSelectedRowsFactory();

  const mapStateToProps = (state: ApplicationState, props: Props) => {
    const mapped: WithPaymentsReceivedProps = {
      paymentReceivesTableState: getPaymentReceiveTableState(state, props),
      paymentsTableStateChanged: paymentsTableStateChanged(state),
      paymentReceivesSelectedRows: getSelectedRows(state),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
