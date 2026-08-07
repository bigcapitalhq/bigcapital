import { connect } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import {
  getPaymentMadesTableStateFactory,
  paymentsTableStateChangedFactory,
} from '@/store/payment-mades/payment-mades.selector';
import { ApplicationState } from '@/store/reducers';

export interface WithPaymentMadeProps {
  paymentMadesTableState: ReturnType<
    ReturnType<typeof getPaymentMadesTableStateFactory>
  >;
  paymentsTableStateChanged: ReturnType<
    ReturnType<typeof paymentsTableStateChangedFactory>
  >;
}

export const withPaymentMade = <
  Props extends { location?: { search: string } },
>(
  mapState?: MapState<WithPaymentMadeProps, Props>,
) => {
  const getPaymentMadesTableState = getPaymentMadesTableStateFactory();
  const paymentsTableStateChanged = paymentsTableStateChangedFactory();

  const mapStateToProps = (state: ApplicationState, props: Props) => {
    const mapped: WithPaymentMadeProps = {
      paymentMadesTableState: getPaymentMadesTableState(state, props),
      paymentsTableStateChanged: paymentsTableStateChanged(state),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
