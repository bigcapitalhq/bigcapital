import { BaseModel } from '@/models/Model';

export class SystemUser extends BaseModel {
  public readonly firstName: string;
  public readonly lastName: string;
  public readonly email: string;
  public readonly password: string;

  public readonly active: boolean;
  public readonly tenantId: number;
  public readonly verifyToken: string;
  public readonly verified: boolean;
  public readonly inviteAcceptedAt!: string;

  static get tableName() {
    return 'users';
  }
}
