import { connect, MapStateToProps } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import { getCustomersBalanceSummaryFilterDrawer } from '@/store/financial-statement/financial-statements.selectors';
import { ApplicationState } from '@/store/reducers';

export interface WithCustomersBalanceSummaryProps {
  customersBalanceDrawerFilter: ReturnType<
    typeof getCustomersBalanceSummaryFilterDrawer
  >;
}

export const withCustomersBalanceSummary = <Props = unknown,>(
  mapState?: MapState<WithCustomersBalanceSummaryProps, Props>,
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
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
