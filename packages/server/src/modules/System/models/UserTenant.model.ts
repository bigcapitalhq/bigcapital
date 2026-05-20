import { Model } from 'objection';
import { BaseModel } from '@/models/Model';
import { TenantModel } from './TenantModel';

export type UserTenantRole = 'owner' | 'member';

export class UserTenant extends BaseModel {
  public userId: number;
  public tenantId: number;
  public role: UserTenantRole;
  public tenant: TenantModel;

  static get tableName() {
    return 'user_tenants';
  }

  static get relationMappings() {
    const { SystemUser } = require('./SystemUser');
    const { TenantModel } = require('./TenantModel');

    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: SystemUser,
        join: { from: 'user_tenants.userId', to: 'users.id' },
      },
      tenant: {
        relation: Model.BelongsToOneRelation,
        modelClass: TenantModel,
        join: { from: 'user_tenants.tenantId', to: 'tenants.id' },
      },
    };
  }
}
