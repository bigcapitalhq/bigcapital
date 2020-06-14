import { pickItemsFromIds } from 'store/selectors';

export const getCustomersItems = (state, viewId) => {
  const customersView = state.customers.views[viewId || -1];
  const customersItems = state.customers.items;

  return typeof customersView === 'object'
    ? pickItemsFromIds(customersItems, customersView.ids) || []
    : [];
};
