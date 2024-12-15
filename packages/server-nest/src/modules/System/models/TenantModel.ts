import { BaseModel } from '@/models/Model';
import { Model } from 'objection';
import { TenantMetadata } from './TenantMetadataModel';


export class TenantModel extends BaseModel {
  public readonly organizationId: string;
  public readonly initializedAt: string;
  public readonly seededAt: boolean;
  public readonly builtAt: string;
  public readonly metadata: any;

  /**
   * Table name.
   */
  static tableName = 'tenants';
  
  /**
   * Relations mappings.
   */
  static get relationMappings() {
    // const PlanSubscription = require('./Subscriptions/PlanSubscription');
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
    };
  }
}
