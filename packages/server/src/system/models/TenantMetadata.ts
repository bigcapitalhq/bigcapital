import BaseModel from 'models/Model';

export default class TenantMetadata extends BaseModel {
  baseCurrency!: string;
  name!: string;
  tenantId!: number;
  industry!: string;
  location!: string;
  language!: string;
  timezone!: string;
  dateFormat!: string;
  fiscalYear!: string;
  primaryColor!: string;
  logoKey!: string;
  address!: object;

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['tenantId', 'name', 'baseCurrency'],
      properties: {
        tenantId: { type: 'integer' },
        name: { type: 'string', maxLength: 255 },
        industry: { type: 'string', maxLength: 255 },
        location: { type: 'string', maxLength: 255 },
        baseCurrency: { type: 'string', maxLength: 3 },
        language: { type: 'string', maxLength: 255 },
        timezone: { type: 'string', maxLength: 255 },
        dateFormat: { type: 'string', maxLength: 255 },
        fiscalYear: { type: 'string', maxLength: 255 },
        primaryColor: { type: 'string', maxLength: 7 }, // Assuming hex color code
        logoKey: { type: 'string', maxLength: 255 },
        address: { type: 'object' },
      },
    };
  }

  /**
   * Table name.
   */
  static get tableName() {
    return 'tenants_metadata';
  }

  /**
   * Virtual attributes.
   */
  static get virtualAttributes() {
    return ['logoUri'];
  }

  /**
   * 
   */
  public get logoUri() {
    return this.logoKey ? `https://bigcapital.sfo3.digitaloceanspaces.com/${this.logoKey}` : null;
  }
}
