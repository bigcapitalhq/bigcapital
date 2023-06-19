// @ts-nocheck
import authentication from './authentication/authentication.types';
import accounts from './accounts/accounts.types';
import cashflowAccounts from './CashflowAccounts/CashflowAccounts.types';
import accounting from './manualJournals/manualJournals.types';
import currencies from './currencies/currencies.types';
import customFields from './customFields/customFields.types';
import customViews from './customViews/customViews.types';
import dashboard from './dashboard/dashboard.types';
import expenses from './expenses/expenses.types';
import items from './items/items.types';
import preferences from './preferences/preferences.types';
import users from './users/users.types';
import financialStatements from './financialStatement/financialStatements.types';
import itemCategories from './itemCategories/itemsCategory.type';
import settings from './settings/settings.type';
import search from './search/search.type';
import register from './registers/register.type';
import exchangeRate from './ExchangeRate/exchange.type';
import customer from './customers/customers.type';
import estimates from './Estimate/estimates.types';
import invoices from './Invoice/invoices.types';
import receipts from './receipts/receipts.type';
import bills from './Bills/bills.type';
import vendors from './vendors/vendors.types';
import paymentReceives from './PaymentReceives/paymentReceives.type';
import paymentsMade from './PaymentsMade/paymentsMade.type';
import organizations from './organizations/organizations.types';
import subscription from './subscription/subscription.types';
import inventoryAdjustments from './inventoryAdjustments/inventoryAdjustment.type';
import creditNote from './CreditNote/creditNote.type';
import vendorCredit from './VendorCredit/vendorCredit.type';
import WarehouseTransfer from './WarehouseTransfer/warehouseTransfer.type';
import projects from './Project/projects.type'
import plans from './plans/plans.types';

export default {
  ...authentication,
  ...accounts,
  ...cashflowAccounts,
  ...currencies,
  ...customFields,
  ...customViews,
  ...dashboard,
  ...expenses,
  ...items,
  ...preferences,
  ...users,
  ...financialStatements,
  ...itemCategories,
  ...settings,
  ...accounting,
  ...search,
  ...register,
  ...exchangeRate,
  ...customer,
  ...vendors,
  ...estimates,
  ...invoices,
  ...receipts,
  ...bills,
  ...paymentReceives,
  ...paymentsMade,
  ...organizations,
  ...subscription,
  ...inventoryAdjustments,
  ...plans,
  ...creditNote,
  ...vendorCredit,
  ...WarehouseTransfer,
  ...projects
};
