import { Model, QueryBuilder } from 'objection';
import TenantModel from 'models/TenantModel';


class CustomerQueryBuilder extends QueryBuilder {
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
    };
  }

  static get fields() {
    return {
      created_at: {
        column: 'created_at',
      }
    };
  }
}
