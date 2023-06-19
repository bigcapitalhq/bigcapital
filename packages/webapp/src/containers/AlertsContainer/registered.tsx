// @ts-nocheck
import AccountsAlerts from '@/containers/Accounts/AccountsAlerts';
import ItemsAlerts from '@/containers/Items/ItemsAlerts';
import ItemsCategoriesAlerts from '@/containers/ItemsCategories/ItemsCategoriesAlerts';
import InventoryAdjustmentsAlerts from '@/containers/InventoryAdjustments/InventoryAdjustmentsAlerts';
import EstimatesAlerts from '@/containers/Sales/Estimates/EstimatesAlerts';
import InvoicesAlerts from '@/containers/Sales/Invoices/InvoicesAlerts';
import ReceiptsAlerts from '@/containers/Sales/Receipts/ReceiptsAlerts';
import PaymentReceiveAlerts from '@/containers/Sales/PaymentReceives/PaymentReceiveAlerts';
import BillsAlerts from '@/containers/Purchases/Bills/BillsLanding/BillsAlerts';
import PaymentsMadeAlerts from '@/containers/Purchases/PaymentsMade/PaymentsMadeAlerts';
import CustomersAlerts from '@/containers/Customers/CustomersAlerts';
import VendorsAlerts from '@/containers/Vendors/VendorsAlerts';
import ManualJournalsAlerts from '@/containers/Accounting/JournalsLanding/ManualJournalsAlerts';
import ExchangeRatesAlerts from '@/containers/ExchangeRates/ExchangeRatesAlerts';
import ExpensesAlerts from '@/containers/Expenses/ExpensesAlerts';
import AccountTransactionsAlerts from '@/containers/CashFlow/AccountTransactions/AccountTransactionsAlerts';
import UsersAlerts from '@/containers/Preferences/Users/UsersAlerts';
import CurrenciesAlerts from '@/containers/Preferences/Currencies/CurrenciesAlerts';
import RolesAlerts from '@/containers/Preferences/Users/Roles/RolesAlerts';
import CreditNotesAlerts from '@/containers/Sales/CreditNotes/CreditNotesAlerts';
import VendorCreditNotesAlerts from '@/containers/Purchases/CreditNotes/VendorCreditNotesAlerts';
import TransactionsLockingAlerts from '@/containers/TransactionsLocking/TransactionsLockingAlerts';
import WarehousesAlerts from '@/containers/Preferences/Warehouses/WarehousesAlerts';
import WarehousesTransfersAlerts from '@/containers/WarehouseTransfers/WarehousesTransfersAlerts';
import BranchesAlerts from '@/containers/Preferences/Branches/BranchesAlerts';
import ProjectAlerts from '@/containers/Projects/containers/ProjectAlerts';

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
  ...PaymentsMadeAlerts,
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
  ...ProjectAlerts,
];
