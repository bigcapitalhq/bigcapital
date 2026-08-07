import { Injectable } from '@nestjs/common';
import { PromisePool } from '@supercharge/promise-pool';
import { castArray, uniq } from 'lodash';
import { ActivateAccount } from './ActivateAccount.service';

@Injectable()
export class BulkActivateAccountsService {
  constructor(private readonly activateAccountService: ActivateAccount) {}

  /**
   * Activates/Inactivates multiple accounts.
   * @param {number | Array<number>} accountIds - The account id or ids.
   * @param {boolean} activate - Activate or inactivate the accounts.
   */
  async bulkActivateAccounts(
    accountIds: number | Array<number>,
    activate: boolean,
  ): Promise<void> {
    const accountsIds = uniq(castArray(accountIds));

    const results = await PromisePool.withConcurrency(1)
      .for(accountsIds)
      .process(async (accountId: number) => {
        await this.activateAccountService.activateAccount(accountId, activate);
      });

    if (results.errors && results.errors.length > 0) {
      throw results.errors[0].raw;
    }
  }
}
