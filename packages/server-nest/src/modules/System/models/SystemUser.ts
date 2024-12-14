import { BaseModel } from '@/models/Model';

export class SystemUser extends BaseModel {
  public readonly firstName: string;
  public readonly lastName: string;
  public readonly active: boolean;
  public readonly password: string;
  public readonly email: string;
  public readonly tenantId: number;

  static get tableName() {
    return 'users';
  }
}
