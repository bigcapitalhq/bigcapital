// @ts-nocheck
import { createSelector } from 'reselect';

const plansSelector = (state) => state.plans.plans;
const planSelector = (state, props) => state.plans.plans
  .find((plan) => plan.slug === props.planSlug);

// Retrieve manual journal current page results.
export const getPlansSelector = () => createSelector(
  plansSelector,
  (plans) => {
    return plans;
  },
);

// Retrieve plan details.
export const getPlanSelector = () => createSelector(
  planSelector,
  (plan) => plan,
)