import { BaseModel } from '@/models/Model';

export class Document extends BaseModel {
  public key: string;
  public mimeType: string;
  public size?: number;
  public originName?: string;

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
