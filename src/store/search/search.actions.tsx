// @ts-nocheck
import t from '@/store/types';

export function openSearch(result) {
  return {
    type: t.OPEN_SEARCH,
    result,
  };
}

export function closeSearch(result) {
  return {
    type: t.ClOSE_SEARCH,
    result,
  };
}

export function generalSearch(name, result) {
  return {
    type: t.SEARCH_SUCCESS,
    result,
  };
}

export function universalSearchSetResourceType(resourceType) {
  return {
    type: t.UNIVERSAL_SEARCH_SET_RESOURCE_TYPE,
    payload: {
      resourceType,
    },
  };
}

export function universalSearchResetResourceType() {
  return {
    type: t.UNIVERSAL_SEARCH_RESET_RESOURCE_TYPE,
  };
}


export function universalSearchSetSelectedItem(resourceType, resourceId) {
  return {
    type: t.UNIVERSAL_SEARCH_SET_ITEM_SELECT,
    payload: {
      resourceType,
      resourceId
    }
  };
}

export function universalSearchResetSelectedItem() {
  return {
    type: t.UNIVERSAL_SEARCH_RESET_ITEM_SELECT,
    payload: {}
  };
}