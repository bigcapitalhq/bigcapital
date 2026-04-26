import { Model } from 'objection';
import { BaseModel } from '@/models/Model';

export type SquareConnectionStatus = 'pending' | 'active' | 'disabled';

export class SquareConnection extends BaseModel {
  public merchantId!: string;
  public environment!: string;
  public accessTokenEncrypted!: string | null;
  public refreshTokenEncrypted!: string | null;
  public tokenExpiresAt!: Date | null;
  public webhookSignatureKey!: string;
  public squareWebhookSubscriptionId!: string | null;
  public clearingAccountId!: number | null;
  public feesExpenseAccountId!: number | null;
  public tipsLiabilityAccountId!: number | null;
  public walkInCustomerId!: number | null;
  public depositBankAccountId!: number | null;
  // Default revenue account used as the sell account on the auto-created
  // "Square Sales" item. The catalog page can override per Square item.
  public defaultSalesAccountId!: number | null;
  // Id of the auto-created "Square Sales" Bigcapital item. Set by
  // EnsureSquareSystemItems when the wizard transitions to active.
  public squareSalesItemId!: number | null;
  public status!: SquareConnectionStatus;
  public statusMessage!: string | null;
  public connectedAt!: Date | null;
  public disconnectedAt!: Date | null;

  static get tableName() {
    return 'square_connections';
  }

  get timestamps() {
    return ['createdAt', 'updatedAt'];
  }

  static get virtualAttributes() {
    return ['isActive'];
  }

  get isActive() {
    return this.status === 'active';
  }

  static get relationMappings() {
    const {
      SquareEventLog,
    } = require('./SquareEventLog.model');
    const {
      SquareItemMapping,
    } = require('./SquareItemMapping.model');
    const {
      SquareCustomerMapping,
    } = require('./SquareCustomerMapping.model');

    return {
      events: {
        relation: Model.HasManyRelation,
        modelClass: SquareEventLog,
        join: {
          from: 'square_connections.id',
          to: 'square_event_log.connectionId',
        },
      },
      itemMappings: {
        relation: Model.HasManyRelation,
        modelClass: SquareItemMapping,
        join: {
          from: 'square_connections.id',
          to: 'square_item_mappings.connectionId',
        },
      },
      customerMappings: {
        relation: Model.HasManyRelation,
        modelClass: SquareCustomerMapping,
        join: {
          from: 'square_connections.id',
          to: 'square_customer_mappings.connectionId',
        },
      },
    };
  }
}
