// @ts-nocheck
import t from '@/store/types';

export const setManualJournalsTableState = (queries) => {
  return {
    type: t.MANUAL_JOURNALS_TABLE_STATE_SET,
    payload: { queries },
  };
};
