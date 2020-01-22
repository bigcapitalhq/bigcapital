import { Model } from 'objection';
import moment from 'moment';
import BaseModel from '@/models/Model';

export default class AccountTransaction extends BaseModel {
  /**
   * Table name
   */
  static get tableName() {
    return 'accounts_transactions';
  }

  /**
   * Model modifiers.
   */
  static get modifiers() {
    return {
      filterAccounts(query, accountsIds) {
        if (accountsIds.length > 0) {
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
        const fromDate = moment(startDate).startOf(type).format(dateFormat);
        const toDate = moment(endDate).endOf(type).format(dateFormat);

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
      sumationCreditDebit(query) {
        query.sum('credit as credit');
        query.sum('debit as debit');
        query.groupBy('account_id');
      },
    };
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const Account = require('@/models/Account');

    return {
      account: {
        relation: Model.BelongsToOneRelation,
        modelClass: Account.default,
        join: {
          from: 'accounts_transactions.accountId',
          to: 'accounts.id',
        },
      },
    };
  }
}
