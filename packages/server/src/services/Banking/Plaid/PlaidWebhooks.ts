import { Inject, Service } from 'typedi';
import { PlaidUpdateTransactions } from './PlaidUpdateTransactions';
import HasTenancyService from '@/services/Tenancy/TenancyService';

@Service()
export class PlaidWebooks {
  @Inject()
  private updateTransactionsService: PlaidUpdateTransactions;

  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Listens to Plaid webhooks
   * @param {number} tenantId - Tenant Id.
   * @param {string} webhookType - Webhook type.
   * @param {string} plaidItemId - Plaid item Id.
   * @param {string} webhookCode - webhook code.
   */
  public async webhooks(
    tenantId: number,
    plaidItemId: string,
    webhookType: string,
    webhookCode: string
  ): Promise<void> {
    const _webhookType = webhookType.toLowerCase();

    // There are five types of webhooks: AUTH, TRANSACTIONS, ITEM, INCOME, and ASSETS.
    // @TODO implement handling for remaining webhook types.
    const webhookHandlerMap = {
      transactions: this.handleTransactionsWebooks.bind(this),
      item: this.itemsHandler.bind(this),
    };
    const webhookHandler =
      webhookHandlerMap[_webhookType] || this.unhandledWebhook;

    await webhookHandler(tenantId, plaidItemId, webhookCode);
  }

  /**
   * Handles all unhandled/not yet implemented webhook events.
   * @param {string} webhookType
   * @param {string} webhookCode
   * @param {string} plaidItemId
   */
  private async unhandledWebhook(
    webhookType: string,
    webhookCode: string,
    plaidItemId: string
  ): Promise<void> {
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
  ): void {
    console.log(
      `PLAID WEBHOOK: TRANSACTIONS: ${webhookCode}: Plaid_item_id ${plaidItemId}: ${additionalInfo}`
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
    const { PlaidItem } = this.tenancy.models(tenantId);

    const plaidItem = await PlaidItem.query()
      .findOne({ plaidItemId })
      .throwIfNotFound();

    switch (webhookCode) {
      case 'SYNC_UPDATES_AVAILABLE': {
        if (plaidItem.isPaused) {
          this.serverLogAndEmitSocket(
            'Plaid item syncing is paused.',
            webhookCode,
            plaidItemId
          );
          return;
        }
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
    plaidItemId: string,
    webhookCode: string
  ): Promise<void> {
    switch (webhookCode) {
      case 'WEBHOOK_UPDATE_ACKNOWLEDGED':
        this.serverLogAndEmitSocket('is updated', plaidItemId, error);
        break;
      case 'ERROR': {
        break;
      }
      case 'PENDING_EXPIRATION': {
        break;
      }
      default:
        this.serverLogAndEmitSocket(
          'unhandled webhook type received.',
          webhookCode,
          plaidItemId
        );
    }
  }
}
