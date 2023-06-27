import moment from 'moment';
import { castArray, sumBy, toArray } from 'lodash';
import { IBill, ISystemUser, IAccount } from '@/interfaces';
import JournalPoster from './JournalPoster';
import JournalEntry from './JournalEntry';
import { IExpense, IExpenseCategory } from '@/interfaces';
import { increment } from 'utils';
export default class JournalCommands {
  journal: JournalPoster;
  models: any;
  repositories: any;

  /**
   * Constructor method.
   * @param {JournalPoster} journal -
   */
  constructor(journal: JournalPoster) {
    this.journal = journal;

    this.repositories = this.journal.repositories;
    this.models = this.journal.models;
  }
  /**
   * Reverts the journal entries.
   * @param {number|number[]} referenceId - Reference id.
   * @param {string} referenceType - Reference type.
   */
  async revertJournalEntries(
    referenceId: number | number[],
    referenceType: string | string[]
  ) {
    const { AccountTransaction } = this.models;

    const transactions = await AccountTransaction.query()
      .whereIn('reference_type', castArray(referenceType))
      .whereIn('reference_id', castArray(referenceId))
      .withGraphFetched('account');

    this.journal.fromTransactions(transactions);
    this.journal.removeEntries();
  }

  /**
   * Reverts the sale invoice cost journal entries.
   * @param {Date|string} startingDate
   * @return {Promise<void>}
   */
  async revertInventoryCostJournalEntries(
    startingDate: Date | string
  ): Promise<void> {
    const { AccountTransaction } = this.models;

    this.journal.fromTransactions(transactions);
    this.journal.removeEntries();
  }

  /**
   * Reverts sale invoice the income journal entries.
   * @param {number} saleInvoiceId
   */
  async revertInvoiceIncomeEntries(saleInvoiceId: number) {
    const { transactionsRepository } = this.repositories;

    const transactions = await transactionsRepository.journal({
      referenceType: ['SaleInvoice'],
      referenceId: [saleInvoiceId],
    });
    this.journal.fromTransactions(transactions);
    this.journal.removeEntries();
  }
}
