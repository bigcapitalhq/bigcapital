import { EXCHANGE_RATES_TABLE_STATE_SET } from '@/store/types';

export const setExchangeRateTableState = (queries: {
  pageSize?: number;
  pageIndex?: number;
}) => {
  return {
    type: EXCHANGE_RATES_TABLE_STATE_SET,
    payload: { queries },
  };
};
