import { createSelector } from 'reselect';
import { getItemById } from '@/store/selectors';
import type { RootState } from '@/store/reducers';

const currenciesItemsSelector = (state: RootState) => state.currencies.data;
const currenciesCodePropSelector = (state: RootState, props: { currencyId: string }) => props.currencyId;

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

