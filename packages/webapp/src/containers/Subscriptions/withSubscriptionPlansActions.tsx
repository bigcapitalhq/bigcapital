import { connect } from 'react-redux';
import { Dispatch, AnyAction } from 'redux';
import {
  SubscriptionPlansPeriod,
  changePlansPeriod,
  initSubscriptionPlans,
} from '@/store/plans/plans.reducer';

export interface WithSubscriptionPlansActionsProps {
  initSubscriptionPlans: () => void;
  changeSubscriptionPlansPeriod: (period: SubscriptionPlansPeriod) => void;
}

export const mapDispatchToProps = (
  dispatch: Dispatch<AnyAction>,
): WithSubscriptionPlansActionsProps => ({
  initSubscriptionPlans: () => {
    dispatch(initSubscriptionPlans());
  },
  changeSubscriptionPlansPeriod: (period: SubscriptionPlansPeriod) => {
    dispatch(changePlansPeriod({ period }));
  },
});

export const withSubscriptionPlansActions = connect(null, mapDispatchToProps);
