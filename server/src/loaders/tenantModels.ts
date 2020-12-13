import { mapValues } from 'lodash';

import Account from 'models/Account';
import AccountTransaction from 'models/AccountTransaction';
import AccountType from 'models/AccountType';
import Item from 'models/Item';
import ItemEntry from 'models/ItemEntry';
import ItemCategory from 'models/ItemCategory';
import Bill from 'models/Bill';
import BillPayment from 'models/BillPayment';
import BillPaymentEntry from 'models/BillPaymentEntry';
import Currency from 'models/Currency';
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
import Media from 'models/Media';
import MediaLink from 'models/MediaLink';

export default (knex) => {
  const models = {
    Option,
    Account,
    AccountTransaction,
    AccountType,
    Item,
    ItemCategory,
    ItemEntry,
    ManualJournal,
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
  };
  return mapValues(models, (model) => model.bindKnex(knex));
}