import t from 'store/types';
import { createReducer } from '@reduxjs/toolkit';

const initialState = {
  manualJournals: {},
};

export default createReducer(initialState, {
  
  [t.MANUAL_JOURNAL_SET]: (state, action) => {
    const { id, manualJournal } = action.payload;
    state.manualJournals[id] = manualJournal;
  },
});


export const getManualJournal = (state, id) => {
  return state.accounting.manualJournals[id];
}