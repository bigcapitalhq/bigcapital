import { CLOSE_SEARCH, OPEN_SEARCH, UNIVERSAL_SEARCH_RESET_ITEM_SELECT, UNIVERSAL_SEARCH_RESET_RESOURCE_TYPE, UNIVERSAL_SEARCH_SET_ITEM_SELECT, UNIVERSAL_SEARCH_SET_RESOURCE_TYPE } from '@/store/types';;
import { createReducer } from '@reduxjs/toolkit';

interface SearchState {
  isOpen: boolean;
  defaultResourceType: string;
  selectedItem: Record<string, unknown>;
}

const DEFAULT_RESOURCE_TYPE = 'customer';

const initialState: SearchState = {
  isOpen: false,
  defaultResourceType: DEFAULT_RESOURCE_TYPE,
  selectedItem: {},
};

type SearchResourceTypeAction = { payload: { resourceType: string } };
type SearchSelectedItemAction = { payload: { resourceId: string | number; resourceType: string } };

export const searchReducer = createReducer(initialState, {
  [OPEN_SEARCH]: (state) => {
    state.isOpen = true;
  },

  [CLOSE_SEARCH]: (state) => {
    state.isOpen = false;
  },

  [UNIVERSAL_SEARCH_SET_RESOURCE_TYPE]: (state, action: SearchResourceTypeAction) => {
    state.defaultResourceType = action.payload.resourceType;
  },

  [UNIVERSAL_SEARCH_RESET_RESOURCE_TYPE]: (state) => {
    state.defaultResourceType = DEFAULT_RESOURCE_TYPE;
  },

  [UNIVERSAL_SEARCH_SET_ITEM_SELECT]: (state, action: SearchSelectedItemAction) => {
    state.selectedItem = {
      resourceId: action.payload.resourceId,
      resourceType: action.payload.resourceType,
    };
  },

  [UNIVERSAL_SEARCH_RESET_ITEM_SELECT]: (state) => {
    state.selectedItem = {};
  },
});
