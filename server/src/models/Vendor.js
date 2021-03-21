import { Model, QueryBuilder } from 'objection';
import TenantModel from 'models/TenantModel';
import PaginationQueryBuilder from './Pagination';

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

export default class Vendor extends TenantModel {
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
    return ['closingBalance', 'contactNormal'];
  }

  /**
   * Closing balance attribute.
   */
  get closingBalance() {
    return this.openingBalance + this.balance;
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
          Vendor
            .relatedQuery('overdueBills', query.knex())
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
      }
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
        }
      }
    };
  }

  static get fields() {
    return {
      contact_service: {
        column: 'contact_service',
      },
      display_name: {
        column: 'display_name',
      },
      email: {
        column: 'email',
      },
      work_phone: {
        column: 'work_phone',
      },
      personal_phone: {
        column: 'personal_phone',
      },
      company_name: {
        column: 'company_name',
      },
      website: {
        column: 'website'
      },
      created_at: {
        column: 'created_at',
      },
      balance: {
        column: 'balance',
      },
      opening_balance: {
        column: 'opening_balance',
      },
      opening_balance_at: {
        column: 'opening_balance_at',
      },
      currency_code: {
        column: 'currency_code',
      },
      status: {
        label: 'Status',
        options: [
          { key: 'active', label: 'Active' },
          { key: 'inactive', label: 'Inactive' },
          { key: 'overdue', label: 'Overdue' },
          { key: 'unpaid', label: 'Unpaid' },
        ],
        query: (query, role) => {
          switch(role.value) {
            case 'active':
              query.modify('active');
              break;
            case 'inactive':
              query.modify('inactive');
              break;
            case 'overdue':
              query.modify('overdue');
              break;
            case 'unpaid':
              query.modify('unpaid');
              break;
          }
        },
      },
      created_at: {
        column: 'created_at',
      }
    };
  }
}
