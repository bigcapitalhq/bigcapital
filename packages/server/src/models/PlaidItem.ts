import TenantModel from 'models/TenantModel';

export default class PlaidItem extends TenantModel {
  pausedAt: Date;

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
