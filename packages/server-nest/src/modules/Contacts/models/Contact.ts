import { Model } from 'objection';
import { BaseModel } from '@/models/Model';

export class Contact extends BaseModel {
  contactService: string;
  contactType: string;

  balance: number;
  currencyCode: string;

  openingBalance: number;
  openingBalanceAt: Date;

  salutation?: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;

  displayName: string;

  email?: string;
  workPhone?: string;
  personalPhone?: string;
  website?: string;

  billingAddress1?: string;
  billingAddress2?: string;
  billingAddressCity?: string;
  billingAddressCountry?: string;
  billingAddressEmail?: string;
  billingAddressPostcode?: string;
  billingAddressPhone?: string;
  billingAddressState?: string;

  shippingAddress1?: string;
  shippingAddress2?: string;
  shippingAddressCity?: string;
  shippingAddressCountry?: string;
  shippingAddressEmail?: string;
  shippingAddressPostcode?: string;
  shippingAddressPhone?: string;
  shippingAddressState?: string;

  note: string;
  active: boolean;

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
    const { SaleEstimate } = require('../../SaleEstimates/models/SaleEstimate');
    const { SaleReceipt } = require('../../SaleReceipts/models/SaleReceipt');
    const { SaleInvoice } = require('../../SaleInvoices/models/SaleInvoice');
    const { PaymentReceived } = require('../../PaymentReceived/models/PaymentReceived');
    const { Bill } = require('../../Bills/models/Bill');
    const { BillPayment } = require('../../BillPayments/models/BillPayment');
    const { AccountTransaction } = require('../../Accounts/models/AccountTransaction.model');

    return {
      /**
       * Contact may has many sales invoices.
       */
      salesInvoices: {
        relation: Model.HasManyRelation,
        modelClass: SaleInvoice,
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
        modelClass: SaleEstimate,
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
        modelClass: SaleReceipt,
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
        modelClass: PaymentReceived,
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
        modelClass: Bill,
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
        modelClass: BillPayment,
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
        modelClass: AccountTransaction,
        join: {
          from: 'contacts.id',
          to: 'accounts_transactions.contactId',
        },
      },
    };
  }
}
