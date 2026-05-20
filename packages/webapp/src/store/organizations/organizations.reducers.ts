import { createReducer } from '@reduxjs/toolkit';
import { omit } from 'lodash';
import { ORGANIZATIONS_LIST_SET, SET_ORGANIZATION_CONGRATS } from '@/store/types';;

interface OrganizationsState {
  data: Record<string, unknown>;
  byOrganizationId: Record<string, unknown>;
}

const initialState: OrganizationsState = {
  data: {},
  byOrganizationId: {},
};

type OrganizationsListAction = {
  payload: { organizations: Array<Record<string, unknown>> };
};

type OrganizationCongratsAction = {
  payload: { tenantId: string; congrats: boolean };
};

const reducer = createReducer(initialState, {
  [ORGANIZATIONS_LIST_SET]: (state, action: OrganizationsListAction) => {
    const { organizations } = action.payload;
    const _data: Record<string, unknown> = {};
    const _dataByOrganizationId: Record<string, unknown> = {};

    organizations.forEach((organization) => {
      const id = organization['id'] as string;
      const orgId = organization['organization_id'] as string;
      _data[id] = {
        ...(state.data[id] as Record<string, unknown>),
        ...(organization['metadata'] as Record<string, unknown>),
        ...omit(organization, ['metadata']),
      };
      _dataByOrganizationId[orgId] = id;
    });
    state.data = _data;
    state.byOrganizationId = _dataByOrganizationId;
  },

  [SET_ORGANIZATION_CONGRATS]: (state, action: OrganizationCongratsAction) => {
    const { tenantId, congrats } = action.payload;

    state.data[tenantId] = {
      ...(state.data[tenantId] as Record<string, unknown> || {}),
      is_congrats: !!congrats,
    };
  },
});

export const organizationsReducer = reducer;