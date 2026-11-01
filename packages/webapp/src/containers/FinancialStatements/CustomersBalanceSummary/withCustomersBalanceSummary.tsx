import { connect, MapStateToProps } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import type { ComponentType } from 'react';
import { getCustomersBalanceSummaryFilterDrawer } from '@/store/financial-statement/financial-statements.selectors';
import { ApplicationState } from '@/store/reducers';

export interface WithCustomersBalanceSummaryProps {
  customersBalanceDrawerFilter: ReturnType<
    typeof getCustomersBalanceSummaryFilterDrawer
  >;
}

export const withCustomersBalanceSummary = <
  Props = unknown,
  Mapped extends object = WithCustomersBalanceSummaryProps,
>(
  mapState?: MapState<WithCustomersBalanceSummaryProps, Props, Mapped>,
) => {
  const mapStateToProps: MapStateToProps<
    WithCustomersBalanceSummaryProps | Record<string, unknown>,
    Props,
    ApplicationState
  > = (state, props) => {
    const mapped: WithCustomersBalanceSummaryProps = {
      customersBalanceDrawerFilter:
        getCustomersBalanceSummaryFilterDrawer(state),
    };
    return (mapState ? mapState(mapped, state, props) : mapped) as
      | WithCustomersBalanceSummaryProps
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
