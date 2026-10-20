import { BaseModel } from '@/models/Model';

export class PlaidItem extends BaseModel {
  pausedAt: Date;
  plaidAccessToken: string;
  lastCursor?: string;
  tenantId: number;
  plaidItemId: string;
  plaidInstitutionId: string;
  disconnectedPlaidAccountIds?: string[] | null;

  /**
   * Table name.
   */
  static get tableName() {
    return 'plaid_items';
  }

  /**
   * Timestamps columns.
   */
  get timestamps() {
    return [];
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    return {};
  }

  /**
   * Json attributes.
   */
  static get jsonAttributes() {
    return ['disconnectedPlaidAccountIds'];
  }

  /**
   * Virtual attributes.
   */
  static get virtualAttributes() {
    return ['isPaused'];
  }

  /**
   * Detarmines whether the Plaid item feeds syncing is paused.
   * @return {boolean}
   */
  get isPaused() {
    return !!this.pausedAt;
  }
}
