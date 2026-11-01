import { connect, MapStateToProps } from 'react-redux';
import type { ComponentType } from 'react';
import { ApplicationState } from '@/store/reducers';

export interface WithEstimateDetailProps {
  estimate: unknown;
}

export function withEstimateDetail<Props = unknown>() {
  const mapStateToProps: MapStateToProps<
    WithEstimateDetailProps,
    Props,
    ApplicationState
  > = () => ({
    estimate: undefined,
  });
  return function withHOC<P>(
    WrappedComponent: ComponentType<P>,
  ): ComponentType<Omit<P, keyof WithEstimateDetailProps>> {
    const Connected = connect(mapStateToProps)(
      WrappedComponent as ComponentType<any>,
    );
    return Connected as unknown as ComponentType<
      Omit<P, keyof WithEstimateDetailProps>
    >;
  };
}
