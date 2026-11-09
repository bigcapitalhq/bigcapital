import { connect, MapStateToProps } from 'react-redux';
import type { ApplicationState } from '@/store/reducers';
import type { ComponentType } from 'react';

interface OwnProps {
  vendorId?: number | string;
}

export interface WithVendorDetailProps {
  vendor: unknown;
}

export const withVendorDetail = () => {
  const mapStateToProps: MapStateToProps<
    WithVendorDetailProps,
    OwnProps,
    ApplicationState
  > = (_state, _props) => ({
    vendor: undefined,
  });
  return function withHOC<P>(
    WrappedComponent: ComponentType<P>,
  ): ComponentType<Omit<P, keyof WithVendorDetailProps>> {
    const Connected = connect(mapStateToProps)(
      WrappedComponent as ComponentType<any>,
    );
    return Connected as unknown as ComponentType<
      Omit<P, keyof WithVendorDetailProps>
    >;
  };
};
