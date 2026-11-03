import { Knex } from 'knex';
import { uniq } from 'lodash';
import { Inject, Injectable } from '@nestjs/common';
import { PlaidApi } from 'plaid';
import { Account } from '@/modules/Accounts/models/Account.model';
import { PLAID_CLIENT } from '@/modules/Plaid/Plaid.module';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { PlaidItem } from '../models/PlaidItem';

/**
 * The account fields the unlink reads. Both the Account model and the deleted
 * account event payload carry them; the payload's IAccount types plaidItemId
 * as a number and omits plaidAccountId.
 */
interface PlaidLinkedAccount {
  id: number;
  plaidItemId?: string | number | null;
  plaidAccountId?: string | null;
}

@Injectable()
export class UnlinkPlaidAccountService {
  constructor(
    @Inject(PLAID_CLIENT)
    private readonly plaidClient: PlaidApi,

    @Inject(Account.name)
    private readonly accountModel: TenantModelProxy<typeof Account>,

    @Inject(PlaidItem.name)
    private readonly plaidItemModel: TenantModelProxy<typeof PlaidItem>,
  ) {}

  /**
   * Stops the Plaid feed of the given account, once disconnected or deleted.
   * The Plaid item is kept while other accounts are fed by it, recording the
   * account's Plaid account as disconnected so the item sync neither feeds it
   * nor creates it again. With its last account, the item is deleted and
   * removed from Plaid.
   * @param {PlaidLinkedAccount} account - The account to unlink.
   * @param {Knex.Transaction} trx - Knex transaction.
   * @returns {Promise<void>}
   */
  public async unlinkAccount(
    account: PlaidLinkedAccount,
    trx?: Knex.Transaction,
  ): Promise<void> {
    // Unlink the account itself; a deleted account has no row left to update.
    await this.accountModel().query(trx).findById(account.id).patch({
      plaidAccountId: null,
      plaidItemId: null,
      isFeedsActive: false,
    });
    if (!account.plaidItemId) {
      return;
    }
    const plaidItem = await this.plaidItemModel()
      .query(trx)
      .findOne('plaidItemId', account.plaidItemId);

    // Nothing else to clean up if the item is already gone.
    if (!plaidItem) {
      return;
    }
    const otherItemAccounts = await this.accountModel()
      .query(trx)
      .where('plaidItemId', account.plaidItemId)
      .whereNot('id', account.id)
      .whereNotNull('plaidAccountId');

    if (otherItemAccounts.length > 0) {
      if (account.plaidAccountId) {
        await this.plaidItemModel()
          .query(trx)
          .findById(plaidItem.id)
          .patch({
            disconnectedPlaidAccountIds: uniq([
              ...(plaidItem.disconnectedPlaidAccountIds ?? []),
              account.plaidAccountId,
            ]),
          });
      }
      return;
    }
    await this.plaidItemModel().query(trx).findById(plaidItem.id).delete();

    await this.plaidClient.itemRemove({
      access_token: plaidItem.plaidAccessToken,
    });
  }
}
