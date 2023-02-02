// @ts-nocheck
import t from '@/store/types';
import { createReducer } from '@reduxjs/toolkit';

const DEFAULT_RESOURCE_TYPE = 'customer';

const initialState = {
  isOpen: false,
  defaultResourceType: DEFAULT_RESOURCE_TYPE,
  selectedItem: {},
};

export default createReducer(initialState, {
  [t.OPEN_SEARCH]: (state, action) => {
    state.isOpen = true;
  },

  [t.CLOSE_SEARCH]: (state, action) => {
    state.isOpen = false;
  },

  [t.UNIVERSAL_SEARCH_SET_RESOURCE_TYPE]: (state, action) => {
    state.defaultResourceType = action.payload.resourceType;
  },

  [t.UNIVERSAL_SEARCH_RESET_RESOURCE_TYPE]: (state, action) => {
    state.defaultResourceType = DEFAULT_RESOURCE_TYPE;
  },

  [t.UNIVERSAL_SEARCH_SET_ITEM_SELECT]: (state, action) => {
    state.selectedItem = {
      resourceId: action.payload.resourceId,
      resourceType: action.payload.resourceType,
    };
  },

  [t.UNIVERSAL_SEARCH_RESET_ITEM_SELECT]: (state, action) => {
    state.selectedItem = {};
  },
});
