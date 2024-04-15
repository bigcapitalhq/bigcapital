import { Model } from 'objection';
import TenantModel from 'models/TenantModel';

export default class Contact extends TenantModel {
  email: string;
  displayName: string;

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
      vendor: 'credit',
      customer: 'debit',
    };
    return types[contactType];
  }

  /**
   * Retrieve the contact normal by the given contact service.
   * @param {string} contactService
   */
  static getFormattedContactService(contactService) {
    const types = {
      customer: 'Customer',
      vendor: 'Vendor',
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

      vendor(query) {
        query.where('contact_service', 'vendor');
      },
    };
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const SaleEstimate = require('models/SaleEstimate');
    const SaleReceipt = require('models/SaleReceipt');
    const SaleInvoice = require('models/SaleInvoice');
    const PaymentReceive = require('models/PaymentReceive');
    const Bill = require('models/Bill');
    const BillPayment = require('models/BillPayment');
    const AccountTransaction = require('models/AccountTransaction');

    return {
      /**
       * Contact may has many sales invoices.
       */
      salesInvoices: {
        relation: Model.HasManyRelation,
        modelClass: SaleInvoice.default,
        join: {
          from: 'contacts.id',
          to: 'sales_invoices.customerId',
        },
      },

      /**
       * Contact may has many sales estimates.
       */
      salesEstimates: {
        relation: Model.HasManyRelation,
        modelClass: SaleEstimate.default,
        join: {
          from: 'contacts.id',
          to: 'sales_estimates.customerId',
        },
      },

      /**
       * Contact may has many sales receipts.
       */
      salesReceipts: {
        relation: Model.HasManyRelation,
        modelClass: SaleReceipt.default,
        join: {
          from: 'contacts.id',
          to: 'sales_receipts.customerId',
        },
      },

      /**
       * Contact may has many payments receives.
       */
      paymentReceives: {
        relation: Model.HasManyRelation,
        modelClass: PaymentReceive.default,
        join: {
          from: 'contacts.id',
          to: 'payment_receives.customerId',
        },
      },

      /**
       * Contact may has many bills.
       */
      bills: {
        relation: Model.HasManyRelation,
        modelClass: Bill.default,
        join: {
          from: 'contacts.id',
          to: 'bills.vendorId',
        },
      },

      /**
       * Contact may has many bills payments.
       */
      billPayments: {
        relation: Model.HasManyRelation,
        modelClass: BillPayment.default,
        join: {
          from: 'contacts.id',
          to: 'bills_payments.vendorId',
        },
      },

      /**
       * Contact may has many accounts transactions.
       */
      accountsTransactions: {
        relation: Model.HasManyRelation,
        modelClass: AccountTransaction.default,
        join: {
          from: 'contacts.id',
          to: 'accounts_transactions.contactId',
        },
      },
    };
  }
}
