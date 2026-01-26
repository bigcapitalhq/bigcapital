import { Model, raw } from 'objection';
import * as moment from 'moment';
import { unitOfTime } from 'moment';
import { isEmpty, castArray } from 'lodash';
import { BaseModel } from '@/models/Model';
import { Account } from './Account.model';
import { getTransactionTypeLabel } from '@/modules/BankingTransactions/utils';
// import { getTransactionTypeLabel } from '@/utils/transactions-types';

export class AccountTransaction extends BaseModel {
  public readonly referenceType: string;
  public readonly referenceId: number;
  public readonly accountId: number;
  public readonly contactId: number;
  public readonly contactType: string;
  public readonly credit: number;
  public readonly debit: number;
  public readonly exchangeRate: number;
  public readonly taxRate: number;
  public readonly date: Date | string;
  public readonly transactionType: string;
  public readonly currencyCode: string;
  public readonly transactionNumber!: string;
  public readonly referenceNumber!: string;
  public readonly note!: string;

  public readonly index!: number;
  public readonly indexGroup!: number;

  public readonly taxRateId!: number;

  public readonly branchId!: number;
  public readonly userId!: number;
  public readonly itemId!: number;
  public readonly projectId!: number;
  public readonly costable!: boolean;
  public readonly account: Account;

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
    return ['referenceTypeFormatted', 'creditLocal', 'debitLocal'];
  }

  /**
   * Retrieves the credit amount in base currency.
   * @return {number}
   */
  get creditLocal() {
    return this.credit * this.exchangeRate;
  }

  /**
   * Retrieves the debit amount in base currency.
   * @return {number}
   */
  get debitLocal() {
    return this.debit * this.exchangeRate;
  }

  /**
   * Retrieve formatted reference type.
   * @return {string}
   */
  get referenceTypeFormatted() {
    return getTransactionTypeLabel(this.referenceType, this.transactionType);
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

      /**
       * Filters the transaction types.
       * @param {Query} query
       * @param {string[]} types
       */
      filterTransactionTypes(query, types) {
        if (Array.isArray(types) && types.length > 0) {
          query.whereIn('reference_type', types);
        } else if (typeof types === 'string') {
          query.where('reference_type', types);
        }
      },

      /**
       * Filters the date range.
       * @param {Query} query
       * @param {moment.MomentInput} startDate
       * @param {moment.MomentInput} endDate
       * @param {unitOfTime.StartOf} type
       */
      filterDateRange(
        query,
        startDate: moment.MomentInput,
        endDate: moment.MomentInput,
        type: unitOfTime.StartOf = 'day',
      ) {
        const dateFormat = 'YYYY-MM-DD';
        const fromDate = moment(startDate).startOf(type).format(dateFormat);
        const toDate = moment(endDate).endOf(type).format(dateFormat);

        if (startDate) {
          query.where('date', '>=', fromDate);
        }
        if (endDate) {
          query.where('date', '<=', toDate);
        }
      },

      /**
       * Filters the amount range.
       * @param {Query} query
       * @param {number} fromAmount
       * @param {number} toAmount
       */
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
      sumationCreditDebit(query) {
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
        query.modify('sumationCreditDebit');
      },
      closingBalance(query, toDate) {
        query.modify('filterDateRange', null, toDate);
        query.modify('sumationCreditDebit');
      },
      contactsOpeningBalance(
        query,
        openingDate,
        receivableAccounts,
        customersIds,
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

      filterByReference(query, referenceId: number, referenceType: string) {
        query.where('reference_id', referenceId);
        query.where('reference_type', referenceType);
      },
    };
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const { Account } = require('./Account.model');
    const { Contact } = require('../../Contacts/models/Contact');

    return {
      account: {
        relation: Model.BelongsToOneRelation,
        modelClass: Account,
        join: {
          from: 'accounts_transactions.accountId',
          to: 'accounts.id',
        },
      },
      contact: {
        relation: Model.BelongsToOneRelation,
        modelClass: Contact,
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
