import { sumBy, chain } from 'lodash';
import JournalPoster from "./JournalPoster";
import JournalEntry from "./JournalEntry";
import { AccountTransaction } from '@/models';
import { IInventoryTransaction } from '@/interfaces';
import AccountsService from '../Accounts/AccountsService';
import { IInventoryTransaction, IInventoryTransaction } from '../../interfaces';

interface IInventoryCostEntity {
  date: Date,

  referenceType: string,
  referenceId: number,

  costAccount: number,
  incomeAccount: number,
  inventoryAccount: number,

  inventory: number,
  cost: number,
  income: number,
};

interface NonInventoryJEntries {
  date: Date,

  referenceType: string,
  referenceId: number,

  receivable: number,
  payable: number,

  incomeAccountId: number,
  income: number,

  costAccountId: number,
  cost: number,
};

export default class JournalCommands{
  journal: JournalPoster;

  /**
   * Constructor method.
   * @param {JournalPoster} journal - 
   */
  constructor(journal: JournalPoster) {
    this.journal = journal;
    Object.assign(this, arguments[1]);
  }

  /**
   * Removes and revert accounts balance journal entries that associated
   * to the given inventory transactions.
   * @param {IInventoryTransaction[]} inventoryTransactions 
   * @param {Journal} journal 
   */
  revertEntriesFromInventoryTransactions(inventoryTransactions: IInventoryTransaction[]) {
    const groupedInvTransactions = chain(inventoryTransactions)
      .groupBy((invTransaction: IInventoryTransaction) => invTransaction.transactionType)
      .map((groupedTrans: IInventoryTransaction[], transType: string) => [groupedTrans, transType])
      .value();

    return Promise.all(
      groupedInvTransactions.map(async (grouped: [IInventoryTransaction[], string]) => {
        const [invTransGroup, referenceType] = grouped;
        const referencesIds = invTransGroup.map((trans: IInventoryTransaction) => trans.transactionId);

        const _transactions = await AccountTransaction.tenant()
          .query()
          .where('reference_type', referenceType)
          .whereIn('reference_id', referencesIds)
          .withGraphFetched('account.type');

        if (_transactions.length > 0) {
          this.journal.loadEntries(_transactions);
          this.journal.removeEntries(_transactions.map((t: any) => t.id));
        }
      })
    );
  }

  public async nonInventoryEntries(
    transactions: NonInventoryJEntries[]
  ) {
    const receivableAccount = { id: 10 };
    const payableAccount = {id: 11};

    transactions.forEach((trans: NonInventoryJEntries) => {
      const commonEntry = {
        date: trans.date,
        referenceId: trans.referenceId,
        referenceType: trans.referenceType,
      };

      switch(trans.referenceType) {  
        case 'Bill':
          const payableEntry: JournalEntry = new JournalEntry({
            ...commonEntry,
            credit: trans.payable,
            account: payableAccount.id,            
          });
          const costEntry: JournalEntry = new JournalEntry({
            ...commonEntry,
          });
          this.journal.credit(payableEntry);
          this.journal.debit(costEntry);
          break;
        case 'SaleInvoice':
          const receivableEntry: JournalEntry = new JournalEntry({
            ...commonEntry,
            debit: trans.receivable,
            account: receivableAccount.id,
          });
          const saleIncomeEntry: JournalEntry = new JournalEntry({
            ...commonEntry,
            credit: trans.income,
            account: trans.incomeAccountId,
          });
          this.journal.debit(receivableEntry);
          this.journal.credit(saleIncomeEntry);
          break;
      }
    });
  }

  /**
   * 
   * @param {string} referenceType -
   * @param {number} referenceId -
   * @param {ISaleInvoice[]} sales -
   */
  public async inventoryEntries(
    transactions: IInventoryCostEntity[], 
  ) {
    const receivableAccount = { id: 10 };
    const payableAccount = { id: 11 };

    transactions.forEach((sale: IInventoryCostEntity) => {
      const commonEntry = {
        date: sale.date,
        referenceId: sale.referenceId,
        referenceType: sale.referenceType,
      };
      switch(sale.referenceType) {
        case 'Bill':
          const inventoryDebit: JournalEntry = new JournalEntry({
            ...commonEntry,
            debit: sale.inventory,
            account: sale.inventoryAccount,          
          });
          const payableEntry: JournalEntry = new JournalEntry({
            ...commonEntry,
            credit: sale.inventory,
            account: payableAccount.id,
          });
          this.journal.debit(inventoryDebit);
          this.journal.credit(payableEntry);
          break;
        case 'SaleInvoice':
          const receivableEntry: JournalEntry = new JournalEntry({
            ...commonEntry,
            debit: sale.income,
            account: receivableAccount.id,
          });
          const incomeEntry: JournalEntry = new JournalEntry({
            ...commonEntry,
            credit: sale.income,
            account: sale.incomeAccount,
          });
          // Cost journal transaction.
          const costEntry: JournalEntry = new JournalEntry({
            ...commonEntry,
            debit: sale.cost,
            account: sale.costAccount,
          });
          const inventoryCredit: JournalEntry = new JournalEntry({
            ...commonEntry,
            credit: sale.cost,
            account: sale.inventoryAccount,          
          });
          this.journal.debit(receivableEntry);
          this.journal.debit(costEntry);

          this.journal.credit(incomeEntry);
          this.journal.credit(inventoryCredit);
          break;
      }
    });
  }
}