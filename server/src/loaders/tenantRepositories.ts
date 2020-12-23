import AccountRepository from 'repositories/AccountRepository';
import AccountTypeRepository from 'repositories/AccountTypeRepository';
import VendorRepository from 'repositories/VendorRepository';
import CustomerRepository from 'repositories/CustomerRepository';
import ExpenseRepository from 'repositories/ExpenseRepository';
import ViewRepository from 'repositories/ViewRepository';
import ViewRoleRepository from 'repositories/ViewRoleRepository';
import ContactRepository from 'repositories/ContactRepository';
import AccountTransactionsRepository from 'repositories/AccountTransactionRepository';
import SettingRepository from 'repositories/SettingRepository';
import ExpenseEntryRepository from 'repositories/ExpenseEntryRepository';
import BillRepository from 'repositories/BillRepository';
import SaleInvoiceRepository from 'repositories/SaleInvoiceRepository';
import ItemRepository from 'repositories/ItemRepository';
import InventoryTransactionRepository from 'repositories/InventoryTransactionRepository';

export default (knex, cache) => {
  return {
    accountRepository: new AccountRepository(knex, cache),
    transactionsRepository: new AccountTransactionsRepository(knex, cache),
    accountTypeRepository: new AccountTypeRepository(knex, cache),
    customerRepository: new CustomerRepository(knex, cache), 
    vendorRepository: new VendorRepository(knex, cache),
    contactRepository: new ContactRepository(knex, cache),
    expenseRepository: new ExpenseRepository(knex, cache),
    expenseEntryRepository: new ExpenseEntryRepository(knex, cache),
    viewRepository: new ViewRepository(knex, cache),
    viewRoleRepository: new ViewRoleRepository(knex, cache),
    settingRepository: new SettingRepository(knex, cache),
    billRepository: new BillRepository(knex, cache),
    saleInvoiceRepository: new SaleInvoiceRepository(knex, cache),
    itemRepository: new ItemRepository(knex, cache),
    inventoryTransactionRepository: new InventoryTransactionRepository(knex, cache),
  };
};