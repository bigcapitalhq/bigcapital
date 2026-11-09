import type { RootState } from '@/store/reducers';
import { paginationLocationQuery } from '@/store/selectors';
import { createDeepEqualSelector } from '@/utils';

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
