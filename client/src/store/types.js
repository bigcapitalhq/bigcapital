import authentication from './authentication/authentication.types';
import accounts from './accounts/accounts.types';
import currencies from './currencies/currencies.types';
import customFields from './customFields/customFields.types';
import customViews from './customViews/customViews.types';
import dashboard from './dashboard/dashboard.types';
import expenses from './expenses/expenses.types';
import items from './items/items.types';
import preferences from './preferences/preferences.types';
import resources from './resources/resource.types';
import users from './users/users.types';
import financialStatements from './financialStatement/financialStatements.types';
import itemCategories from './itemCategories/itemsCategory.type';
export default {
  ...authentication,
  ...accounts,
  ...currencies,
  ...customFields,
  ...customViews,
  ...dashboard,
  ...expenses,
  ...items,
  ...preferences,
  ...resources,
  ...users,
  ...financialStatements,
  ...itemCategories
};
