// @ts-nocheck
import { createDeepEqualSelector } from '@/utils';
import { paginationLocationQuery } from '@/store/selectors';

const exchangeRateTableState = (state) => {
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
