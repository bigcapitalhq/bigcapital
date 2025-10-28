import { TenantBaseModel } from '@/modules/System/models/TenantBaseModel';

export class DocumentModel extends TenantBaseModel {
  originName!: string;
  size!: number;
  mimeType!: string;
  key!: string;

  /**
   * Table name
   */
  static get tableName() {
    return 'documents';
  }

  /**
   * Model timestamps.
   */
  get timestamps() {
    return ['createdAt', 'updatedAt'];
  }
}
