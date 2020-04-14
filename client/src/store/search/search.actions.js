import t from 'store/types';

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
