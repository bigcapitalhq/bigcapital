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
      _data[organization.id] = {
        ...state.data[organization.id],
        ...organization,
      };
      _dataByOrganizationId[organization.organization_id] = organization.id;
    });
    state.data = _data;
    state.byOrganizationId = _dataByOrganizationId;
  },

  [t.SET_ORGANIZATION_CONGRATS]: (state, action) => {
    const { organizationId, congrats } = action.payload;

    state.data[organizationId] = {
      ...(state.data[organizationId] || {}),
      is_congrats: !!congrats,
    };
  }
})

export default reducer;