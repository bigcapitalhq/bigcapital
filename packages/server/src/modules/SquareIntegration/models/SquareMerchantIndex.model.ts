import { BaseModel } from '@/models/Model';

/**
 * System-DB index mapping (merchant_id, environment) → (organization_id,
 * connection_id). Written by the OAuth callback. Read by the app-level
 * webhook receiver to discover which tenant owns the inbound merchant_id
 * before opening the tenant DB.
 */
export class SquareMerchantIndex extends BaseModel {
  public id!: number;
  public merchantId!: string;
  public environment!: string;
  public organizationId!: string;
  public connectionId!: number | null;

  static get tableName() {
    return 'square_merchant_index';
  }

  get timestamps() {
    return ['createdAt', 'updatedAt'];
  }
}
