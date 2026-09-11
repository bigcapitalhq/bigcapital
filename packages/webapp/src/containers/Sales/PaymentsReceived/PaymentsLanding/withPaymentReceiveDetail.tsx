import { connect, MapStateToProps } from 'react-redux';
import type { ComponentType } from 'react';
import { ApplicationState } from '@/store/reducers';

export interface WithPaymentReceiveDetailProps {
  paymentReceive: unknown;
  paymentReceiveEntries: unknown;
}

export function withPaymentReceiveDetail<Props = unknown>() {
  const mapStateToProps: MapStateToProps<
    WithPaymentReceiveDetailProps,
    Props,
    ApplicationState
  > = () => ({
    paymentReceive: undefined,
    paymentReceiveEntries: undefined,
  });
  return function withHOC<P>(
    WrappedComponent: ComponentType<P>,
  ): ComponentType<Omit<P, keyof WithPaymentReceiveDetailProps>> {
    const Connected = connect(mapStateToProps)(
      WrappedComponent as ComponentType<any>,
    );
    return Connected as unknown as ComponentType<
      Omit<P, keyof WithPaymentReceiveDetailProps>
    >;
  };
}
