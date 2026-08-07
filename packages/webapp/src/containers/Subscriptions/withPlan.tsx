import { MapStateToProps, connect } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import type { ApplicationState } from '@/store/reducers';
import { getPlanSelector } from '@/store/plans/plans.selectors';

export interface WithPlanProps {
  plan: ReturnType<ReturnType<typeof getPlanSelector>>;
}

export const withPlan = <Props = unknown,>(
  mapState?: MapState<WithPlanProps, Props>,
) => {
  const mapStateToProps: MapStateToProps<
    WithPlanProps,
    Props,
    ApplicationState
  > = (state, props) => {
    const getPlan = getPlanSelector();

    const mapped: WithPlanProps = {
      plan: getPlan(state, props as never),
    };
    return mapState
      ? (mapState(mapped, state, props) as WithPlanProps)
      : mapped;
  };
  return connect(mapStateToProps);
};
