import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { PlaidItem } from '../models/PlaidItem';
import { Inject, Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import {
  IPlaidWebhookReceivedEventPayload,
  UpdateBankingPlaidTransitionsJob,
  UpdateBankingPlaidTransitionsQueueJob,
} from '../types/BankingPlaid.types';

@Injectable()
export class PlaidWebooks {
  /**
   * Webhook types/codes that trigger meaningful updates and are worth
   * recording in the audit log. Ignored/unhandled webhooks are skipped.
   */
  private static readonly AUDITABLE_WEBHOOKS: Record<string, Set<string>> = {
    transactions: new Set(['SYNC_UPDATES_AVAILABLE']),
    item: new Set([
      'WEBHOOK_UPDATE_ACKNOWLEDGED',
      'ERROR',
      'PENDING_EXPIRATION',
    ]),
  };

  constructor(
    private readonly eventPublisher: EventEmitter2,

    @Inject(PlaidItem.name)
    private readonly plaidItemModel: TenantModelProxy<typeof PlaidItem>,

    @InjectQueue(UpdateBankingPlaidTransitionsQueueJob)
    private readonly updateTransitionsQueue: Queue,
  ) {}

  /**
   * Listens to Plaid webhooks
   * @param {string} webhookType - Webhook type.
   * @param {string} plaidItemId - Plaid item Id.
   * @param {string} webhookCode - webhook code.
   */
  public async webhooks(
    plaidItemId: string,
    webhookType: string,
    webhookCode: string,
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

    await webhookHandler(plaidItemId, webhookCode);

    // Record the webhook in the audit log only when it maps to a meaningful update.
    if (PlaidWebooks.AUDITABLE_WEBHOOKS[_webhookType]?.has(webhookCode)) {
      await this.eventPublisher.emitAsync(events.plaid.onWebhookReceived, {
        plaidItemId,
        webhookType: _webhookType,
        webhookCode,
      } as IPlaidWebhookReceivedEventPayload);
    }
  }

  /**
   * Handles all unhandled/not yet implemented webhook events.
   * @param {string} webhookType - Webhook type.
   * @param {string} webhookCode - Webhook code.
   * @param {string} plaidItemId - Plaid item id.
   */
  private async unhandledWebhook(
    webhookType: string,
    webhookCode: string,
    plaidItemId: string,
  ): Promise<void> {
    console.log(
      `UNHANDLED ${webhookType} WEBHOOK: ${webhookCode}: Plaid item id ${plaidItemId}: unhandled webhook type received.`,
    );
  }

  /**
   * Logs to console and emits to socket
   * @param {string} additionalInfo - Additional info.
   * @param {string} webhookCode - Webhook code.
   * @param {string} plaidItemId - Plaid item id.
   */
  private serverLogAndEmitSocket(
    additionalInfo: string,
    webhookCode: string,
    plaidItemId: string,
  ): void {
    console.log(
      `PLAID WEBHOOK: TRANSACTIONS: ${webhookCode}: Plaid_item_id ${plaidItemId}: ${additionalInfo}`,
    );
  }

  /**
   * Handles all transaction webhook events. The transaction webhook notifies
   * you that a single item has new transactions available.
   * @param {string} plaidItemId - Plaid item id.
   * @param {string} webhookCode - Webhook code.
   * @returns {Promise<void>}
   */
  public async handleTransactionsWebooks(
    plaidItemId: string,
    webhookCode: string,
  ): Promise<void> {
    const plaidItem = await this.plaidItemModel()
      .query()
      .findOne({ plaidItemId })
      .throwIfNotFound();

    switch (webhookCode) {
      case 'SYNC_UPDATES_AVAILABLE': {
        if (plaidItem.isPaused) {
          this.serverLogAndEmitSocket(
            'Plaid item syncing is paused.',
            webhookCode,
            plaidItemId,
          );
          return;
        }
        // Fired when new transactions data becomes available. Enqueue a
        // transaction sync job deduplicated by the Plaid item id so that
        // overlapping webhooks (or Plaid retries) coalesce into a single
        // in-flight sync instead of running concurrently.
        await this.updateTransitionsQueue.add(
          UpdateBankingPlaidTransitionsJob,
          { plaidItemId },
          { jobId: plaidItemId },
        );

        this.serverLogAndEmitSocket(
          'Transactions sync queued.',
          webhookCode,
          plaidItemId,
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
          plaidItemId,
        );
    }
  }

  /**
   * Handles all Item webhook events.
   * @param {string} plaidItemId - The Plaid ID for the item
   * @param {string} webhookCode - The webhook code
   * @returns {Promise<void>}
   */
  public async itemsHandler(
    plaidItemId: string,
    webhookCode: string,
  ): Promise<void> {
    switch (webhookCode) {
      case 'WEBHOOK_UPDATE_ACKNOWLEDGED':
        this.serverLogAndEmitSocket('is updated', webhookCode, plaidItemId);
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
          plaidItemId,
        );
    }
  }
}
