import { connect } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import { getProfitLossFilterDrawer } from '@/store/financial-statement/financial-statements.selectors';
import { ApplicationState } from '@/store/reducers';

export interface WithProfitLossProps {
  profitLossDrawerFilter: ReturnType<typeof getProfitLossFilterDrawer>;
}

export const withProfitLoss = <Props,>(
  mapState?: MapState<WithProfitLossProps, Props>,
) => {
  const mapStateToProps = (state: ApplicationState, props: Props) => {
    const mapped: WithProfitLossProps = {
      profitLossDrawerFilter: getProfitLossFilterDrawer(state),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
