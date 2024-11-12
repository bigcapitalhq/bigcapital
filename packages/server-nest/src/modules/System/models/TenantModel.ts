import { BaseModel } from 'src/models/Model';

export class TenantModel extends BaseModel {
  public readonly organizationId: string;
  public readonly initializedAt: string;
  public readonly seededAt: boolean;
  public readonly builtAt: string;

  static get tableName() {
    return 'tenants';
  }
}
