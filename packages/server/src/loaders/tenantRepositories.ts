import AccountRepository from '@/repositories/AccountRepository';
import AccountTransactionsRepository from '@/repositories/AccountTransactionRepository';
import BillRepository from '@/repositories/BillRepository';
import ContactRepository from '@/repositories/ContactRepository';
import CustomerRepository from '@/repositories/CustomerRepository';
import ExpenseEntryRepository from '@/repositories/ExpenseEntryRepository';
import ExpenseRepository from '@/repositories/ExpenseRepository';
import InventoryTransactionRepository from '@/repositories/InventoryTransactionRepository';
import ItemRepository from '@/repositories/ItemRepository';
import SaleInvoiceRepository from '@/repositories/SaleInvoiceRepository';
import SettingRepository from '@/repositories/SettingRepository';
import VendorRepository from '@/repositories/VendorRepository';
import ViewRepository from '@/repositories/ViewRepository';
import ViewRoleRepository from '@/repositories/ViewRoleRepository';

export default (knex, cache, i18n) => {
  return {
    accountRepository: new AccountRepository(knex, cache, i18n),
    transactionsRepository: new AccountTransactionsRepository(knex, cache, i18n),
    customerRepository: new CustomerRepository(knex, cache, i18n),
    vendorRepository: new VendorRepository(knex, cache, i18n),
    contactRepository: new ContactRepository(knex, cache, i18n),
    expenseRepository: new ExpenseRepository(knex, cache, i18n),
    expenseEntryRepository: new ExpenseEntryRepository(knex, cache, i18n),
    viewRepository: new ViewRepository(knex, cache, i18n),
    viewRoleRepository: new ViewRoleRepository(knex, cache, i18n),
    settingRepository: new SettingRepository(knex, cache, i18n),
    billRepository: new BillRepository(knex, cache, i18n),
    saleInvoiceRepository: new SaleInvoiceRepository(knex, cache, i18n),
    itemRepository: new ItemRepository(knex, cache, i18n),
    inventoryTransactionRepository: new InventoryTransactionRepository(knex, cache, i18n),
  };
};
