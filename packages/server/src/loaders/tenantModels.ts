import { mapValues } from 'lodash';

import Account from '../models/Account';
import AccountTransaction from '../models/AccountTransaction';
import Attachment from '../models/Attachment';
import Bill from '../models/Bill';
import BillLandedCost from '../models/BillLandedCost';
import BillLandedCostEntry from '../models/BillLandedCostEntry';
import BillPayment from '../models/BillPayment';
import BillPaymentEntry from '../models/BillPaymentEntry';
import Branch from '../models/Branch';
import CashflowAccount from '../models/CashflowAccount';
import CashflowTransaction from '../models/CashflowTransaction';
import CashflowTransactionLine from '../models/CashflowTransactionLine';
import Contact from '../models/Contact';
import CreditNote from '../models/CreditNote';
import CreditNoteAppliedInvoice from '../models/CreditNoteAppliedInvoice';
import Currency from '../models/Currency';
import Customer from '../models/Customer';
import ExchangeRate from '../models/ExchangeRate';
import Expense from '../models/Expense';
import ExpenseCategory from '../models/ExpenseCategory';
import Import from '../models/Import';
import InventoryAdjustment from '../models/InventoryAdjustment';
import InventoryAdjustmentEntry from '../models/InventoryAdjustmentEntry';
import InventoryCostLotTracker from '../models/InventoryCostLotTracker';
import InventoryTransaction from '../models/InventoryTransaction';
import Item from '../models/Item';
import ItemCategory from '../models/ItemCategory';
import ItemEntry from '../models/ItemEntry';
import ItemWarehouseQuantity from '../models/ItemWarehouseQuantity';
import ManualJournal from '../models/ManualJournal';
import ManualJournalEntry from '../models/ManualJournalEntry';
import Media from '../models/Media';
import MediaLink from '../models/MediaLink';
import Option from '../models/Option';
import PaymentReceive from '../models/PaymentReceive';
import PaymentReceiveEntry from '../models/PaymentReceiveEntry';
import PlaidItem from '../models/PlaidItem';
import Project from '../models/Project';
import RefundCreditNote from '../models/RefundCreditNote';
import RefundVendorCredit from '../models/RefundVendorCredit';
import Role from '../models/Role';
import RolePermission from '../models/RolePermission';
import SaleEstimate from '../models/SaleEstimate';
import SaleEstimateEntry from '../models/SaleEstimateEntry';
import SaleInvoice from '../models/SaleInvoice';
import SaleInvoiceEntry from '../models/SaleInvoiceEntry';
import SaleReceipt from '../models/SaleReceipt';
import SaleReceiptEntry from '../models/SaleReceiptEntry';
import Setting from '../models/Setting';
import Task from '../models/Task';
import TaxRate from '../models/TaxRate';
import TaxRateTransaction from '../models/TaxRateTransaction';
import Time from '../models/Time';
import UncategorizedCashflowTransaction from '../models/UncategorizedCashflowTransaction';
import User from '../models/User';
import Vendor from '../models/Vendor';
import VendorCredit from '../models/VendorCredit';
import VendorCreditAppliedBill from '../models/VendorCreditAppliedBill';
import View from '../models/View';
import ViewColumn from '../models/ViewColumn';
import ViewRole from '../models/ViewRole';
import Warehouse from '../models/Warehouse';
import WarehouseTransfer from '../models/WarehouseTransfer';
import WarehouseTransferEntry from '../models/WarehouseTransferEntry';

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
    Attachment,
    Import,
    PlaidItem,
    UncategorizedCashflowTransaction,
  };
  return mapValues(models, (model) => model.bindKnex(knex));
};
