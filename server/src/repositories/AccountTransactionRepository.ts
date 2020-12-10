
import { QueryBuilder } from 'knex';
import { AccountTransaction } from 'models';
import hashObject from 'object-hash';
import TenantRepository from 'repositories/TenantRepository';


interface IJournalTransactionsFilter {
  fromDate: string | Date,
  toDate: string | Date,
  accountsIds: number[],
  sumationCreditDebit: boolean,
  fromAmount: number,
  toAmount: number,
  contactsIds?: number[],
  contactType?: string,
};

export default class AccountTransactionsRepository extends TenantRepository {

  journal(filter: IJournalTransactionsFilter) {
    const { AccountTransaction } = this.models;
    const cacheKey = this.getCacheKey('transactions.journal', filter);

    return this.cache.get(cacheKey, () => {
      return AccountTransaction.query()
        .modify('filterAccounts', filter.accountsIds)
        .modify('filterDateRange', filter.fromDate, filter.toDate)
        .withGraphFetched('account.type')
        .onBuild((query) => {
          if (filter.sumationCreditDebit) {
            query.modify('sumationCreditDebit');
          }
          if (filter.fromAmount || filter.toAmount) {
            query.modify('filterAmountRange', filter.fromAmount, filter.toAmount);
          }
          if (filter.contactsIds) {
            query.modify('filterContactIds', filter.contactsIds);
          }
          if (filter.contactType) {
            query.where('contact_type', filter.contactType);
          }
        });
    });
  }

  openingBalance(fromDate) {
    return this.cache.get('transaction.openingBalance', () => {
      return AccountTransaction.query()
        .modify('openingBalance', fromDate);
    })
  }

  closingOpening(toDate) {
    return this.cache.get('transaction.closingBalance', () => {
      return AccountTransaction.query()
        .modify('closingBalance', toDate);
    });
  }
}