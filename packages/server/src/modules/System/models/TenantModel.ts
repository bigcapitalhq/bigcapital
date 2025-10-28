import { BaseModel } from '@/models/Model';
import { Model } from 'objection';
import { TenantMetadata } from './TenantMetadataModel';
import { PlanSubscription } from '@/modules/Subscription/models/PlanSubscription';

export class TenantModel extends BaseModel {
  public readonly organizationId: string;
  public readonly initializedAt: string;
  public readonly seededAt: string;
  public readonly builtAt: string;
  public readonly metadata: TenantMetadata;
  public readonly buildJobId: string;
  public readonly upgradeJobId: string;
  public readonly databaseBatch: string;
  public readonly subscriptions: Array<PlanSubscription>;

  /**
   * Table name.
   */
  static tableName = 'tenants';

  /**
   * Virtual attributes.
   * @returns {string[]}
   */
  static get virtualAttributes() {
    return ['isReady', 'isBuildRunning', 'isUpgradeRunning'];
  }

  /**
   * Tenant is ready.
   * @returns {boolean}
   */
  get isReady() {
    return !!(this.initializedAt && this.seededAt);
  }

  /**
   * Determines the tenant whether is build currently running.
   * @returns {boolean}
   */
  get isBuildRunning() {
    return !!this.buildJobId;
  }

  /**
   * Determines the tenant whether is upgrade currently running.
   * @returns {boolean}
   */
  get isUpgradeRunning() {
    return !!this.upgradeJobId;
  }

  /**
   * Relations mappings.
   */
  static get relationMappings() {
    const {
      PlanSubscription,
    } = require('../../Subscription/models/PlanSubscription');
    const { TenantMetadata } = require('./TenantMetadataModel');

    return {
      metadata: {
        relation: Model.HasOneRelation,
        modelClass: TenantMetadata,
        join: {
          from: 'tenants.id',
          to: 'tenants_metadata.tenantId',
        },
      },

      subscriptions: {
        relation: Model.HasManyRelation,
        modelClass: PlanSubscription,
        join: {
          from: 'tenants.id',
          to: 'subscription_plan_subscriptions.tenantId',
        },
      },
    };
  }
}
