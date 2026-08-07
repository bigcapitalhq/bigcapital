import { connect } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import { getVendorsBalanceSummaryFilterDrawer } from '@/store/financial-statement/financial-statements.selectors';
import { ApplicationState } from '@/store/reducers';

export interface WithVendorsBalanceSummaryProps {
  VendorsSummaryFilterDrawer: ReturnType<
    typeof getVendorsBalanceSummaryFilterDrawer
  >;
}

export const withVendorsBalanceSummary = <Props,>(
  mapState?: MapState<WithVendorsBalanceSummaryProps, Props>,
) => {
  const mapStateToProps = (state: ApplicationState, props: Props) => {
    const mapped: WithVendorsBalanceSummaryProps = {
      VendorsSummaryFilterDrawer: getVendorsBalanceSummaryFilterDrawer(state),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
