import { TenantModel } from "@/modules/System/models/TenantModel";

export class Currency extends TenantModel {
  public readonly currencySign: string;
  public readonly currencyName: string;
  public readonly currencyCode: string;

  /**
   * Table name
   */
  static get tableName() {
    return 'currencies';
  }

  /**
   * Timestamps columns.
   */
  get timestamps() {
    return ['createdAt', 'updatedAt'];
  }

  static get resourceable() {
    return true;
  }
}