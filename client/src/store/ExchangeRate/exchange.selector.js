import { createSelector } from 'reselect';
import { pickItemsFromIds, getItemById } from 'store/selectors';

const exchangeRateItemsSelector = (state) => state.exchangeRates.exchangeRates;
const exchangeRateIdPropSelector = (state, props) => props.exchangeRateId;

export const getExchangeRatesList = createSelector(
  exchangeRateItemsSelector,
  (exchangeRateItems) => {
    return Object.values(exchangeRateItems);
  },
);

export const getExchangeRateById = createSelector(
  exchangeRateItemsSelector,
  exchangeRateIdPropSelector,
  (exchangeRates, exchangeRateId) => {
    return getItemById(exchangeRates, exchangeRateId);
  },
);
