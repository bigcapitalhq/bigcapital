import { Knex } from 'knex';
import { Inject, Service } from 'typedi';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { PlaidClientWrapper } from '@/lib/Plaid/Plaid';
import { PlaidSyncDb } from './PlaidSyncDB';
import { PlaidFetchedTransactionsUpdates } from '@/interfaces';
import UnitOfWork from '@/services/UnitOfWork';

@Service()
export class PlaidUpdateTransactions {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private plaidSync: PlaidSyncDb;

  @Inject()
  private uow: UnitOfWork;

  /**
   * Handles sync the Plaid item to Bigcaptial under UOW.
   * @param {number} tenantId - Tenant id.
   * @param {number} plaidItemId - Plaid item id.
   * @returns {Promise<{ addedCount: number; modifiedCount: number; removedCount: number; }>}
   */
  public async updateTransactions(tenantId: number, plaidItemId: string) {
    return this.uow.withTransaction(tenantId, (trx: Knex.Transaction) => {
      return this.updateTransactionsWork(tenantId, plaidItemId, trx);
    });
  }

  /**
   * Handles the fetching and storing the following:
   *  - New, modified, or removed transactions.
   *  - New bank accounts.
   *  - Last accounts feeds updated at.
   *  - Turn on the accounts feed flag.
   * @param {number} tenantId - Tenant ID.
   * @param {string} plaidItemId - The Plaid ID for the item.
   * @returns {Promise<{  addedCount: number; modifiedCount: number; removedCount: number; }>}
   */
  public async updateTransactionsWork(
    tenantId: number,
    plaidItemId: string,
    trx?: Knex.Transaction
  ): Promise<{
    addedCount: number;
    modifiedCount: number;
    removedCount: number;
  }> {
    // Fetch new transactions from plaid api.
    const { added, modified, removed, cursor, accessToken } =
      await this.fetchTransactionUpdates(tenantId, plaidItemId);

    const request = { access_token: accessToken };
    const plaidInstance = PlaidClientWrapper.getClient();
    const {
      data: { accounts, item },
    } = await plaidInstance.accountsGet(request);

    const plaidAccountsIds = accounts.map((a) => a.account_id);
    const {
      data: { institution },
    } = await plaidInstance.institutionsGetById({
      institution_id: item.institution_id,
      country_codes: ['US', 'UK'],
    });
    // Sync bank accounts.
    await this.plaidSync.syncBankAccounts(
      tenantId,
      accounts,
      institution,
      item,
      trx
    );
    // Sync removed transactions.
    await this.plaidSync.syncRemoveTransactions(
      tenantId,
      removed?.map((r) => r.transaction_id),
      trx
    );
    // Sync bank account transactions.
    await this.plaidSync.syncAccountsTransactions(
      tenantId,
      added.concat(modified),
      trx
    );
    // Sync transactions cursor.
    await this.plaidSync.syncTransactionsCursor(
      tenantId,
      plaidItemId,
      cursor,
      trx
    );
    // Update the last feeds updated at of the updated accounts.
    await this.plaidSync.updateLastFeedsUpdatedAt(
      tenantId,
      plaidAccountsIds,
      trx
    );
    // Turn on the accounts feeds flag.
    await this.plaidSync.updateAccountsFeedsActive(
      tenantId,
      plaidAccountsIds,
      true,
      trx
    );
    return {
      addedCount: added.length,
      modifiedCount: modified.length,
      removedCount: removed.length,
    };
  }

  /**
   * Fetches transactions from the `Plaid API` for a given item.
   * @param {number} tenantId - Tenant ID.
   * @param {string} plaidItemId - The Plaid ID for the item.
   * @returns {Promise<PlaidFetchedTransactionsUpdates>}
   */
  private async fetchTransactionUpdates(
    tenantId: number,
    plaidItemId: string
  ): Promise<PlaidFetchedTransactionsUpdates> {
    // the transactions endpoint is paginated, so we may need to hit it multiple times to
    // retrieve all available transactions.
    const { PlaidItem } = this.tenancy.models(tenantId);

    const plaidItem = await PlaidItem.query().findOne(
      'plaidItemId',
      plaidItemId
    );
    if (!plaidItem) {
      throw new Error('The given Plaid item id is not found.');
    }
    const { plaidAccessToken, lastCursor } = plaidItem;
    let cursor = lastCursor;

    // New transaction updates since "cursor"
    let added = [];
    let modified = [];
    // Removed transaction ids
    let removed = [];
    let hasMore = true;

    const batchSize = 100;
    try {
      // Iterate through each page of new transaction updates for item
      /* eslint-disable no-await-in-loop */
      while (hasMore) {
        const request = {
          access_token: plaidAccessToken,
          cursor: cursor,
          count: batchSize,
        };
        const plaidInstance = PlaidClientWrapper.getClient();
        const response = await plaidInstance.transactionsSync(request);
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
