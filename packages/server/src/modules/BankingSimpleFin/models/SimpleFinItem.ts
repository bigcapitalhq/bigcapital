import { BaseModel } from '@/models/Model';

export class SimpleFinItem extends BaseModel {
  tenantId: number;
  simplefinItemId: string;
  accessUrl: string;
  connectionName: string | null;
  lastSyncedAt: Date | string | null;
  pausedAt: Date | string | null;

  /**
   * Table name.
   */
  static get tableName() {
    return 'simplefin_items';
  }

  /**
   * Timestamps columns.
   */
  get timestamps() {
    return ['createdAt', 'updatedAt'];
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
   * Determines whether the SimpleFIN item feeds syncing is paused.
   * @return {boolean}
   */
  get isPaused() {
    return !!this.pausedAt;
  }
}
