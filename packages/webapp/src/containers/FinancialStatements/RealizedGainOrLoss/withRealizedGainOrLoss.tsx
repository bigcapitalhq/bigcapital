import { connect } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import { getRealizedGainOrLossFilterDrawer } from '@/store/financial-statement/financial-statements.selectors';
import { ApplicationState } from '@/store/reducers';

export interface WithRealizedGainOrLossProps {
  realizedGainOrLossDrawerFilter: ReturnType<
    typeof getRealizedGainOrLossFilterDrawer
  >;
}

export const withRealizedGainOrLoss = <Props,>(
  mapState?: MapState<WithRealizedGainOrLossProps, Props>,
) => {
  const mapStateToProps = (state: ApplicationState, props: Props) => {
    const mapped: WithRealizedGainOrLossProps = {
      realizedGainOrLossDrawerFilter: getRealizedGainOrLossFilterDrawer(state),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
