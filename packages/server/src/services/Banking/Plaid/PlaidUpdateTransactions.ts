import HasTenancyService from '@/services/Tenancy/TenancyService';
import { Inject, Service } from 'typedi';
import { PlaidClientWrapper } from '@/lib/Plaid/Plaid';
import { PlaidSyncDb } from './PlaidSyncDB';
import { PlaidFetchedTransactionsUpdates } from '@/interfaces';

@Service()
export class PlaidUpdateTransactions {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private plaidSync: PlaidSyncDb;

  /**
   * Handles the fetching and storing of new, modified, or removed transactions
   * @param {number} tenantId Tenant ID.
   * @param {string} plaidItemId the Plaid ID for the item.
   */
  public async updateTransactions(tenantId: number, plaidItemId: string) {
    // Fetch new transactions from plaid api.
    const { added, modified, removed, cursor, accessToken } =
      await this.fetchTransactionUpdates(tenantId, plaidItemId);

    const request = { access_token: accessToken };
    const plaidInstance = new PlaidClientWrapper();
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
    // Update the DB.
    await this.plaidSync.syncBankAccounts(tenantId, accounts, institution);
    await this.plaidSync.syncAccountsTransactions(
      tenantId,
      added.concat(modified)
    );
    await this.plaidSync.syncRemoveTransactions(tenantId, removed);
    await this.plaidSync.syncTransactionsCursor(tenantId, plaidItemId, cursor);

    // Update the last feeds updated at of the updated accounts.
    await this.plaidSync.updateLastFeedsUpdatedAt(tenantId, plaidAccountsIds);

    // Turn on the accounts feeds flag.
    await this.plaidSync.updateAccountsFeedsActive(tenantId, plaidAccountsIds);

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
        const plaidInstance = new PlaidClientWrapper();
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
