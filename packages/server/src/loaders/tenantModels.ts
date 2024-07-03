import { mapValues } from 'lodash';

import Account from 'models/Account';
import AccountTransaction from 'models/AccountTransaction';
import Item from 'models/Item';
import ItemEntry from 'models/ItemEntry';
import ItemCategory from 'models/ItemCategory';
import Bill from 'models/Bill';
import BillPayment from 'models/BillPayment';
import BillPaymentEntry from 'models/BillPaymentEntry';
import Currency from 'models/Currency';
import Contact from 'models/Contact';
import Vendor from 'models/Vendor';
import Customer from 'models/Customer';
import ExchangeRate from 'models/ExchangeRate';
import Expense from 'models/Expense';
import ExpenseCategory from 'models/ExpenseCategory';
import View from 'models/View';
import ViewRole from 'models/ViewRole';
import ViewColumn from 'models/ViewColumn';
import Setting from 'models/Setting';
import SaleInvoice from 'models/SaleInvoice';
import SaleInvoiceEntry from 'models/SaleInvoiceEntry';
import SaleReceipt from 'models/SaleReceipt';
import SaleReceiptEntry from 'models/SaleReceiptEntry';
import SaleEstimate from 'models/SaleEstimate';
import SaleEstimateEntry from 'models/SaleEstimateEntry';
import PaymentReceive from 'models/PaymentReceive';
import PaymentReceiveEntry from 'models/PaymentReceiveEntry';
import Option from 'models/Option';
import InventoryCostLotTracker from 'models/InventoryCostLotTracker';
import InventoryTransaction from 'models/InventoryTransaction';
import ManualJournal from 'models/ManualJournal';
import ManualJournalEntry from 'models/ManualJournalEntry';
import Media from 'models/Media';
import MediaLink from 'models/MediaLink';
import InventoryAdjustment from 'models/InventoryAdjustment';
import InventoryAdjustmentEntry from 'models/InventoryAdjustmentEntry';
import BillLandedCost from 'models/BillLandedCost';
import BillLandedCostEntry from 'models/BillLandedCostEntry';
import CashflowAccount from 'models/CashflowAccount';
import CashflowTransaction from 'models/CashflowTransaction';
import CashflowTransactionLine from 'models/CashflowTransactionLine';
import Role from 'models/Role';
import RolePermission from 'models/RolePermission';
import User from 'models/User';
import CreditNote from 'models/CreditNote';
import VendorCredit from 'models/VendorCredit';
import RefundCreditNote from 'models/RefundCreditNote';
import RefundVendorCredit from 'models/RefundVendorCredit';
import CreditNoteAppliedInvoice from 'models/CreditNoteAppliedInvoice';
import VendorCreditAppliedBill from 'models/VendorCreditAppliedBill';
import Branch from 'models/Branch';
import Warehouse from 'models/Warehouse';
import WarehouseTransfer from 'models/WarehouseTransfer';
import WarehouseTransferEntry from 'models/WarehouseTransferEntry';
import ItemWarehouseQuantity from 'models/ItemWarehouseQuantity';
import Project from 'models/Project';
import Time from 'models/Time';
import Task from 'models/Task';
import TaxRate from 'models/TaxRate';
import TaxRateTransaction from 'models/TaxRateTransaction';
import PlaidItem from 'models/PlaidItem';
import UncategorizedCashflowTransaction from 'models/UncategorizedCashflowTransaction';
import Document from '@/models/Document';
import DocumentLink from '@/models/DocumentLink';
import { BankRule } from '@/models/BankRule';
import { BankRuleCondition } from '@/models/BankRuleCondition';
import { RecognizedBankTransaction } from '@/models/RecognizedBankTransaction';
import { MatchedBankTransaction } from '@/models/MatchedBankTransaction';

export default (knex) => {
  const models = {
    Option,
    Account,
    AccountTransaction,
    Item,
    ItemCategory,
    ItemEntry,
    ManualJournal,
    ManualJournalEntry,
    Bill,
    BillPayment,
    BillPaymentEntry,
    Currency,
    ExchangeRate,
    Expense,
    ExpenseCategory,
    View,
    ViewRole,
    ViewColumn,
    Setting,
    SaleInvoice,
    SaleInvoiceEntry,
    SaleReceipt,
    SaleReceiptEntry,
    SaleEstimate,
    SaleEstimateEntry,
    PaymentReceive,
    PaymentReceiveEntry,
    InventoryTransaction,
    InventoryCostLotTracker,
    Media,
    MediaLink,
    Vendor,
    Customer,
    Contact,
    InventoryAdjustment,
    InventoryAdjustmentEntry,
    BillLandedCost,
    BillLandedCostEntry,
    CashflowTransaction,
    CashflowTransactionLine,
    CashflowAccount,
    Role,
    RolePermission,
    User,
    VendorCredit,
    CreditNote,
    RefundCreditNote,
    RefundVendorCredit,
    CreditNoteAppliedInvoice,
    VendorCreditAppliedBill,
    Branch,
    Warehouse,
    WarehouseTransfer,
    WarehouseTransferEntry,
    ItemWarehouseQuantity,
    Project,
    Time,
    Task,
    TaxRate,
    TaxRateTransaction,
    Document,
    DocumentLink,
    PlaidItem,
    UncategorizedCashflowTransaction,
    BankRule,
    BankRuleCondition,
    RecognizedBankTransaction,
    MatchedBankTransaction,
  };
  return mapValues(models, (model) => model.bindKnex(knex));
};
