import { MapDispatchToProps, connect } from 'react-redux';
import {
  SubscriptionPlansPeriod,
  changePlansPeriod,
  initSubscriptionPlans,
} from '@/store/plans/plans.reducer';

export interface WithSubscriptionPlansActionsProps {
  initSubscriptionPlans: () => void;
  changeSubscriptionPlansPeriod: (period: SubscriptionPlansPeriod) => void;
}

export const mapDispatchToProps: MapDispatchToProps<
  WithSubscriptionPlansActionsProps,
  {}
> = (dispatch: any) => ({
  initSubscriptionPlans: () => dispatch(initSubscriptionPlans()),
  changeSubscriptionPlansPeriod: (period: SubscriptionPlansPeriod) =>
    dispatch(changePlansPeriod({ period })),
});

export default connect(null, mapDispatchToProps);
