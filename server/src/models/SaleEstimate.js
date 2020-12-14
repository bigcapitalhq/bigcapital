import moment from 'moment';
import { Model } from 'objection';
import TenantModel from 'models/TenantModel';
import { defaultToTransform } from 'utils';
import HasItemEntries from 'services/Sales/HasItemsEntries';
import { query } from 'winston';

export default class SaleEstimate extends TenantModel {
  /**
   * Table name
   */
  static get tableName() {
    return 'sales_estimates';
  }

  /**
   * Timestamps columns.
   */
  get timestamps() {
    return ['createdAt', 'updatedAt'];
  }

  /**
   * Virtual attributes.
   */
  static get virtualAttributes() {
    return [
      'isDelivered',
      'isExpired',
      'isConvertedToInvoice',
      'isApproved',
      'isRejected'
    ];
  } 

  /**
   * Detarmines whether the sale estimate converted to sale invoice.
   * @return {boolean}
   */
  get isConvertedToInvoice() {
    return !!(this.convertedToInvoiceId && this.convertedToInvoiceAt);
  }

  /**
   * Detarmines whether the estimate is delivered.
   * @return {boolean}
   */
  get isDelivered() {
    return !!this.deliveredAt;
  }

  /**
   * Detarmines whether the estimate is expired.
   * @return {boolean}
   */
  get isExpired() {
    return defaultToTransform(
      this.expirationDate,
      moment().isAfter(this.expirationDate, 'day'),
      false,
    );
  }

  /**
   * Detarmines whether the estimate is approved.
   * @return {boolean}
   */
  get isApproved() {
    return !!this.approvedAt;
  }

  /**
   * Detarmines whether the estimate is reject.
   * @return {boolean}
   */
  get isRejected() {
    return !!this.rejectedAt;
  }

  /**
   * Allows to mark model as resourceable to viewable and filterable.
   */
  static get resourceable() {
    return true;
  }

  /**
   * Model modifiers.
   */
  static get modifiers() {
    return {
      /**
       * Filters the drafted estimates transactions.
       */
      draft(query) {
        query.where('delivered_at', null);
      },
      /**
       * Filters the delivered estimates transactions.
       */
      delivered(query) {
        query.whereNot('delivered_at', null);
      },
      /**
       * Filters the expired estimates transactions.
       */
      expired(query) {
        query.where('expiration_date', '<', moment().format('YYYY-MM-DD'));
      },
      /**
       * Filters the rejected estimates transactions.
       */
      rejected(query) {
        query.whereNot('rejected_at', null);
      },
      /**
       * Filters the invoiced estimates transactions.
       */
      invoiced(query) {
        query.whereNot('converted_to_invoice_at', null);
      },
      /**
       * Filters the approved estimates transactions.
       */
      approved(query) {
        query.whereNot('approved_at', null)
      },
    };
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const ItemEntry = require('models/ItemEntry');
    const Contact = require('models/Contact');

    return {
      customer: {
        relation: Model.BelongsToOneRelation,
        modelClass: Contact.default,
        join: {
          from: 'sales_estimates.customerId',
          to: 'contacts.id',
        },
        filter(query) {
          query.where('contact_service', 'customer');
        }
      },
      entries: {
        relation: Model.HasManyRelation,
        modelClass: ItemEntry.default,
        join: {
          from: 'sales_estimates.id',
          to: 'items_entries.referenceId',
        },
        filter(builder) {
          builder.where('reference_type', 'SaleEstimate');
        },
      },
    };
  }

  /**
   * Model defined fields.
   */
  static get fields() {
    return {
      amount: {
        label: 'Amount',
        column: 'amount',
        columnType: 'number',
        fieldType: 'number',
      },
      customer: {
        label: 'Customer',
        column: 'customer_id',
        fieldType: 'options',
        optionsResource: 'customers',
        optionsKey: 'id',
        optionsLable: 'displayName',
      },
      estimate_date: {
        label: 'Estimate date',
        column: 'estimate_date',
        columnType: 'date',
        fieldType: 'date',
      },
      expiration_date: {
        label: 'Expiration date',
        column: 'expiration_date',
        columnType: 'date',
        fieldType: 'date',
      },
      note: {
        label: 'Note',
        column: 'note',
        columnType: 'text',
        fieldType: 'text',
      },
      terms_conditions: {
        label: 'Terms & conditions',
        column: 'terms_conditions',
        columnType: 'text',
        fieldType: 'text',
      },
      status: {
        label: 'Status',
        query: (query, role) => {
          switch(role.value) {
            case 'draft':
              query.modify('draft'); break;
            case 'delivered':
              query.modify('delivered'); break;
            case 'approved':
              query.modify('approved'); break;
            case 'rejected':
              query.modify('rejected'); break;
            case 'invoiced':
              query.modify('invoiced');
              break;
            case 'expired':
              query.modify('expired'); break;
          }
        },
      },
      created_at: {
        label: 'Created at',
        column: 'created_at',
        columnType: 'date',
      },
    };
  }
}
