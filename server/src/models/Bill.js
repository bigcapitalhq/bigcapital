import { Model, raw } from 'objection';
import { difference } from 'lodash';
import TenantModel from 'models/TenantModel';

export default class Bill extends TenantModel {
  /**
   * Virtual attributes.
   */
  static get virtualAttributes() {
    return ['dueAmount'];
  }

  /**
   * Table name
   */
  static get tableName() {
    return 'bills';
  }

  static get resourceable() {
    return true;
  }

  static get modifiers() {
    return {
      dueBills(query) {
        query.where(raw('AMOUNT - PAYMENT_AMOUNT > 0'));
      }
    }
  }

  /**
   * Timestamps columns.
   */
  get timestamps() {
    return ['createdAt', 'updatedAt'];
  }

  /**
   * Due amount of the given.
   * @return {number}
   */
  get dueAmount() {
    return Math.max(this.amount - this.paymentAmount, 0);
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const Contact = require('models/Contact');
    const ItemEntry = require('models/ItemEntry');

    return {
      vendor: {
        relation: Model.BelongsToOneRelation,
        modelClass: Contact.default,
        join: {
          from: 'bills.vendorId',
          to: 'contacts.id',
        },
        filter(query) {
          query.where('contact_service', 'vendor');
        }
      },

      entries: {
        relation: Model.HasManyRelation,
        modelClass: ItemEntry.default,
        join: {
          from: 'bills.id',
          to: 'items_entries.referenceId',
        },
        filter(builder) {
          builder.where('reference_type', 'Bill');
        },
      },
    };
  }

  /**
   * Retrieve the not found bills ids as array that associated to the given vendor.
   * @param {Array} billsIds 
   * @param {number} vendorId - 
   * @return {Array}
   */
  static async getNotFoundBills(billsIds, vendorId) {
    const storedBills = await this.query()
      .onBuild((builder) => {
        builder.whereIn('id', billsIds);

        if (vendorId) {
          builder.where('vendor_id', vendorId);
        }
      });
      
    const storedBillsIds = storedBills.map((t) => t.id);

    const notFoundBillsIds = difference(
      billsIds,
      storedBillsIds,
    );
    return notFoundBillsIds;
  }

  static changePaymentAmount(billId, amount) {
    const changeMethod = amount > 0 ? 'increment' : 'decrement';
    return this.query()
      .where('id', billId)
      [changeMethod]('payment_amount', Math.abs(amount));
  }

  static get fields() {
    return {
      created_at: {
        label: 'Created at',
        column: 'created_at',
        columnType: 'date',
      },
      vendor: {
        label: 'Vendor',
        column: 'vendor_id',
        relation: 'contacts.id',
        relationColumn: 'contacts.display_name',
      },
      bill_number: {
        label: 'Bill number',
        column: 'bill_number',
        columnType: 'string',
        fieldType: 'text',
      },
      bill_date: {
        label: 'Bill date',
        column: 'bill_date',
        columnType: 'date',
        fieldType: 'date',
      },
      due_date: {
        label: 'Due date',
        column: 'due_date',
      },
      reference_no: {
        label: 'Reference No.',
        column: 'reference_no',
        columnType: 'string',
        fieldType: 'text',
      },
      status: {
        label: 'Status',
        column: 'status',
      },
      amount: {
        label: 'Amount',
        column: 'amount',
        columnType: 'number',
        fieldType: 'number',
      },
      payment_amount: {
        label: 'Payment amount',
        column: 'payment_amount',
        columnType: 'number',
        fieldType: 'number',
      },
      note: {
        label: 'Note',
        column: 'note',
      },
    }
  }
}
