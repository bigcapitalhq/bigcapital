import { Knex } from 'knex';
import { PlaidSyncDb } from './PlaidSyncDB';
import { PlaidFetchedTransactionsUpdates } from '../types/BankingPlaid.types';
import { PlaidItem } from '../models/PlaidItem';
import { Inject, Injectable } from '@nestjs/common';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import {
  CountryCode,
  PlaidApi,
  Transaction as PlaidTransaction,
  RemovedTransaction,
} from 'plaid';
import { PLAID_CLIENT } from '@/modules/Plaid/Plaid.module';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class PlaidUpdateTransactions {
  /**
   * Constructor method.
   * @param {PlaidSyncDb} plaidSync - Plaid sync service.
   * @param {UnitOfWork} uow - Unit of work.
   * @param {TenantModelProxy<typeof PlaidItem>} plaidItemModel - Plaid item model.
   * @param {PlaidApi} plaidClient - Plaid client.
   */
  constructor(
    private readonly plaidSync: PlaidSyncDb,
    private readonly uow: UnitOfWork,

    @Inject(PlaidItem.name)
    private readonly plaidItemModel: TenantModelProxy<typeof PlaidItem>,

    @Inject(PLAID_CLIENT)
    private readonly plaidClient: PlaidApi,
  ) {}

  /**
   * Handles sync the Plaid item to Bigcaptial under UOW.
   * @param {string} plaidItemId - Plaid item id.
   * @returns {Promise<{ addedCount: number; modifiedCount: number; removedCount: number; }>}
   */
  public async updateTransactions(plaidItemId: string) {
    return this.uow.withTransaction((trx: Knex.Transaction) => {
      return this.updateTransactionsWork(plaidItemId, trx);
    });
  }

  /**
   * Handles the fetching and storing the following:
   *  - New, modified, or removed transactions.
   *  - New bank accounts.
   *  - Last accounts feeds updated at.
   *  - Turn on the accounts feed flag.
   * @param {string} plaidItemId - The Plaid ID for the item.
   * @param {Knex.Transaction} trx - Knex transaction.
   * @returns {Promise<{ addedCount: number; modifiedCount: number; removedCount: number; }>}
   */
  public async updateTransactionsWork(
    plaidItemId: string,
    trx?: Knex.Transaction,
  ): Promise<{
    addedCount: number;
    modifiedCount: number;
    removedCount: number;
  }> {
    // Lock the Plaid item row (FOR UPDATE) to serialize concurrent syncs for
    // the same item across the webhook and the background job, then use the
    // locked row's cursor so the second run only fetches the pending delta.
    const plaidItem = await this.plaidItemModel()
      .query(trx)
      .findOne({ plaidItemId })
      .forUpdate();

    // Can't continue if the Plaid item is not found or the feeds syncing is
    // paused (re-checked under the lock to avoid a race with pausing).
    if (!plaidItem || plaidItem.isPaused) {
      return { addedCount: 0, modifiedCount: 0, removedCount: 0 };
    }
    // Fetch new transactions from plaid api.
    const { added, modified, removed, cursor, accessToken } =
      await this.fetchTransactionUpdates(
        plaidItem.plaidAccessToken,
        plaidItem.lastCursor,
      );

    const request = { access_token: accessToken };
    const {
      data: { accounts, item },
    } = await this.plaidClient.accountsGet(request);

    const plaidAccountsIds = accounts.map((a) => a.account_id);
    const {
      data: { institution },
    } = await this.plaidClient.institutionsGetById({
      institution_id: item.institution_id,
      country_codes: [CountryCode.Us, CountryCode.Gb],
    });
    // Sync bank accounts.
    await this.plaidSync.syncBankAccounts(accounts, institution, item, trx);
    // Sync removed transactions.
    await this.plaidSync.syncRemoveTransactions(
      removed?.map((r) => r.transaction_id),
      trx,
    );
    // Sync bank account transactions.
    await this.plaidSync.syncAccountsTransactions(added.concat(modified), trx);
    // Sync transactions cursor.
    await this.plaidSync.syncTransactionsCursor(plaidItemId, cursor, trx);
    // Update the last feeds updated at of the updated accounts.
    await this.plaidSync.updateLastFeedsUpdatedAt(plaidAccountsIds, trx);
    // Turn on the accounts feeds flag.
    await this.plaidSync.updateAccountsFeedsActive(plaidAccountsIds, true, trx);

    return {
      addedCount: added.length,
      modifiedCount: modified.length,
      removedCount: removed.length,
    };
  }

  /**
   * Fetches transactions from the `Plaid API` for a given item.
   * @param {string} plaidAccessToken - Plaid access token.
   * @param {string} lastCursor - Last transactions cursor.
   * @returns {Promise<PlaidFetchedTransactionsUpdates>}
   */
  private async fetchTransactionUpdates(
    plaidAccessToken: string,
    lastCursor: string,
  ): Promise<PlaidFetchedTransactionsUpdates> {
    // the transactions endpoint is paginated, so we may need to hit it multiple times to
    // retrieve all available transactions.
    let cursor = lastCursor;

    // New transaction updates since "cursor"
    let added: PlaidTransaction[] = [];
    let modified: PlaidTransaction[] = [];
    // Removed transaction ids
    let removed: RemovedTransaction[] = [];
    let hasMore = true;

    const batchSize = 100;
    try {
      // Iterate through each page of new transaction updates for item
      while (hasMore) {
        const request = {
          access_token: plaidAccessToken,
          cursor: cursor,
          count: batchSize,
        };
        const response = await this.plaidClient.transactionsSync(request);
        const data = response.data;
        // Add this page of results
        added = added.concat(data.added);
        modified = modified.concat(data.modified);
        removed = removed.concat(data.removed);
        hasMore = data.has_more;
        // Update cursor to the next cursor
        cursor = data.next_cursor;
      }
    } catch (err) {
      console.error(`Error fetching transactions: ${err.message}`);
      cursor = lastCursor;
    }
    return { added, modified, removed, cursor, accessToken: plaidAccessToken };
  }
}
