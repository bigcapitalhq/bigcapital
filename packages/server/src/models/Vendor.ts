import { Model, mixin } from 'objection';
import TenantModel from 'models/TenantModel';
import PaginationQueryBuilder from './Pagination';
import ModelSetting from './ModelSetting';
import VendorSettings from './Vendor.Settings';
import CustomViewBaseModel from './CustomViewBaseModel';
import { DEFAULT_VIEWS } from '@/services/Contacts/Vendors/constants';
import ModelSearchable from './ModelSearchable';

class VendorQueryBuilder extends PaginationQueryBuilder {
  constructor(...args) {
    super(...args);

    this.onBuild((builder) => {
      if (builder.isFind() || builder.isDelete() || builder.isUpdate()) {
        builder.where('contact_service', 'vendor');
      }
    });
  }
}

export default class Vendor extends mixin(TenantModel, [
  ModelSetting,
  CustomViewBaseModel,
  ModelSearchable,
]) {
  /**
   * Query builder.
   */
  static get QueryBuilder() {
    return VendorQueryBuilder;
  }

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
   * Retrieve the contact normal;
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
            .as('countOverdue')
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
    const Bill = require('models/Bill');

    return {
      bills: {
        relation: Model.HasManyRelation,
        modelClass: Bill.default,
        join: {
          from: 'contacts.id',
          to: 'bills.vendorId',
        },
      },
      overdueBills: {
        relation: Model.HasManyRelation,
        modelClass: Bill.default,
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

  static get meta() {
    return VendorSettings;
  }

  /**
   * Retrieve the default custom views, roles and columns.
   */
  static get defaultViews() {
    return DEFAULT_VIEWS;
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
