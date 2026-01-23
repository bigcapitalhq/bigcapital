import { Model } from 'objection';
import { BaseQueryBuilder } from '@/models/Model';
import { TenantBaseModel } from '@/modules/System/models/TenantBaseModel';
import { ExportableModel } from '@/modules/Export/decorators/ExportableModel.decorator';
import { InjectModelMeta } from '@/modules/Tenancy/TenancyModels/decorators/InjectModelMeta.decorator';
import { VendorMeta } from './Vendor.meta';
import { InjectModelDefaultViews } from '@/modules/Views/decorators/InjectModelDefaultViews.decorator';
import { VendorDefaultViews } from '../constants';

export class VendorQueryBuilder<
  M extends Model,
  R = M[],
> extends BaseQueryBuilder<M, R> {
  constructor(...args) {
    // @ts-ignore
    super(...args);

    this.onBuild((builder) => {
      if (builder.isFind() || builder.isDelete() || builder.isUpdate()) {
        builder.where('contact_service', 'vendor');
      }
    });
  }
}

@ExportableModel()
@InjectModelMeta(VendorMeta)
@InjectModelDefaultViews(VendorDefaultViews)
export class Vendor extends TenantBaseModel {
  contactService: string;
  contactType: string;

  balance: number;
  currencyCode: string;

  openingBalance: number;
  openingBalanceExchangeRate: number;
  openingBalanceAt: Date | string;
  openingBalanceBranchId?: number;

  salutation: string;
  firstName: string;
  lastName: string;
  companyName: string;

  displayName: string;

  email: string;
  workPhone: string;
  personalPhone: string;
  website: string;

  billingAddress1: string;
  billingAddress2: string;
  billingAddressCity: string;
  billingAddressCountry: string;
  billingAddressEmail: string;
  billingAddressPostcode: string;
  billingAddressPhone: string;
  billingAddressState: string;

  shippingAddress1: string;
  shippingAddress2: string;
  shippingAddressCity: string;
  shippingAddressCountry: string;
  shippingAddressEmail: string;
  shippingAddressPostcode: string;
  shippingAddressPhone: string;
  shippingAddressState: string;

  note: string;
  active: boolean;

  /**
   * Query builder.
   */
  static QueryBuilder = VendorQueryBuilder;

  /**
   * Table name
   */
  static get tableName() {
    return 'contacts';
  }

  /**
   * Model timestamps.
   */
  get timestamps() {
    return ['createdAt', 'updatedAt'];
  }

  /**
   * Defined virtual attributes.
   */
  static get virtualAttributes() {
    return ['closingBalance', 'contactNormal', 'localOpeningBalance'];
  }

  /**
   * Closing balance attribute.
   */
  get closingBalance() {
    return this.balance;
  }

  /**
   * Retrieves the local opening balance.
   * @returns {number}
   */
  get localOpeningBalance() {
    return this.openingBalance
      ? this.openingBalance * this.openingBalanceExchangeRate
      : 0;
  }

  /**
   * Retrieve the contact noraml;
   */
  get contactNormal() {
    return 'debit';
  }

  /**
   * Model modifiers.
   */
  static get modifiers() {
    return {
      /**
       * Inactive/Active mode.
       */
      inactiveMode(query, active = false) {
        query.where('active', !active);
      },

      /**
       * Filters the active customers.
       */
      active(query) {
        query.where('active', 1);
      },
      /**
       * Filters the inactive customers.
       */
      inactive(query) {
        query.where('active', 0);
      },
      /**
       * Filters the vendors that have overdue invoices.
       */
      overdue(query) {
        query.select(
          '*',
          Vendor.relatedQuery('overdueBills', query.knex())
            .count()
            .as('countOverdue'),
        );
        query.having('countOverdue', '>', 0);
      },
      /**
       * Filters the unpaid customers.
       */
      unpaid(query) {
        query.whereRaw('`BALANCE` + `OPENING_BALANCE` <> 0');
      },
    };
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const { Bill } = require('../../Bills/models/Bill');

    return {
      bills: {
        relation: Model.HasManyRelation,
        modelClass: Bill,
        join: {
          from: 'contacts.id',
          to: 'bills.vendorId',
        },
      },
      overdueBills: {
        relation: Model.HasManyRelation,
        modelClass: Bill,
        join: {
          from: 'contacts.id',
          to: 'bills.vendorId',
        },
        filter: (query) => {
          query.modify('overdue');
        },
      },
    };
  }

  /**
   * Model search attributes.
   */
  static get searchRoles() {
    return [
      { fieldKey: 'display_name', comparator: 'contains' },
      { condition: 'or', fieldKey: 'first_name', comparator: 'contains' },
      { condition: 'or', fieldKey: 'last_name', comparator: 'equals' },
      { condition: 'or', fieldKey: 'company_name', comparator: 'equals' },
      { condition: 'or', fieldKey: 'email', comparator: 'equals' },
      { condition: 'or', fieldKey: 'work_phone', comparator: 'equals' },
      { condition: 'or', fieldKey: 'personal_phone', comparator: 'equals' },
      { condition: 'or', fieldKey: 'website', comparator: 'equals' },
    ];
  }
}
