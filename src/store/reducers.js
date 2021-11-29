import { combineReducers } from 'redux';

import types from './types';

import authentication from './authentication/authentication.reducer';
import dashboard from './dashboard/dashboard.reducer';
import users from './users/users.reducer';
import accounts from './accounts/accounts.reducer';
import cashflowAccounts from './CashflowAccounts/CashflowAccounts.reducer';
import fields from './customFields/customFields.reducer';
import items from './items/items.reducer';
import views from './customViews/customViews.reducer';
import expenses from './expenses/expenses.reducer';
import currencies from './currencies/currencies.reducer';
import resources from './resources/resources.reducer';
import financialStatements from './financialStatement/financialStatements.reducer';
import itemsCategories from './itemCategories/itemsCategory.reducer';
import settings from './settings/settings.reducer';
import manualJournals from './manualJournals/manualJournals.reducers';
import globalSearch from './search/search.reducer';
import exchangeRates from './ExchangeRate/exchange.reducer';
import globalErrors from './globalErrors/globalErrors.reducer';
import customers from './customers/customers.reducer';
import salesEstimates from './Estimate/estimates.reducer';
import salesInvoices from './Invoice/invoices.reducer';
import salesReceipts from './receipts/receipts.reducer';
import bills from './Bills/bills.reducer';
import vendors from './vendors/vendors.reducer';
import paymentReceives from './PaymentReceives/paymentReceives.reducer';
import paymentMades from './PaymentMades/paymentMades.reducer';
import organizations from './organizations/organizations.reducers';
import subscriptions from './subscription/subscription.reducer';
import inventoryAdjustments from './inventoryAdjustments/inventoryAdjustment.reducer';
import creditNotes from './CreditNotes/creditNotes.reducer'
import vendorsCreditNotes from './vendorsCreditNotes/vendorsCreditNotes.reducer'
import plans from './plans/plans.reducer';

const appReducer = combineReducers({
  authentication,
  organizations,
  subscriptions,
  dashboard,
  users,
  accounts,
  cashflowAccounts,
  manualJournals,
  fields,
  views,
  expenses,
  currencies,
  resources,
  financialStatements,
  items,
  itemsCategories,
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
  paymentMades,
  inventoryAdjustments,
  creditNotes,
  vendorsCreditNotes,
  plans
});

// Reset the state of a redux store
const rootReducer = (state, action) => {
  if (action.type === types.RESET) {
    state = undefined;
  }
  return appReducer(state, action)
}

export default rootReducer;