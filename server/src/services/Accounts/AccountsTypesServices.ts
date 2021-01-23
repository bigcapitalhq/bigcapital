import { Service } from 'typedi';
import { IAccountsTypesService, IAccountType } from 'interfaces';
import AccountTypesUtils from 'lib/AccountTypes';

@Service()
export default class AccountsTypesService implements IAccountsTypesService {
  /**
   * Retrieve all accounts types.
   * @return {IAccountType}
   */
  getAccountsTypes(): IAccountType[] {
    return AccountTypesUtils.getList();
  }
}
