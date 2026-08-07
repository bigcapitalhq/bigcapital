import { MapStateToProps, connect } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import {
  getPlansPeriodSelector,
  getPlansSelector,
} from '@/store/plans/plans.selectors';
import { ApplicationState } from '@/store/reducers';

export interface WithPlansProps {
  plans: ReturnType<ReturnType<typeof getPlansSelector>>;
  plansPeriod: ReturnType<ReturnType<typeof getPlansPeriodSelector>>;
}

export function withPlans<Props = unknown>(
  mapState?: MapState<WithPlansProps, Props>,
) {
  const mapStateToProps: MapStateToProps<
    WithPlansProps,
    Props,
    ApplicationState
  > = (state, props) => {
    const getPlans = getPlansSelector();
    const getPlansPeriod = getPlansPeriodSelector();

    const mapped: WithPlansProps = {
      plans: getPlans(state),
      plansPeriod: getPlansPeriod(state),
    };
    return mapState
      ? (mapState(mapped, state, props) as WithPlansProps)
      : mapped;
  };
  return connect(mapStateToProps);
}
