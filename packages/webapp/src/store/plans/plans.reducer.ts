import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export enum SubscriptionPlansPeriod {
  Monthly = 'monthly',
  Annually = 'Annually',
}

interface StorePlansState {
  plansPeriod: SubscriptionPlansPeriod;
}

export const SubscriptionPlansSlice = createSlice({
  name: 'plans',
  initialState: {
    plansPeriod: SubscriptionPlansPeriod.Monthly,
  } as StorePlansState,
  reducers: {
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

export const { changePlansPeriod } = SubscriptionPlansSlice.actions;
