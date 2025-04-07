// import { IAccountType } from './Accounts.types';
import { Injectable } from '@nestjs/common';
import { AccountTypesUtils } from './utils/AccountType.utils';

@Injectable()
export class GetAccountTypesService {
  /**
   * Retrieve all accounts types.
   * @param {number} tenantId - 
   * @return {IAccountType}
   */
  public getAccountsTypes() {
    const accountTypes = AccountTypesUtils.getList();

    return accountTypes;
  }
}
