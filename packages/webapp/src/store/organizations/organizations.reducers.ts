import { createReducer } from '@reduxjs/toolkit';
import { SET_ORGANIZATION_CONGRATS } from '@/store/types';

interface OrganizationsState {
  congrats: Record<string, boolean>;
}

const initialState: OrganizationsState = {
  congrats: {},
};

type OrganizationCongratsAction = {
  payload: { organizationId: string; congrats: boolean };
};

const reducer = createReducer(initialState, {
  [SET_ORGANIZATION_CONGRATS]: (state, action: OrganizationCongratsAction) => {
    const { organizationId, congrats } = action.payload;
    state.congrats[organizationId] = congrats;
  },
});

export const organizationsReducer = reducer;
