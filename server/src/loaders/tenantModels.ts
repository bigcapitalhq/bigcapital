import { mapValues } from 'lodash';

import Account from '@/models/Account';
import AccountBalance from '@/models/AccountBalance';
import AccountTransaction from '@/models/AccountTransaction';
import AccountType from '@/models/AccountType';
import Bill from '@/models/Bill';
import BillPayment from '@/models/BillPayment';
import BillPaymentEntry from '@/models/BillPaymentEntry';
import Currency from '@/models/Currency';
import Customer from '@/models/Customer';
import Vendor from '@/models/Vendor';
import ExchangeRate from '@/models/ExchangeRate';
import Expense from '@/models/Expense';
import ExpenseCategory from '@/models/ExpenseCategory';
import View from '@/models/View';
import ViewRole from '@/models/ViewRole';
import ViewColumn from '@/models/ViewColumn';
import Setting from '@/models/Setting';
import SaleInvoice from '@/models/SaleInvoice';
import SaleInvoiceEntry from '@/models/SaleInvoiceEntry';
import SaleReceipt from '@/models/SaleReceipt';
import SaleReceiptEntry from '@/models/SaleReceiptEntry';
import SaleEstimate from '@/models/SaleEstimate';
import SaleEstimateEntry from '@/models/SaleEstimateEntry';
import PaymentReceive from '@/models/PaymentReceive';
import PaymentReceiveEntry from '@/models/PaymentReceiveEntry';
import Option from '@/models/Option';
import Resource from '@/models/Resource';
import InventoryCostLotTracker from '@/models/InventoryCostLotTracker';
import InventoryTransaction from '@/models/InventoryTransaction';
import ResourceField from '@/models/ResourceField';
import ResourceFieldMetadata from '@/models/ResourceFieldMetadata';

export default (knex) => {
  const models = {
    Option,
    Account,
    AccountBalance,
    AccountTransaction,
    AccountType,
    Bill,
    BillPayment,
    BillPaymentEntry,
    Currency,
    Customer,
    Vendor,
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
    Resource,
    InventoryTransaction,
    InventoryCostLotTracker,
    ResourceField,
    ResourceFieldMetadata,
  };
  return mapValues(models, (model) => model.bindKnex(knex));
}