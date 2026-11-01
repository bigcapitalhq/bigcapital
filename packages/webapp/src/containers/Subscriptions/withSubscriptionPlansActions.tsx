import { connect } from 'react-redux';
import { Dispatch, AnyAction } from 'redux';
import type { ComponentType } from 'react';
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

export function withSubscriptionPlansActions<P>(
  WrappedComponent: ComponentType<P>,
): ComponentType<Omit<P, keyof WithSubscriptionPlansActionsProps>> {
  const Connected = connect(
    null,
    mapDispatchToProps,
  )(WrappedComponent as ComponentType<any>);
  return Connected as unknown as ComponentType<
    Omit<P, keyof WithSubscriptionPlansActionsProps>
  >;
}
