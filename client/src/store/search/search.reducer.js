import t from 'store/types';
import { createReducer } from '@reduxjs/toolkit';

const initialState = {
  searches: {},
  searchTitle: 'Title',
  isOpen: false,
};

export default createReducer(initialState, {
  [t.SEARCH_SUCCESS]: (state, action) => {
    const _result = {};

    action.searches.forEach((search) => {
      _result[search.id] = search;
    });

    state.searches = {
      ...state.searches,
      ..._result,
    };
  },
});

//  return state = action.result;
// if (typeof state === 'undefined') {
//   return initialState;
// }

// state.search[action.name] = {
//   isOpen: true,
//   payload: action.payload || {},
// };
