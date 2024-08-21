// @ts-nocheck
import AccountsAlerts from '@/containers/Accounts/AccountsAlerts';
import ItemsAlerts from '@/containers/Items/ItemsAlerts';
import ItemsCategoriesAlerts from '@/containers/ItemsCategories/ItemsCategoriesAlerts';
import InventoryAdjustmentsAlerts from '@/containers/InventoryAdjustments/InventoryAdjustmentsAlerts';
import EstimatesAlerts from '@/containers/Sales/Estimates/EstimatesAlerts';
import InvoicesAlerts from '@/containers/Sales/Invoices/InvoicesAlerts';
import ReceiptsAlerts from '@/containers/Sales/Receipts/ReceiptsAlerts';
import PaymentsReceivedAlerts from '@/containers/Sales/PaymentsReceived/PaymentsReceivedAlerts';
import BillsAlerts from '@/containers/Purchases/Bills/BillsLanding/BillsAlerts';
import PaymentsMadeAlerts from '@/containers/Purchases/PaymentsMade/PaymentsMadeAlerts';
import CustomersAlerts from '@/containers/Customers/CustomersAlerts';
import VendorsAlerts from '@/containers/Vendors/VendorsAlerts';
import ManualJournalsAlerts from '@/containers/Accounting/JournalsLanding/ManualJournalsAlerts';
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
import TaxRatesAlerts from '@/containers/TaxRates/alerts';
import { CashflowAlerts } from '../CashFlow/CashflowAlerts';
import { BankRulesAlerts } from '../Banking/Rules/RulesList/BankRulesAlerts';
import { SubscriptionAlerts } from '../Subscriptions/alerts/alerts';
import { BankAccountAlerts } from '@/containers/CashFlow/AccountTransactions/alerts';

export default [
  ...AccountsAlerts,
  ...ItemsAlerts,
  ...ItemsCategoriesAlerts,
  ...InventoryAdjustmentsAlerts,
  ...EstimatesAlerts,
  ...InvoicesAlerts,
  ...ReceiptsAlerts,
  ...PaymentsReceivedAlerts,
  ...BillsAlerts,
  ...PaymentsMadeAlerts,
  ...CustomersAlerts,
  ...VendorsAlerts,
  ...ManualJournalsAlerts,
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
  ...TaxRatesAlerts,
  ...CashflowAlerts,
  ...BankRulesAlerts,
  ...SubscriptionAlerts,
  ...BankAccountAlerts,
];
