import { Model, mixin } from 'objection';
import moment from 'moment';
import TenantModel from '@/models/TenantModel';
import CachableQueryBuilder from '@/lib/Cachable/CachableQueryBuilder';
import CachableModel from '@/lib/Cachable/CachableModel';


export default class AccountTransaction extends mixin(TenantModel, [CachableModel]) {
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
   * Extend query builder model.
   */
  static get QueryBuilder() {
    return CachableQueryBuilder;
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
      filterContactType(query, contactType) {
        query.where('contact_type', contactType);
      },
      filterContactIds(query, contactIds) {
        query.whereIn('contact_id', contactIds);
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
        modelClass: this.relationBindKnex(Account.default),
        join: {
          from: 'accounts_transactions.accountId',
          to: 'accounts.id',
        },
      },
    };
  }
}
