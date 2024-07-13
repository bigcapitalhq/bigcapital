import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { SubscriptionPlans } from '@/constants/subscriptionModels';

export enum SubscriptionPlansPeriod {
  Monthly = 'monthly',
  Annually = 'Annually',
}

interface StorePlansState {
  plans: any;
  plansPeriod: SubscriptionPlansPeriod;
}

export const SubscriptionPlansSlice = createSlice({
  name: 'plans',
  initialState: {
    plans: [],
    periods: [],
    plansPeriod: 'monthly',
  } as StorePlansState,
  reducers: {
    /**
     * Initialize the subscription plans.
     * @param {StorePlansState} state
     */
    initSubscriptionPlans: (state: StorePlansState) => {
      const plans = SubscriptionPlans;
      state.plans = plans;
    },

    /**
     * Changes the plans period (monthly or annually).
     * @param {StorePlansState} state
     * @param {PayloadAction<{ period: SubscriptionPlansPeriod }>} action
     */
    changePlansPeriod: (
      state: StorePlansState,
      action: PayloadAction<{ period: SubscriptionPlansPeriod }>,
    ) => {
      state.plansPeriod = action.payload.period;
    },
  },
});

export const { initSubscriptionPlans, changePlansPeriod } =
  SubscriptionPlansSlice.actions;
