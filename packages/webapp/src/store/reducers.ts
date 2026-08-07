import { AnyAction, combineReducers } from 'redux';
import { accountsPersistReducer as accounts } from './accounts/accounts.reducer';
import { authenticationPersistReducer as authentication } from './authentication/authentication.reducer';
import { PlaidSlice } from './banking/banking.reducer';
import { billsPersistReducer as bills } from './bills/bills.reducer';
import { cashflowAccountsPersistReducer as cashflowAccounts } from './cashflow-accounts/cashflow-accounts.reducer';
import { creditNotesPersistReducer as creditNotes } from './credit-note/credit-note.reducer';
import { customFieldsReducer as fields } from './custom-fields/custom-fields.reducer';
import { customViewsReducer as views } from './custom-views/custom-views.reducer';
import { customersPersistReducer as customers } from './customers/customers.reducer';
import { dashboardPersistReducer as dashboard } from './dashboard/dashboard.reducer';
import { salesEstimatesPersistReducer as salesEstimates } from './estimate/estimates.reducer';
import { exchangeRatesReducer as exchangeRates } from './exchange-rate/exchange.reducer';
import { expensesPersistReducer as expenses } from './expenses/expenses.reducer';
import { financialStatementsReducer as financialStatements } from './financial-statement/financial-statements.reducer';
import { globalErrorsReducer as globalErrors } from './global-errors/global-errors.reducer';
import { inventoryAdjustmentsPersistReducer as inventoryAdjustments } from './inventory-adjustments/inventory-adjustment.reducer';
import { salesInvoicesPersistReducer as salesInvoices } from './invoice/invoices.reducer';
import { itemsCategoriesPersistReducer as itemsCategories } from './item-categories/items-category.reducer';
import { itemsPersistReducer as items } from './items/items.reducer';
import { manualJournalsPersistReducer as manualJournals } from './manual-journals/manual-journals.reducers';
import { organizationsReducer as organizations } from './organizations/organizations.reducers';
import { paymentMadesPersistReducer as paymentMades } from './payment-mades/payment-mades.reducer';
import { paymentReceivesPersistReducer as paymentReceives } from './payment-receives/payment-receives.reducer';
import { SubscriptionPlansSlice } from './plans/plans.reducer';
import { projectsPersistReducer as projects } from './project/projects.reducer';
import { salesReceiptsPersistReducer as salesReceipts } from './receipts/receipts.reducer';
import { resourcesReducer as resources } from './resources/resources.reducer';
import { searchReducer as globalSearch } from './search/search.reducer';
import { RESET } from './types';
import { usersReducer as users } from './users/users.reducer';
import { vendorCreditPersistReducer as vendorCredit } from './vendor-credit/vendor-credit.reducer';
import { vendorsPersistReducer as vendors } from './vendors/vendors.reducer';
import { warehouseTransfersPersistReducer as warehouseTransfers } from './warehouse-transfer/warehouse-transfer.reducer';

const appReducer = combineReducers({
  authentication,
  organizations,
  dashboard,
  users,
  accounts,
  cashflowAccounts,
  manualJournals,
  fields,
  views,
  expenses,
  resources,
  financialStatements,
  items,
  itemsCategories,
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
  plans: SubscriptionPlansSlice.reducer,
  creditNotes,
  vendorCredit,
  warehouseTransfers,
  projects,
  plaid: PlaidSlice.reducer,
});

export type RootState = ReturnType<typeof appReducer>;
export type ApplicationState = RootState;

const rootReducer = (
  state: RootState | undefined,
  action: AnyAction,
): RootState => {
  if (action.type === RESET) {
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
