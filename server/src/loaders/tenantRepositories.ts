import AccountRepository from 'repositories/AccountRepository';
import AccountTypeRepository from 'repositories/AccountTypeRepository';
import VendorRepository from 'repositories/VendorRepository';
import CustomerRepository from 'repositories/CustomerRepository';
import ExpenseRepository from 'repositories/ExpenseRepository';
import ViewRepository from 'repositories/ViewRepository';
import ViewRoleRepository from 'repositories/ViewRoleRepository';

export default (tenantId: number) => {
  return {
    accountRepository: new AccountRepository(tenantId),
    accountTypeRepository: new AccountTypeRepository(tenantId),
    customerRepository: new CustomerRepository(tenantId), 
    vendorRepository: new VendorRepository(tenantId),
    expenseRepository: new ExpenseRepository(tenantId),
    viewRepository: new ViewRepository(tenantId),
    viewRoleRepository: new ViewRoleRepository(tenantId),
  };
};