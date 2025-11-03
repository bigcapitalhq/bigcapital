import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { PromisePool } from '@supercharge/promise-pool';
import { castArray, uniq } from 'lodash';
import { DeleteAccount } from './DeleteAccount.service';

@Injectable()
export class BulkDeleteAccountsService {
  constructor(private readonly deleteAccountService: DeleteAccount) { }

  /**
   * Deletes multiple accounts.
   * @param {number | Array<number>} accountIds - The account id or ids.
   * @param {Knex.Transaction} trx - The transaction.
   */
  async bulkDeleteAccounts(
    accountIds: number | Array<number>,
    trx?: Knex.Transaction,
  ): Promise<void> {
    const accountsIds = uniq(castArray(accountIds));

    const results = await PromisePool.withConcurrency(1)
      .for(accountsIds)
      .process(async (accountId: number) => {
        await this.deleteAccountService.deleteAccount(accountId);
      });

    if (results.errors && results.errors.length > 0) {
      throw results.errors[0].raw;
    }
  }
}

