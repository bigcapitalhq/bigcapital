import { Model, raw } from 'objection';
import moment from 'moment';
import { isEmpty, castArray } from 'lodash';
import TenantModel from 'models/TenantModel';

export default class AccountTransaction extends TenantModel {
  /**
   * Table name
   */
  static get tableName() {
    return 'accounts_transactions';
  }

  /**
   * Timestamps columns.
   */
  get timestamps() {
    return ['createdAt'];
  }

  /**
   * Virtual attributes.
   */
  static get virtualAttributes() {
    return ['referenceTypeFormatted'];
  }

  /**
   * Retrieve formatted reference type.
   * @return {string}
   */
  get referenceTypeFormatted() {
    return AccountTransaction.getReferenceTypeFormatted(this.referenceType);
  }

  /**
   * Reference type formatted.
   */
  static getReferenceTypeFormatted(referenceType) {
    const mapped = {
      SaleInvoice: 'Sale invoice',
      SaleReceipt: 'Sale receipt',
      PaymentReceive: 'Payment receive',
      Bill: 'Bill',
      BillPayment: 'Payment made',
      VendorOpeningBalance: 'Vendor opening balance',
      CustomerOpeningBalance: 'Customer opening balance',
      InventoryAdjustment: 'Inventory adjustment',
      ManualJournal: 'Manual journal',
      Journal: 'Manual journal',
      Expense: 'Expense',
      OwnerContribution: 'Owner contribution',
      TransferToAccount: 'Transfer to account',
      TransferFromAccount: 'Transfer from account',
      OtherIncome: 'Other income',
      OtherExpense: 'Other expense',
      OwnerDrawing: 'Owner drawing',
      InvoiceWriteOff: 'Invoice write-off',

      CreditNote: 'transaction_type.credit_note',
      VendorCredit: 'transaction_type.vendor_credit',

      RefundCreditNote: 'transaction_type.refund_credit_note',
      RefundVendorCredit: 'transaction_type.refund_vendor_credit',
    };
    return mapped[referenceType] || '';
  }

  /**
   * Model modifiers.
   */
  static get modifiers() {
    return {
      /**
       * Filters accounts by the given ids.
       * @param {Query} query
       * @param {number[]} accountsIds
       */
      filterAccounts(query, accountsIds) {
        if (Array.isArray(accountsIds) && accountsIds.length > 0) {
          query.whereIn('account_id', accountsIds);
        }
      },
      filterTransactionTypes(query, types) {
        if (Array.isArray(types) && types.length > 0) {
          query.whereIn('reference_type', types);
        } else if (typeof types === 'string') {
          query.where('reference_type', types);
        }
      },
      filterDateRange(query, startDate, endDate, type = 'day') {
        const dateFormat = 'YYYY-MM-DD HH:mm:ss';
        const fromDate = moment(startDate)
          .utcOffset(0)
          .startOf(type)
          .format(dateFormat);
        const toDate = moment(endDate)
          .utcOffset(0)
          .endOf(type)
          .format(dateFormat);

        if (startDate) {
          query.where('date', '>=', fromDate);
        }
        if (endDate) {
          query.where('date', '<=', toDate);
        }
      },
      filterAmountRange(query, fromAmount, toAmount) {
        if (fromAmount) {
          query.andWhere((q) => {
            q.where('credit', '>=', fromAmount);
            q.orWhere('debit', '>=', fromAmount);
          });
        }
        if (toAmount) {
          query.andWhere((q) => {
            q.where('credit', '<=', toAmount);
            q.orWhere('debit', '<=', toAmount);
          });
        }
      },
      summationCreditDebit(query) {
        query.select(['accountId']);

        query.sum('credit as credit');
        query.sum('debit as debit');
        query.groupBy('account_id');
      },
      filterContactType(query, contactType) {
        query.where('contact_type', contactType);
      },
      filterContactIds(query, contactIds) {
        query.whereIn('contact_id', contactIds);
      },
      openingBalance(query, fromDate) {
        query.modify('filterDateRange', null, fromDate);
        query.modify('summationCreditDebit');
      },
      closingBalance(query, toDate) {
        query.modify('filterDateRange', null, toDate);
        query.modify('summationCreditDebit');
      },

      contactsOpeningBalance(
        query,
        openingDate,
        receivableAccounts,
        customersIds
      ) {
        // Filter by date.
        query.modify('filterDateRange', null, openingDate);

        // Filter by customers.
        query.whereNot('contactId', null);
        query.whereIn('accountId', castArray(receivableAccounts));

        if (!isEmpty(customersIds)) {
          query.whereIn('contactId', castArray(customersIds));
        }
        // Group by the contact transactions.
        query.groupBy('contactId');
        query.sum('credit as credit');
        query.sum('debit as debit');
        query.select('contactId');
      },
      creditDebitSummation(query) {
        query.sum('credit as credit');
        query.sum('debit as debit');
      },
      groupByDateFormat(query, groupType = 'month') {
        const groupBy = {
          day: '%Y-%m-%d',
          month: '%Y-%m',
          year: '%Y',
        };
        const dateFormat = groupBy[groupType];

        query.select(raw(`DATE_FORMAT(DATE, '${dateFormat}')`).as('date'));
        query.groupByRaw(`DATE_FORMAT(DATE, '${dateFormat}')`);
      },

      filterByBranches(query, branchesIds) {
        const formattedBranchesIds = castArray(branchesIds);

        query.whereIn('branchId', formattedBranchesIds);
      },

      filterByProjects(query, projectsIds) {
        const formattedProjectsIds = castArray(projectsIds);

        query.whereIn('projectId', formattedProjectsIds);
      },
    };
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const Account = require('models/Account');
    const Contact = require('models/Contact');

    return {
      account: {
        relation: Model.BelongsToOneRelation,
        modelClass: Account.default,
        join: {
          from: 'accounts_transactions.accountId',
          to: 'accounts.id',
        },
      },
      contact: {
        relation: Model.BelongsToOneRelation,
        modelClass: Contact.default,
        join: {
          from: 'accounts_transactions.contactId',
          to: 'contacts.id',
        },
      },
    };
  }

  /**
   * Prevents mutate base currency since the model is not empty.
   */
  static get preventMutateBaseCurrency() {
    return true;
  }
}
