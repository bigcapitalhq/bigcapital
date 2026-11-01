import {
  CLOSE_SEARCH,
  OPEN_SEARCH,
  UNIVERSAL_SEARCH_RESET_ITEM_SELECT,
  UNIVERSAL_SEARCH_RESET_RESOURCE_TYPE,
  UNIVERSAL_SEARCH_SET_ITEM_SELECT,
  UNIVERSAL_SEARCH_SET_RESOURCE_TYPE,
} from '@/store/types';

export function openSearch(result?: unknown) {
  return {
    type: OPEN_SEARCH,
    result,
  };
}

export function closeSearch(result?: unknown) {
  return {
    type: CLOSE_SEARCH,
    result,
  };
}

export function generalSearch(_name: string, result?: unknown) {
  return {
    type: 'SEARCH_SUCCESS',
    result,
  };
}

export function universalSearchSetResourceType(resourceType: string) {
  return {
    type: UNIVERSAL_SEARCH_SET_RESOURCE_TYPE,
    payload: {
      resourceType,
    },
  };
}

export function universalSearchResetResourceType() {
  return {
    type: UNIVERSAL_SEARCH_RESET_RESOURCE_TYPE,
  };
}

export function universalSearchSetSelectedItem(
  resourceType: string,
  resourceId: string | number,
) {
  return {
    type: UNIVERSAL_SEARCH_SET_ITEM_SELECT,
    payload: {
      resourceType,
      resourceId,
    },
  };
}

export function universalSearchResetSelectedItem() {
  return {
    type: UNIVERSAL_SEARCH_RESET_ITEM_SELECT,
    payload: {},
  };
}
