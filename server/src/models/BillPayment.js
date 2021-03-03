import { Model } from "objection";
import TenantModel from "models/TenantModel";

export default class BillPayment extends TenantModel {
  /**
   * Table name
   */
  static get tableName() {
    return "bills_payments";
  }

  /**
   * Timestamps columns.
   */
  get timestamps() {
    return ["createdAt", "updatedAt"];
  }

  static get resourceable() {
    return true;
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const BillPaymentEntry = require("models/BillPaymentEntry");
    const AccountTransaction = require("models/AccountTransaction");
    const Contact = require("models/Contact");
    const Account = require("models/Account");

    return {
      entries: {
        relation: Model.HasManyRelation,
        modelClass: BillPaymentEntry.default,
        join: {
          from: "bills_payments.id",
          to: "bills_payments_entries.billPaymentId",
        },
      },

      vendor: {
        relation: Model.BelongsToOneRelation,
        modelClass: Contact.default,
        join: {
          from: "bills_payments.vendorId",
          to: "contacts.id",
        },
        filter(query) {
          query.where("contact_service", "vendor");
        },
      },

      paymentAccount: {
        relation: Model.BelongsToOneRelation,
        modelClass: Account.default,
        join: {
          from: "bills_payments.paymentAccountId",
          to: "accounts.id",
        },
      },

      transactions: {
        relation: Model.HasManyRelation,
        modelClass: AccountTransaction.default,
        join: {
          from: "bills_payments.id",
          to: "accounts_transactions.referenceId",
        },
        filter(builder) {
          builder.where("reference_type", "BillPayment");
        },
      },
    };
  }

  /**
   * Resource fields.
   */
  static get fields() {
    return {
      vendor: {
        label: "Vendor name",
        column: "vendor_id",
        relation: "contacts.id",
        relationColumn: "contacts.display_name",
      },
      amount: {
        label: "Amount",
        column: "amount",
        columnType: "number",
        fieldType: "number",
      },
      due_amount: {
        label: "Due amount",
        column: "due_amount",
        columnType: "number",
        fieldType: "number",
      },
      payment_account: {
        label: "Payment account",
        column: "payment_account_id",
        relation: "accounts.id",
        relationColumn: "accounts.name",

        fieldType: "options",
        optionsResource: "Account",
        optionsKey: "id",
        optionsLabel: "name",
      },
      payment_number: {
        label: "Payment number",
        column: "payment_number",
        columnType: "string",
        fieldType: "text",
      },
      payment_date: {
        label: "Payment date",
        column: "payment_date",
        columnType: "date",
        fieldType: "date",
      },
      reference_no: {
        label: "Reference No.",
        column: "reference",
        columnType: "string",
        fieldType: "text",
      },
      description: {
        label: "Description",
        column: "description",
        columnType: "string",
        fieldType: "text",
      },
      created_at: {
        label: "Created at",
        column: "created_at",
        columnType: "date",
      },
    };
  }
}
