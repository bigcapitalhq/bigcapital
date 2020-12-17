import { AccountTransaction } from 'models';
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
  /**
   * Gets the repository's model.
   */
  get model() {
    return AccountTransaction.bindKnex(this.knex);
  }

  journal(filter: IJournalTransactionsFilter) {
    const cacheKey = this.getCacheKey('transactions.journal', filter);

    return this.cache.get(cacheKey, () => {
      return this.model.query()
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