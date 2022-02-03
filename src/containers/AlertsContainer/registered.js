import AccountsAlerts from '../Accounts/AccountsAlerts';
import ItemsAlerts from '../Items/ItemsAlerts';
import ItemsCategoriesAlerts from '../ItemsCategories/ItemsCategoriesAlerts';
import InventoryAdjustmentsAlerts from '../InventoryAdjustments/InventoryAdjustmentsAlerts';
import EstimatesAlerts from '../Sales/Estimates/EstimatesAlerts';
import InvoicesAlerts from '../Sales/Invoices/InvoicesAlerts';
import ReceiptsAlerts from '../Sales/Receipts/ReceiptsAlerts';
import PaymentReceiveAlerts from '../Sales/PaymentReceives/PaymentReceiveAlerts';
import BillsAlerts from '../Purchases/Bills/BillsLanding/BillsAlerts';
import PaymentMadesAlerts from '../Purchases/PaymentMades/PaymentMadesAlerts';
import CustomersAlerts from '../Customers/CustomersAlerts';
import VendorsAlerts from '../Vendors/VendorsAlerts';
import ManualJournalsAlerts from '../Accounting/JournalsLanding/ManualJournalsAlerts';
import ExchangeRatesAlerts from '../ExchangeRates/ExchangeRatesAlerts';
import ExpensesAlerts from '../Expenses/ExpensesAlerts';
import AccountTransactionsAlerts from '../CashFlow/AccountTransactions/AccountTransactionsAlerts';
import UsersAlerts from '../Preferences/Users/UsersAlerts';
import CurrenciesAlerts from '../Preferences/Currencies/CurrenciesAlerts';
import RolesAlerts from '../Preferences/Users/Roles/RolesAlerts';
import CreditNotesAlerts from '../Sales/CreditNotes/CreditNotesAlerts';
import VendorCreditNotesAlerts from '../Purchases/CreditNotes/VendorCreditNotesAlerts';
import TransactionsLockingAlerts from '../TransactionsLocking/TransactionsLockingAlerts';
import WarehousesAlerts from '../Preferences/Warehouses/WarehousesAlerts';
import WarehousesTransfersAlerts from '../WarehouseTransfers/WarehousesTransfersAlerts'
import BranchesAlerts from '../Preferences/Branches/BranchesAlerts';

export default [
  ...AccountsAlerts,
  ...ItemsAlerts,
  ...ItemsCategoriesAlerts,
  ...InventoryAdjustmentsAlerts,
  ...EstimatesAlerts,
  ...InvoicesAlerts,
  ...ReceiptsAlerts,
  ...PaymentReceiveAlerts,
  ...BillsAlerts,
  ...PaymentMadesAlerts,
  ...CustomersAlerts,
  ...VendorsAlerts,
  ...ManualJournalsAlerts,
  ...ExchangeRatesAlerts,
  ...ExpensesAlerts,
  ...AccountTransactionsAlerts,
  ...UsersAlerts,
  ...CurrenciesAlerts,
  ...RolesAlerts,
  ...CreditNotesAlerts,
  ...VendorCreditNotesAlerts,
  ...TransactionsLockingAlerts,
  ...WarehousesAlerts,
  ...WarehousesTransfersAlerts,
  ...BranchesAlerts,
];
