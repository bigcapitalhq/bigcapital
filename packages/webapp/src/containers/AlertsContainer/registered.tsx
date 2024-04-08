
import AccountsAlerts from '@/containers/Accounts/AccountsAlerts';
import AccountTransactionsAlerts from '@/containers/CashFlow/AccountTransactions/AccountTransactionsAlerts';
import BillsAlerts from '@/containers/Purchases/Bills/BillsLanding/BillsAlerts';
import BranchesAlerts from '@/containers/Preferences/Branches/BranchesAlerts';
import CreditNotesAlerts from '@/containers/Sales/CreditNotes/CreditNotesAlerts';
import CurrenciesAlerts from '@/containers/Preferences/Currencies/CurrenciesAlerts';
import CustomersAlerts from '@/containers/Customers/CustomersAlerts';
import EstimatesAlerts from '@/containers/Sales/Estimates/EstimatesAlerts';
import ExpensesAlerts from '@/containers/Expenses/ExpensesAlerts';
import InventoryAdjustmentsAlerts from '@/containers/InventoryAdjustments/InventoryAdjustmentsAlerts';
import InvoicesAlerts from '@/containers/Sales/Invoices/InvoicesAlerts';
import ItemsAlerts from '@/containers/Items/ItemsAlerts';
import ItemsCategoriesAlerts from '@/containers/ItemsCategories/ItemsCategoriesAlerts';
import ManualJournalsAlerts from '@/containers/Accounting/JournalsLanding/ManualJournalsAlerts';
import PaymentMadesAlerts from '@/containers/Purchases/PaymentMades/PaymentMadesAlerts';
import PaymentReceiveAlerts from '@/containers/Sales/PaymentReceives/PaymentReceiveAlerts';
import ProjectAlerts from '@/containers/Projects/containers/ProjectAlerts';
import ReceiptsAlerts from '@/containers/Sales/Receipts/ReceiptsAlerts';
import RolesAlerts from '@/containers/Preferences/Users/Roles/RolesAlerts';
import TaxRatesAlerts from '@/containers/TaxRates/alerts';
import TransactionsLockingAlerts from '@/containers/TransactionsLocking/TransactionsLockingAlerts';
import UsersAlerts from '@/containers/Preferences/Users/UsersAlerts';
import VendorCreditNotesAlerts from '@/containers/Purchases/CreditNotes/VendorCreditNotesAlerts';
import VendorsAlerts from '@/containers/Vendors/VendorsAlerts';
import WarehousesAlerts from '@/containers/Preferences/Warehouses/WarehousesAlerts';
import WarehousesTransfersAlerts from '@/containers/WarehouseTransfers/WarehousesTransfersAlerts';
import { CashflowAlerts } from '../CashFlow/CashflowAlerts';

const registeredAlerts = [
  ...AccountsAlerts,
  ...AccountTransactionsAlerts,
  ...BillsAlerts,
  ...BranchesAlerts,
  ...CashflowAlerts,
  ...CreditNotesAlerts,
  ...CurrenciesAlerts,
  ...CustomersAlerts,
  ...EstimatesAlerts,
  ...ExpensesAlerts,
  ...InventoryAdjustmentsAlerts,
  ...InvoicesAlerts,
  ...ItemsAlerts,
  ...ItemsCategoriesAlerts,
  ...ManualJournalsAlerts,
  ...PaymentMadesAlerts,
  ...PaymentReceiveAlerts,
  ...ProjectAlerts,
  ...ReceiptsAlerts,
  ...RolesAlerts,
  ...TaxRatesAlerts,
  ...TransactionsLockingAlerts,
  ...UsersAlerts,
  ...VendorCreditNotesAlerts,
  ...VendorsAlerts,
  ...WarehousesAlerts,
  ...WarehousesTransfersAlerts,
];

export default registeredAlerts;
