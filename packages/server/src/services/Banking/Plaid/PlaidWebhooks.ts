import { Inject, Service } from 'typedi';
import { PlaidUpdateTransactions } from './PlaidUpdateTransactions';

@Service()
export class PlaidWebooks {
  @Inject()
  private updateTransactionsService: PlaidUpdateTransactions;

  /**
   * Listens to Plaid webhooks
   * @param {number} tenantId
   * @param {string} webhookType
   * @param {string} plaidItemId
   * @param {string} webhookCode
   */
  async webhooks(
    tenantId: number,
    webhookType: string,
    plaidItemId: string,
    webhookCode: string
  ) {
    // There are five types of webhooks: AUTH, TRANSACTIONS, ITEM, INCOME, and ASSETS.
    // @TODO implement handling for remaining webhook types.
    const webhookHandlerMap = {
      transactions: this.handleTransactionsWebooks,
      item: this.itemsHandler,
    };
    const webhookHandler =
      webhookHandlerMap[webhookType] || this.unhandledWebhook;

    await webhookHandler(tenantId, webhookCode, plaidItemId);
  }

  /**
   * Handles all unhandled/not yet implemented webhook events.
   * @param {string} webhookType
   * @param {string} webhookCode
   * @param {string} plaidItemId
   */
  async unhandledWebhook(
    webhookType: string,
    webhookCode: string,
    plaidItemId: string
  ) {
    console.log(
      `UNHANDLED ${webhookType} WEBHOOK: ${webhookCode}: Plaid item id ${plaidItemId}: unhandled webhook type received.`
    );
  }

  /**
   * Logs to console and emits to socket
   * @param {string} additionalInfo
   * @param {string} webhookCode
   * @param {string} plaidItemId
   */
  private serverLogAndEmitSocket(
    additionalInfo: string,
    webhookCode: string,
    plaidItemId: string
  ) {
    console.log(
      `WEBHOOK: TRANSACTIONS: ${webhookCode}: Plaid_item_id ${plaidItemId}: ${additionalInfo}`
    );
  }

  /**
   * Handles all transaction webhook events. The transaction webhook notifies
   * you that a single item has new transactions available.
   * @param {number} tenantId
   * @param {string} plaidItemId
   * @param {string} webhookCode
   * @returns {Promise<void>}
   */
  public async handleTransactionsWebooks(
    tenantId: number,
    plaidItemId: string,
    webhookCode: string
  ): Promise<void> {
    switch (webhookCode) {
      case 'SYNC_UPDATES_AVAILABLE': {
        // Fired when new transactions data becomes available.
        const { addedCount, modifiedCount, removedCount } =
          await this.updateTransactionsService.updateTransactions(
            tenantId,
            plaidItemId
          );
        this.serverLogAndEmitSocket(
          `Transactions: ${addedCount} added, ${modifiedCount} modified, ${removedCount} removed`,
          webhookCode,
          plaidItemId
        );
        break;
      }
      case 'DEFAULT_UPDATE':
      case 'INITIAL_UPDATE':
      case 'HISTORICAL_UPDATE':
        /* ignore - not needed if using sync endpoint + webhook */
        break;
      default:
        this.serverLogAndEmitSocket(
          `unhandled webhook type received.`,
          webhookCode,
          plaidItemId
        );
    }
  }

  /**
   * Handles all Item webhook events.
   * @param {number} tenantId - Tenant ID
   * @param {string} webhookCode - The webhook code
   * @param {string} plaidItemId - The Plaid ID for the item
   * @returns {Promise<void>}
   */
  public async itemsHandler(
    tenantId: number,
    webhookCode: string,
    plaidItemId: string
  ): Promise<void> {
    switch (webhookCode) {
      case 'WEBHOOK_UPDATE_ACKNOWLEDGED':
        this.serverLogAndEmitSocket('is updated', plaidItemId, error);
        break;
      case 'ERROR': {
        this.serverLogAndEmitSocket(
          `ERROR: ${error.error_code}: ${error.error_message}`,
          itemId,
          error.error_code
        );
        break;
      }
      case 'PENDING_EXPIRATION': {
        const { id: itemId } = await retrieveItemByPlaidItemId(plaidItemId);
        await updateItemStatus(itemId, 'bad');

        this.serverLogAndEmitSocket(
          `user needs to re-enter login credentials`,
          itemId,
          error
        );
        break;
      }
      default:
        this.serverLogAndEmitSocket(
          'unhandled webhook type received.',
          plaidItemId,
          error
        );
    }
  }
}
