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
import settings from './settings/settings.reducer';
import manualJournals from './manualJournals/manualJournals.reducers';
import globalSearch from './search/search.reducer';
import exchangeRates from './ExchangeRate/exchange.reducer';
import globalErrors from './globalErrors/globalErrors.reducer';
import customers from './customers/customers.reducer';
import salesEstimates from './Estimate/estimates.reducer';
import salesInvoices from './Invoice/invoices.reducer';
import salesReceipts from './receipt/receipt.reducer';
import bills from './Bills/bills.reducer';
import vendors from './vendors/vendors.reducer';
import paymentReceives from './PaymentReceive/paymentReceive.reducer';
import paymentMades from './PaymentMades/paymentMade.reducer';
import organizations from './organizations/organizations.reducers';

export default combineReducers({
  authentication,
  organizations,
  dashboard,
  users,
  accounts,
  manualJournals,
  fields,
  views,
  expenses,
  currencies,
  resources,
  financialStatements,
  items,
  itemCategories,
  settings,
  globalSearch,
  exchangeRates,
  globalErrors,
  customers,

  salesEstimates,
  salesInvoices,
  salesReceipts,
  bills,
  vendors,
  paymentReceives,
  paymentMades
});
