import {
  defaultOrganizationAddressFormat,
  organizationAddressTextFormat,
} from '@/utils/address-text-format';
import BaseModel from 'models/Model';
import { findByIsoCountryCode } from '@bigcapital/utils';
import { getUploadedObjectUri } from '../../services/Attachments/utils';

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
  address!: Record<string, any>;

  /**
   * Json schema.
   */
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
   * Organization logo url.
   * @returns {string | null}
   */
  public get logoUri() {
    return this.logoKey ? getUploadedObjectUri(this.logoKey) : null;
  }

  /**
   * Retrieves the organization address formatted text.
   * @returns {string}
   */
  public get addressTextFormatted() {
    const addressCountry = findByIsoCountryCode(this.location);

    return organizationAddressTextFormat(defaultOrganizationAddressFormat, {
      organizationName: this.name,
      address1: this.address?.address1,
      address2: this.address?.address2,
      state: this.address?.stateProvince,
      city: this.address?.city,
      postalCode: this.address?.postalCode,
      phone: this.address?.phone,
      country: addressCountry?.name ?? '',
    });
  }
}
