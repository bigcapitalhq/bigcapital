import { createSelector } from 'reselect';

const plansSelector = (state) => state.plans.plans;
const planSelector = (state, props) => state.plans.plans
  .find((plan) => plan.slug === props.planSlug);

const plansPeriodsSelector = (state) => state.plans.periods;

// Retrieve manual jounral current page results.
export const getPlansSelector = () => createSelector(
  plansSelector,
  (plans) => {
    return plans;
  },
);

// Retrieve manual jounral current page results.
export const getPlansPeriodsSelector = () => createSelector(
  plansPeriodsSelector,
  (periods) => {
    return periods;
  },
);

// Retrieve plan details.
export const getPlanSelector = () => createSelector(
  planSelector,
  (plan) => plan,
)