import { Inject, Service } from 'typedi';
import { IAccountsTypesService, IAccountType } from '@/interfaces';
import AccountTypesUtils from '@/lib/AccountTypes';
import I18nService from '@/services/I18n/I18nService';


@Service()
export default class AccountsTypesService implements IAccountsTypesService {
  @Inject()
  i18nService: I18nService;

  /**
   * Retrieve all accounts types.
   * @param {number} tenantId - 
   * @return {IAccountType}
   */
  public getAccountsTypes(tenantId: number): IAccountType[] {
    const accountTypes = AccountTypesUtils.getList();
    return this.i18nService.i18nMapper(accountTypes, ['label'], tenantId);
  }
}
