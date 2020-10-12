import { createReducer } from '@reduxjs/toolkit';
import t from 'store/types';

const initialState = {
  data: {},
  byOrganizationId: {},
};

const reducer = createReducer(initialState, {

  [t.ORGANIZATIONS_LIST_SET]: (state, action) => {
    const { organizations } = action.payload;
    const _data = {};
    const _dataByOrganizationId = {};

    organizations.forEach((organization) => {
      _data[organization.id] = organization;
      _dataByOrganizationId[organization.organization_id] = organization.id;
    });
    state.data = _data;
    state.byOrganizationId = _dataByOrganizationId;
  },

  [t.SET_ORGANIZATION_SEEDING]: (state, action) => {
    const { organizationId } = action.payload;

    state.data[organizationId] = {
      ...(state.data[organizationId] || {}),
      is_seeding: true,
    };
  },

  [t.SET_ORGANIZATION_SEEDED]: (state, action) => {
    const { organizationId } = action.payload;

    state.data[organizationId] = {
      ...(state.data[organizationId] || {}),
      is_seeding: false,
      seeded_at: new Date().toISOString(),
    };
  },

  [t.SET_ORGANIZATION_INITIALIZING]: (state, action) => {
    const { organizationId } = action.payload;

    state.data[organizationId] = {
      ...(state.data[organizationId] || {}),
      is_initializing: true,
    };
  },

  [t.SET_ORGANIZATION_INITIALIZED]: (state, action) => {
    const { organizationId } = action.payload;

    state.data[organizationId] = {
      ...(state.data[organizationId] || {}),
      is_initializing: false,
      initialized_at: new Date().toISOString(),
    };
  },
})

export default reducer;