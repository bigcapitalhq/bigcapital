import { Model } from 'objection';
import TenantModel from 'models/TenantModel';
import PaginationQueryBuilder from './Pagination';
import QueryParser from 'lib/LogicEvaluation/QueryParser';

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

export default class Customer extends TenantModel {
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
    return ['closingBalance'];
  }

  /**
   * Closing balance attribute.
   */
  get closingBalance() {
    return this.openingBalance + this.balance;
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
       * Filters the customers that have overdue invoices.
       */
      overdue(query) {
        query.select(
          '*',
          Customer
            .relatedQuery('overDueInvoices', query.knex())
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
        }
      }
    };
  }

  static get fields() {
    return {
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
