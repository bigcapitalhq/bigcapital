import { combineReducers } from 'redux';

import authentication from './authentication/authentication.reducer';
import dashboard from './dashboard/dashboard.reducer';
import users from './users/users.reducer';
import accounts from './accounts/accounts.reducer';
import fields from './customFields/customFields.reducer';
import items from './items/items.reducer';
import views from './customViews/customViews.reducer';
import expenses from './expenses/expenses.reducer';
import currencies from './currencies/currencies.reducer';
import resources from './resources/resources.reducer';
import financialStatements from './financialStatement/financialStatements.reducer';
import itemCategories from './itemCategories/itemsCategory.reducer';

export default combineReducers({
  authentication,
  dashboard,
  users,
  accounts,
  fields,
  views,
  expenses,
  currencies,
  resources,
  financialStatements,
  items,
  itemCategories
});
