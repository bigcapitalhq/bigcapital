// @flow
import { createSelector } from 'reselect';

const currenciesItemsSelector = state => state.currencies.data;

export const getCurrenciesList = createSelector(
  currenciesItemsSelector,
  (currencies) => {
    return Object.values(currencies);
  }
);

export const getCurrencyById = (currencies: Object, id: Integer) => {
  return Object.values(currencies).find(c => c.id == id) || null;
};

export const getCurrencyByCode = (currencies: Object, currencyCode: String) => {
  return currencies[currencyCode] || null;
};