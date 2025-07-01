import { SystemModel } from '@/modules/System/models/SystemModel';

export class ApiKeyModel extends SystemModel {
  readonly key: string;
  readonly name?: string;
  readonly createdAt: Date;
  readonly expiresAt?: Date;
  readonly revoked?: boolean;
  readonly userId: number;
  readonly tenantId: number;

  /**
   * Table name
   */
  static get tableName() {
    return 'api_keys';
  }

  /**
   * Timestamps columns.
   */
  get timestamps() {
    return ['createdAt'];
  }
}
