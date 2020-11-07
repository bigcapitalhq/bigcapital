import { createSelector } from 'reselect';
import { pickItemsFromIds } from 'store/selectors';

const customersViewsSelector = state => state.customers.views;
const customersItemsSelector = state => state.customers.items;
const customersCurrentViewSelector = state => state.customers.currentViewId;

export const getCustomersItems = createSelector(
  customersViewsSelector,
  customersItemsSelector,
  customersCurrentViewSelector,
  (customersViews, customersItems, currentViewId) => {
    const customersView = customersViews[currentViewId || -1];

    return (typeof customersView === 'object') 
      ? pickItemsFromIds(customersItems, customersView.ids) || []
      : [];  
  },
);

export const getCustomersListFactory = () => createSelector(
  customersItemsSelector,
  (customersItems) => {
    return Object.values(customersItems);
  }
);