// @ts-nocheck
// @flow
import { createSelector } from 'reselect';
import { getItemById } from '@/store/selectors';

const currenciesItemsSelector = (state) => state.currencies.data;
const currenciesCodePropSelector = (state, props) => props.currencyId;

export const getCurrenciesList = createSelector(
  currenciesItemsSelector,
  (currencies) => {
    return Object.values(currencies);
  },
);

export const getCurrencyByCode = createSelector(
  currenciesItemsSelector,
  currenciesCodePropSelector,
  (currencies, currencyCode) => {
    return getItemById(currencies, currencyCode);
  },
);

