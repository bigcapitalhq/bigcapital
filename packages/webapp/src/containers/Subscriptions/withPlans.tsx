import { MapStateToProps, connect } from 'react-redux';
import {
  getPlansPeriodSelector,
  getPlansSelector,
} from '@/store/plans/plans.selectors';
import { ApplicationState } from '@/store/reducers';

export interface WithPlansProps {
  plans: ReturnType<ReturnType<typeof getPlansSelector>>;
  plansPeriod: ReturnType<ReturnType<typeof getPlansPeriodSelector>>;
}

type MapState<Props> = (
  mapped: WithPlansProps,
  state: ApplicationState,
  props: Props,
) => any;

export function withPlans<Props>(mapState?: MapState<Props>) {
  const mapStateToProps: MapStateToProps<
    WithPlansProps,
    Props,
    ApplicationState
  > = (state, props) => {
    const getPlans = getPlansSelector();
    const getPlansPeriod = getPlansPeriodSelector();

    const mapped = {
      plans: getPlans(state),
      plansPeriod: getPlansPeriod(state),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
}
