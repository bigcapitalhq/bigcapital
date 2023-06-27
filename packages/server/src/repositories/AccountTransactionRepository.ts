import { isEmpty, castArray } from 'lodash';
import { AccountTransaction } from 'models';
import TenantRepository from '@/repositories/TenantRepository';

interface IJournalTransactionsFilter {
  fromDate: string | Date;
  toDate: string | Date;
  accountsIds: number[];
  summationCreditDebit: boolean;
  fromAmount: number;
  toAmount: number;
  contactsIds?: number[];
  contactType?: string;
  referenceType?: string[];
  referenceId?: number[];
  index: number | number[];
  indexGroup: number | number[];
  branchesIds: number | number[];
}

export default class AccountTransactionsRepository extends TenantRepository {
  /**
   * Gets the repository's model.
   */
  get model() {
    return AccountTransaction.bindKnex(this.knex);
  }

  journal(filter: IJournalTransactionsFilter) {
    return this.model
      .query()
      .modify('filterAccounts', filter.accountsIds)
      .modify('filterDateRange', filter.fromDate, filter.toDate)
      .withGraphFetched('account')
      .onBuild((query) => {
        if (filter.summationCreditDebit) {
          query.modify('summationCreditDebit');
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
        if (filter.referenceType && filter.referenceType.length > 0) {
          query.whereIn('reference_type', filter.referenceType);
        }
        if (filter.referenceId && filter.referenceId.length > 0) {
          query.whereIn('reference_id', filter.referenceId);
        }
        if (filter.index) {
          if (Array.isArray(filter.index)) {
            query.whereIn('index', filter.index);
          } else {
            query.where('index', filter.index);
          }
        }
        if (filter.indexGroup) {
          if (Array.isArray(filter.indexGroup)) {
            query.whereIn('index_group', filter.indexGroup);
          } else {
            query.where('index_group', filter.indexGroup);
          }
        }
        if (!isEmpty(filter.branchesIds)) {
          query.modify('filterByBranches', filter.branchesIds);
        }
      });
  }

  openingBalance(fromDate) {
    return AccountTransaction.query().modify('openingBalance', fromDate);
  }

  closingOpening(toDate) {
    return AccountTransaction.query().modify('closingBalance', toDate);
  }

  /**
   * Reverts the journal entries.
   * @param {number|number[]} referenceId - Reference id.
   * @param {string} referenceType - Reference type.
   */
  public getTransactionsByReference = async (
    referenceId: number | number[],
    referenceType: string | string[]
  ) => {
    const transactions = await this.model
      .query()
      .whereIn('reference_type', castArray(referenceType))
      .whereIn('reference_id', castArray(referenceId))
      .withGraphFetched('account');

    return transactions;
  };
}
