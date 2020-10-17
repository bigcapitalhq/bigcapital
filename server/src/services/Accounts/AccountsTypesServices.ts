import { Inject, Service } from 'typedi';
import { omit } from 'lodash';
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
  async getAccountsTypes(tenantId: number): Promise<IAccountType> {
    const { accountTypeRepository } = this.tenancy.repositories(tenantId);
    const { AccountType } = this.tenancy.models(tenantId);
    const { __ } = this.tenancy.i18n(tenantId);

    const allAccountsTypes = await accountTypeRepository.all();
    
    return allAccountsTypes.map((_accountType: IAccountType) => ({
      id: _accountType.id,
      label: __(AccountType.labels[_accountType.key]),
      ...omit(_accountType, ['id']),
    }));
  }
}