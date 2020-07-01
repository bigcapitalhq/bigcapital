import { createSelector } from 'reselect';

const exchangeRateItemsSelector = state => state.exchangeRates.exchangeRates;

export const getExchangeRatesList = createSelector(
  exchangeRateItemsSelector,
  (exchangeRateItems) => {
    return Object.values(exchangeRateItems);
  },
)