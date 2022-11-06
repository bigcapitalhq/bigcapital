// @ts-nocheck
import t from '@/store/types';

export const setEstimatesTableState = (queries) => {
  return {
    type: t.ESTIMATES_TABLE_STATE_SET,
    payload: { queries },
  };
};

export const resetEstimatesTableState = () => {
  return {
    type: t.ESTIMATES_TABLE_STATE_RESET,
  };
}
