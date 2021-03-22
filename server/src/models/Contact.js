import { Model } from 'objection';
import TenantModel from 'models/TenantModel';

export default class Contact extends TenantModel {
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
    return ['contactNormal', 'closingBalance', 'formattedContactService'];
  }

  /**
   * Retrieve the contact normal by the given contact type.
   */
  static getContactNormalByType(contactType) {
    const types = {
      'vendor': 'credit',
      'customer': 'debit',
    };
    return types[contactType];
  }

  /**
   * Retrieve the contact normal by the given contact service.
   * @param {string} contactService 
   */
  static getFormattedContactService(contactService) {
    const types = {
      'customer': 'Customer',
      'vendor': 'Vendor',
    };
    return types[contactService];
  }

  /**
   * Retrieve the contact normal.
   */
  get contactNormal() {
    return Contact.getContactNormalByType(this.contactService);
  }

  /**
   * Retrieve formatted contact service.
   */
  get formattedContactService() {
    return Contact.getFormattedContactService(this.contactService);
  }

  /**
   * Closing balance attribute.
   */
  get closingBalance() {
    return this.balance;
  }

  /**
   * Model modifiers.
   */
  static get modifiers() {
    return {
      filterContactIds(query, customerIds) {
        query.whereIn('id', customerIds);
      },

      customer(query) {
        query.where('contact_service', 'customer');
      },

      vendor(query){
        query.where('contact_service', 'vendor');
      }
    };
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const SaleInvoice = require('models/SaleInvoice');
    const Bill = require('models/Bill');

    return {
      salesInvoices: {
        relation: Model.HasManyRelation,
        modelClass: SaleInvoice.default,
        join: {
          from: 'contacts.id',
          to: 'sales_invoices.customerId',
        },
      },

      bills: {
        relation: Model.HasManyRelation,
        modelClass: Bill.default,
        join: {
          from: 'contacts.id',
          to: 'bills.vendorId',
        },
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
      created_at: {
        column: 'created_at',
      }
    };
  }
}
