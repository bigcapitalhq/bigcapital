import { Model, mixin } from 'objection';
import TenantModel from 'models/TenantModel';
import PaginationQueryBuilder from './Pagination';
import ModelSetting from './ModelSetting';
import CustomerSettings from './Customer.Settings';
import CustomViewBaseModel from './CustomViewBaseModel';
import { DEFAULT_VIEWS } from 'services/Contacts/Customers/constants';

class CustomerQueryBuilder extends PaginationQueryBuilder {
  constructor(...args) {
    super(...args);

    this.onBuild((builder) => {
      if (builder.isFind() || builder.isDelete() || builder.isUpdate()) {
        builder.where('contact_service', 'customer');
      }
    });
  }
}

export default class Customer extends mixin(TenantModel, [
  ModelSetting,
  CustomViewBaseModel,
]) {
  /**
   * Query builder.
   */
  static get QueryBuilder() {
    return CustomerQueryBuilder;
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
    return ['closingBalance', 'contactNormal'];
  }

  /**
   * Closing balance attribute.
   */
  get closingBalance() {
    return this.balance;
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
       * Filters the customers that have overdue invoices.
       */
      overdue(query) {
        query.select(
          '*',
          Customer.relatedQuery('overDueInvoices', query.knex())
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
    const SaleInvoice = require('models/SaleInvoice');

    return {
      salesInvoices: {
        relation: Model.HasManyRelation,
        modelClass: SaleInvoice.default,
        join: {
          from: 'contacts.id',
          to: 'sales_invoices.customerId',
        },
      },

      overDueInvoices: {
        relation: Model.HasManyRelation,
        modelClass: SaleInvoice.default,
        join: {
          from: 'contacts.id',
          to: 'sales_invoices.customerId',
        },
        filter: (query) => {
          query.modify('overdue');
        },
      },
    };
  }

  static get meta() {
    return CustomerSettings;
  }

  /**
   * Retrieve the default custom views, roles and columns.
   */
  static get defaultViews() {
    return DEFAULT_VIEWS;
  }
}
