import { createDeepEqualSelector } from '@/utils';
import { paginationLocationQuery } from '@/store/selectors';
import type { RootState } from '@/store/reducers';

const exchangeRateTableState = (state: RootState) => {
  return state.exchangeRates.tableState;
};

export const getExchangeRatesTableStateFactory = () =>
  createDeepEqualSelector(
    paginationLocationQuery,
    exchangeRateTableState,
    (locationQuery, tableState) => {
      return {
        ...locationQuery,
        ...tableState,
      };
    },
  );
