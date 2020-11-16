import { createSelector } from 'reselect';
import {
  pickItemsFromIds,
  paginationLocationQuery,
  defaultPaginationMeta,
} from 'store/selectors';

const customerTableQuery = (state) => state.customers.tableQuery;

const customersByIdSelector = (state, props) => {
  return state.customers.items[props.customerId];
};

const customersPaginationSelector = (state, props) => {
  const viewId = state.customers.currentViewId;
  return state.customers.views?.[viewId];
};

const customerPageSelector = (state, props) => {
  const viewId = state.customers.currentViewId;
  const currentView = state.customers.views?.[viewId];
  const currentPageId = currentView?.paginationMeta?.page;

  return currentView?.pages?.[currentPageId];
};

const customersItemsSelector = (state) => state.customers.items;

export const getCustomerTableQueryFactory = () =>
  createSelector(
    paginationLocationQuery,
    customerTableQuery,
    (locationQuery, tableQuery) => {
      return {
        ...locationQuery,
        ...tableQuery,
      };
    },
  );

export const getCustomerCurrentPageFactory = () =>
  createSelector(
    customerPageSelector,
    customersItemsSelector,
    (customerPage, customersItems) => {
      return typeof customerPage === 'object'
        ? pickItemsFromIds(customersItems, customerPage.ids) || []
        : [];
    },
  );

export const getCustomersByIdFactory = () =>
  createSelector(customersByIdSelector, (customer) => {
    return customer;
  });

export const getCustomerPaginationMetaFactory = () =>
  createSelector(customersPaginationSelector, (customerPage) => {
    return {
      ...defaultPaginationMeta(),
      ...(customerPage?.paginationMeta || {}),
    };
  });
