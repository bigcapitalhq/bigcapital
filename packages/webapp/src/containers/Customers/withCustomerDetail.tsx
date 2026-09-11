import { connect, MapStateToProps } from 'react-redux';
import type { ApplicationState } from '@/store/reducers';
import type { ComponentType } from 'react';

interface OwnProps {
  customerId: number | string;
}

export interface WithCustomerDetailProps {
  customer: unknown;
}

const mapStateToProps: MapStateToProps<
  WithCustomerDetailProps,
  OwnProps,
  ApplicationState
> = (_state, _props) => ({
  customer: undefined,
});

export function withCustomerDetail<P>(
  WrappedComponent: ComponentType<P>,
): ComponentType<Omit<P, keyof WithCustomerDetailProps>> {
  const Connected = connect(mapStateToProps)(
    WrappedComponent as ComponentType<any>,
  );
  return Connected as unknown as ComponentType<
    Omit<P, keyof WithCustomerDetailProps>
  >;
}
