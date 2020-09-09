import AccountRepository from '@/repositories/AccountRepository';
import AccountTypeRepository from '@/repositories/AccountTypeRepository';
import VendorRepository from '@/repositories/VendorRepository';
import CustomerRepository from '@/repositories/CustomerRepository';


export default (tenantId: number) => {
  return {
    accountRepository: new AccountRepository(tenantId),
    accountTypeRepository: new AccountTypeRepository(tenantId),
    customerRepository: new CustomerRepository(tenantId), 
    vendorRepository: new VendorRepository(tenantId),
  };
};