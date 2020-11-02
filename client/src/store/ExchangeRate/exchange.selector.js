import { createSelector } from 'reselect';
import {
  pickItemsFromIds,
  getItemById,
  paginationLocationQuery,
} from 'store/selectors';

const exchangeRateItemsSelector = (state) => state.exchangeRates.exchangeRates;
const exchangeRateIdPropSelector = (state, props) => props.exchangeRateId;
const exchangeRateTableQuery = (state) => state.exchangeRates.tableQuery;

const exchangeRatesCurrentViewSelector = (state, props) => {
  const viewId = state.exchangeRates.currentViewId;
  return state.exchangeRates.views?.[viewId];
};

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

export const getExchangeRatePaginationMetaFactory = () =>
  createSelector(exchangeRatesCurrentViewSelector, (exchangeRateView) => {
    return exchangeRateView?.paginationMeta || {};
  });

export const getExchangeRatesTableQueryFactory = () =>
  createSelector(
    paginationLocationQuery,
    exchangeRateTableQuery,
    (locationQuery, tableQuery) => {
      return {
        ...locationQuery,
        ...tableQuery,
      };
    },
  );
