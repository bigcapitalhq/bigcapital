import { connect } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import type { ComponentType } from 'react';
import {
  getPaymentMadesTableStateFactory,
  paymentsTableStateChangedFactory,
  getPaymentMadesSelectedRowsFactory,
} from '@/store/payment-mades/payment-mades.selector';
import { ApplicationState } from '@/store/reducers';

export interface WithPaymentMadeProps {
  paymentMadesTableState: ReturnType<
    ReturnType<typeof getPaymentMadesTableStateFactory>
  >;
  paymentsTableStateChanged: ReturnType<
    ReturnType<typeof paymentsTableStateChangedFactory>
  >;
  paymentMadesSelectedRows: ReturnType<
    ReturnType<typeof getPaymentMadesSelectedRowsFactory>
  >;
}

export const withPaymentMade = <
  Props extends { location?: { search: string } },
  Mapped extends object = WithPaymentMadeProps,
>(
  mapState?: MapState<WithPaymentMadeProps, Props, Mapped>,
) => {
  const getPaymentMadesTableState = getPaymentMadesTableStateFactory();
  const paymentsTableStateChanged = paymentsTableStateChangedFactory();
  const getPaymentMadesSelectedRows = getPaymentMadesSelectedRowsFactory();

  const mapStateToProps = (state: ApplicationState, props: Props) => {
    const mapped: WithPaymentMadeProps = {
      paymentMadesTableState: getPaymentMadesTableState(state, props),
      paymentsTableStateChanged: paymentsTableStateChanged(state),
      paymentMadesSelectedRows: getPaymentMadesSelectedRows(state),
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
