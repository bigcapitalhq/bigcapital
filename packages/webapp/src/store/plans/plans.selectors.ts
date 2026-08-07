import { createSelector } from 'reselect';
import type { SubscriptionPlan } from '@/constants/subscriptionModels';
import type { RootState } from '@/store/reducers';

const plansSelector = (state: RootState) =>
  state.plans.plans as SubscriptionPlan[];
const planSelector = (state: RootState, props: { planSlug: string }) =>
  (state.plans.plans as SubscriptionPlan[]).find(
    (plan) => plan.slug === props.planSlug,
  );

const plansPeriodSelector = (state: RootState) => state.plans.plansPeriod;

// Retrieve plans list.
export const getPlansSelector = () =>
  createSelector(plansSelector, (plans) => plans);

// Retrieve plan details.
export const getPlanSelector = () =>
  createSelector(planSelector, (plan) => plan);

// Retrieves the plans period (monthly or annually).
export const getPlansPeriodSelector = () =>
  createSelector(plansPeriodSelector, (periods) => periods);
