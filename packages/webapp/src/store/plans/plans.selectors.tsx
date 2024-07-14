// @ts-nocheck
import { createSelector } from 'reselect';

const plansSelector = (state) => state.plans.plans;
const planSelector = (state, props) =>
  state.plans.plans.find((plan) => plan.slug === props.planSlug);

const plansPeriodSelector = (state) => state.plans.plansPeriod;

// Retrieve manual jounral current page results.
export const getPlansSelector = () =>
  createSelector(plansSelector, (plans) => {
    return plans;
  });

// Retrieve plan details.
export const getPlanSelector = () =>
  createSelector(planSelector, (plan) => plan);

// Retrieves the plans period (monthly or annually).
export const getPlansPeriodSelector = () =>
  createSelector(plansPeriodSelector, (periods) => periods);
