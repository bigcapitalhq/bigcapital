import { connect } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import type { ComponentType } from 'react';
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
  Mapped extends object = WithPaymentsReceivedProps,
>(
  mapState?: MapState<WithPaymentsReceivedProps, Props, Mapped>,
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
  return function withHOC<P>(
    WrappedComponent: ComponentType<P>,
  ): ComponentType<Omit<P, keyof Mapped>> {
    const Connected = connect(mapStateToProps)(
      WrappedComponent as ComponentType<any>,
    );
    return Connected as unknown as ComponentType<Omit<P, keyof Mapped>>;
  };
};
