import { Inject, Service } from 'typedi';
import TenancyService from 'services/Tenancy/TenancyService';
import { IAccountsTypesService, IAccountType } from 'interfaces';

@Service()
export default class AccountsTypesService implements IAccountsTypesService{
  @Inject()
  tenancy: TenancyService;

  /**
   * Retrieve all accounts types.
   * @param {number} tenantId - 
   * @return {Promise<IAccountType>}
   */
  getAccountsTypes(tenantId: number): Promise<IAccountType> {
    const { accountTypeRepository } = this.tenancy.repositories(tenantId);
    return accountTypeRepository.all();
  }
}