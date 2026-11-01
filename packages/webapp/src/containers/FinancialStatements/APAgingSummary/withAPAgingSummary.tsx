import { connect, MapStateToProps } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import type { ComponentType } from 'react';
import { APAgingSummaryFilterDrawerSelector } from '@/store/financial-statement/financial-statements.selectors';
import { ApplicationState } from '@/store/reducers';

export interface WithAPAgingSummaryProps {
  APAgingSummaryFilterDrawer: ReturnType<
    typeof APAgingSummaryFilterDrawerSelector
  >;
}

export const withAPAgingSummary = <
  Props = unknown,
  Mapped extends object = WithAPAgingSummaryProps,
>(
  mapState?: MapState<WithAPAgingSummaryProps, Props, Mapped>,
) => {
  const mapStateToProps: MapStateToProps<
    WithAPAgingSummaryProps | Record<string, unknown>,
    Props,
    ApplicationState
  > = (state, props) => {
    const mapped: WithAPAgingSummaryProps = {
      APAgingSummaryFilterDrawer: APAgingSummaryFilterDrawerSelector(state),
    };
    return (mapState ? mapState(mapped, state, props) : mapped) as
      | WithAPAgingSummaryProps
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
