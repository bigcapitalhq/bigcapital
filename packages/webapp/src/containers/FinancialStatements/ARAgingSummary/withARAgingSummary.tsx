import { connect, MapStateToProps } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import type { ComponentType } from 'react';
import { getARAgingSummaryFilterDrawer } from '@/store/financial-statement/financial-statements.selectors';
import { ApplicationState } from '@/store/reducers';

export interface WithARAgingSummaryProps {
  ARAgingSummaryFilterDrawer: ReturnType<typeof getARAgingSummaryFilterDrawer>;
}

export const withARAgingSummary = <
  Props = unknown,
  Mapped extends object = WithARAgingSummaryProps,
>(
  mapState?: MapState<WithARAgingSummaryProps, Props, Mapped>,
) => {
  const mapStateToProps: MapStateToProps<
    WithARAgingSummaryProps | Record<string, unknown>,
    Props,
    ApplicationState
  > = (state, props) => {
    const mapped: WithARAgingSummaryProps = {
      ARAgingSummaryFilterDrawer: getARAgingSummaryFilterDrawer(state),
    };
    return (mapState ? mapState(mapped, state, props) : mapped) as
      | WithARAgingSummaryProps
      | Record<string, unknown>;
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
