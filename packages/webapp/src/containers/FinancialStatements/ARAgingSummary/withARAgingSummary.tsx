import { connect, MapStateToProps } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import { getARAgingSummaryFilterDrawer } from '@/store/financial-statement/financial-statements.selectors';
import { ApplicationState } from '@/store/reducers';

export interface WithARAgingSummaryProps {
  ARAgingSummaryFilterDrawer: ReturnType<typeof getARAgingSummaryFilterDrawer>;
}

export const withARAgingSummary = <Props = unknown,>(
  mapState?: MapState<WithARAgingSummaryProps, Props>,
) => {
  const mapStateToProps: MapStateToProps<
    WithARAgingSummaryProps | Record<string, unknown>,
    Props,
    ApplicationState
  > = (state, props) => {
    const mapped: WithARAgingSummaryProps = {
      ARAgingSummaryFilterDrawer: getARAgingSummaryFilterDrawer(state),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
