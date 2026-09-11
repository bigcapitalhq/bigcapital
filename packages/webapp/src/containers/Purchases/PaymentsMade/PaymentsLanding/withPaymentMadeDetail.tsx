import { connect, MapStateToProps } from 'react-redux';
import type { ComponentType } from 'react';
import { getPaymentMadeByIdFactory } from '@/store/payment-mades/payment-mades.selector';
import { ApplicationState } from '@/store/reducers';

export interface WithPaymentMadeDetailProps {
  paymentMade: ReturnType<ReturnType<typeof getPaymentMadeByIdFactory>>;
}

export function withPaymentMadeDetail<Props = unknown>() {
  const getPaymentMadeById = getPaymentMadeByIdFactory();

  const mapStateToProps: MapStateToProps<
    WithPaymentMadeDetailProps,
    Props,
    ApplicationState
  > = (state, props) => ({
    paymentMade: getPaymentMadeById(state, props as never),
  });
  return function withHOC<P>(
    WrappedComponent: ComponentType<P>,
  ): ComponentType<Omit<P, keyof WithPaymentMadeDetailProps>> {
    const Connected = connect(mapStateToProps)(
      WrappedComponent as ComponentType<any>,
    );
    return Connected as unknown as ComponentType<
      Omit<P, keyof WithPaymentMadeDetailProps>
    >;
  };
}
