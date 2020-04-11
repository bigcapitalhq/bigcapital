import t from 'store/types';

export function generalSearch(name, result) {
  return {
    type: t.SEARCH_SUCCESS,
    result,
  };
}
