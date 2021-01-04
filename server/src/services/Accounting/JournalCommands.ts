import { sumBy, chain } from 'lodash';
import moment, { LongDateFormatKey } from 'moment';
import { IBill, IManualJournalEntry, ISystemUser } from 'interfaces';
import JournalPoster from './JournalPoster';
import JournalEntry from './JournalEntry';
import { AccountTransaction } from 'models';
import {
  IInventoryTransaction,
  IManualJournal,
  IExpense,
  IExpenseCategory,
  IItem,
  ISaleInvoice,
  IInventoryLotCost,
  IItemEntry,
} from 'interfaces';

interface IInventoryCostEntity {
  date: Date;

  referenceType: string;
  referenceId: number;

  costAccount: number;
  incomeAccount: number;
  inventoryAccount: number;

  inventory: number;
  cost: number;
  income: number;
}

interface NonInventoryJEntries {
  date: Date;

  referenceType: string;
  referenceId: number;

  receivable: number;
  payable: number;

  incomeAccountId: number;
  income: number;

  costAccountId: number;
  cost: number;
}

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
   * Records the bill journal entries.
   * @param {IBill} bill
   * @param {boolean} override - Override the old bill entries.
   */
  async bill(bill: IBill, override: boolean = false): Promise<void> {
    const { transactionsRepository, accountRepository } = this.repositories;
    const { Item, ItemEntry } = this.models;

    const entriesItemsIds = bill.entries.map((entry) => entry.itemId);

    // Retrieve the bill transaction items.
    const storedItems = await Item.query().whereIn('id', entriesItemsIds);

    const storedItemsMap = new Map(storedItems.map((item) => [item.id, item]));
    const payableAccount = await accountRepository.findOne({
      slug: 'accounts-payable',
    });
    const formattedDate = moment(bill.billDate).format('YYYY-MM-DD');

    const commonJournalMeta = {
      debit: 0,
      credit: 0,
      referenceId: bill.id,
      referenceType: 'Bill',
      date: formattedDate,
      userId: bill.userId,
    };
    // Overrides the old bill entries.
    if (override) {
      const entries = await transactionsRepository.journal({
        referenceType: ['Bill'],
        referenceId: [bill.id],
      });
      this.journal.fromTransactions(entries);
      this.journal.removeEntries();
    }
    const payableEntry = new JournalEntry({
      ...commonJournalMeta,
      credit: bill.amount,
      account: payableAccount.id,
      contactId: bill.vendorId,
      contactType: 'Vendor',
      index: 1,
    });
    this.journal.credit(payableEntry);

    bill.entries.forEach((entry, index) => {
      const item: IItem = storedItemsMap.get(entry.itemId);
      const amount = ItemEntry.calcAmount(entry);

      const debitEntry = new JournalEntry({
        ...commonJournalMeta,
        debit: amount,
        account:
          ['inventory'].indexOf(item.type) !== -1
            ? item.inventoryAccountId
            : item.costAccountId,
        index: index + 2,
      });
      this.journal.debit(debitEntry);
    });
  }

  /**
   * Customer opening balance journals.
   * @param {number} customerId
   * @param {number} openingBalance
   */
  async customerOpeningBalance(
    customerId: number,
    openingBalance: number,
    openingBalanceAt: Date | string,
    userId: number
  ) {
    const { accountRepository } = this.repositories;

    const openingBalanceAccount = await accountRepository.findOne({
      slug: 'opening-balance',
    });
    const receivableAccount = await accountRepository.findOne({
      slug: 'accounts-receivable',
    });

    const commonEntry = {
      referenceType: 'CustomerOpeningBalance',
      referenceId: customerId,
      contactType: 'Customer',
      contactId: customerId,
      date: openingBalanceAt,
      userId,
    };
    const debitEntry = new JournalEntry({
      ...commonEntry,
      credit: 0,
      debit: openingBalance,
      account: receivableAccount.id,
      index: 1,
    });
    const creditEntry = new JournalEntry({
      ...commonEntry,
      credit: openingBalance,
      debit: 0,
      account: openingBalanceAccount.id,
      index: 2,
    });
    this.journal.debit(debitEntry);
    this.journal.credit(creditEntry);
  }

  /**
   * Vendor opening balance journals
   * @param {number} vendorId
   * @param {number} openingBalance
   * @param {Date|string} openingBalanceAt
   * @param {number} authorizedUserId
   */
  async vendorOpeningBalance(
    vendorId: number,
    openingBalance: number,
    openingBalanceAt: Date | string,
    authorizedUserId: ISystemUser
  ) {
    const { accountRepository } = this.repositories;

    const payableAccount = await accountRepository.findOne({
      slug: 'accounts-payable',
    });
    const otherCost = await accountRepository.findOne({
      slug: 'other-expenses',
    });

    const commonEntry = {
      referenceType: 'VendorOpeningBalance',
      referenceId: vendorId,
      contactType: 'Vendor',
      contactId: vendorId,
      date: openingBalanceAt,
      userId: authorizedUserId,
    };
    const creditEntry = new JournalEntry({
      ...commonEntry,
      account: payableAccount.id,
      credit: openingBalance,
      debit: 0,
      index: 1,
    });
    const debitEntry = new JournalEntry({
      ...commonEntry,
      account: otherCost.id,
      debit: openingBalance,
      credit: 0,
      index: 2,
    });
    this.journal.debit(debitEntry);
    this.journal.credit(creditEntry);
  }

  /**
   * Writes journal entries of expense model object.
   * @param {IExpense} expense
   */
  expense(expense: IExpense, userId: number) {
    const mixinEntry = {
      referenceType: 'Expense',
      referenceId: expense.id,
      date: expense.paymentDate,
      userId,
      draft: !expense.publishedAt,
    };
    const paymentJournalEntry = new JournalEntry({
      credit: expense.totalAmount,
      account: expense.paymentAccountId,
      index: 1,
      ...mixinEntry,
    });
    this.journal.credit(paymentJournalEntry);

    expense.categories.forEach((category: IExpenseCategory, index) => {
      const expenseJournalEntry = new JournalEntry({
        account: category.expenseAccountId,
        debit: category.amount,
        note: category.description,
        ...mixinEntry,
        index: index + 2,
      });
      this.journal.debit(expenseJournalEntry);
    });
  }

  /**
   * Reverts the jouranl entries.
   * @param {number|number[]} referenceId - Reference id.
   * @param {string} referenceType - Reference type.
   */
  async revertJournalEntries(
    referenceId: number | number[],
    referenceType: string
  ) {
    const { AccountTransaction } = this.models;

    const transactions = await AccountTransaction.query()
      .where('reference_type', referenceType)
      .whereIn(
        'reference_id',
        Array.isArray(referenceId) ? referenceId : [referenceId]
      )
      .withGraphFetched('account.type');

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
    const { transactionsRepository } = this.repositories;

    const transactions = await transactionsRepository.journal({
      fromDate: startingDate,
      referenceType: ['SaleInvoice'],
      index: [3, 4],
    });
    console.log(transactions);

    this.journal.fromTransactions(transactions);
    this.journal.removeEntries();
  }

  /**
   * Reverts sale invoice the income journal entries.
   * @param {number} saleInvoiceId 
   */
  async revertInvoiceIncomeEntries(
    saleInvoiceId: number,
  ) {
    const { transactionsRepository } = this.repositories;

    const transactions = await transactionsRepository.journal({
      referenceType: ['SaleInvoice'],
      referenceId: [saleInvoiceId],
    });
    this.journal.fromTransactions(transactions);
    this.journal.removeEntries();
  }

  /**
   * Writes journal entries from manual journal model object.
   * @param {IManualJournal} manualJournalObj
   * @param {number} manualJournalId
   */
  async manualJournal(manualJournalObj: IManualJournal) {
    manualJournalObj.entries.forEach((entry: IManualJournalEntry) => {
      const jouranlEntry = new JournalEntry({
        debit: entry.debit,
        credit: entry.credit,
        account: entry.accountId,
        referenceType: 'Journal',
        referenceId: manualJournalObj.id,
        contactType: entry.contactType,
        contactId: entry.contactId,
        note: entry.note,
        date: manualJournalObj.date,
        userId: manualJournalObj.userId,
        draft: !manualJournalObj.status,
        index: entry.index,
      });
      if (entry.debit) {
        this.journal.debit(jouranlEntry);
      } else {
        this.journal.credit(jouranlEntry);
      }
    });
  }

  /**
   * Writes journal entries for given sale invoice.
   * -------
   * - Cost of goods sold -> Debit -> YYYY
   *    - Inventory assets -> Credit -> YYYY
   *
   * @param {ISaleInvoice} saleInvoice
   * @param {JournalPoster} journal
   */
  saleInvoiceInventoryCost(
    inventoryCostLot: IInventoryLotCost & { item: IItem }
  ) {
    const commonEntry = {
      referenceType: 'SaleInvoice',
      referenceId: inventoryCostLot.transactionId,
      date: inventoryCostLot.date,
    };
    // XXX Debit - Cost account.
    const costEntry = new JournalEntry({
      ...commonEntry,
      debit: inventoryCostLot.cost,
      account: inventoryCostLot.item.costAccountId,
      index: 3,
    });
    // XXX Credit - Inventory account.
    const inventoryEntry = new JournalEntry({
      ...commonEntry,
      credit: inventoryCostLot.cost,
      account: inventoryCostLot.item.inventoryAccountId,
      index: 4,
    });
    this.journal.credit(inventoryEntry);
    this.journal.debit(costEntry);
  }

  /**
   * Writes the sale invoice income journal entries.
   * -----
   * - Receivable accounts -> Debit -> XXXX
   *    - Income -> Credit -> XXXX
   * 
   * @param {ISaleInvoice} saleInvoice
   * @param {number} receivableAccountsId
   * @param {number} authorizedUserId
   */
  async saleInvoiceIncomeEntries(
    saleInvoice: ISaleInvoice & {
      entries: IItemEntry & { item: IItem };
    },
    receivableAccountId: number
  ): Promise<void> {
    const commonEntry = {
      referenceType: 'SaleInvoice',
      referenceId: saleInvoice.id,
      date: saleInvoice.invoiceDate,
      userId: saleInvoice.userId,
    };
    // XXX Debit - Receivable account.
    const receivableEntry = new JournalEntry({
      ...commonEntry,
      debit: saleInvoice.balance,
      account: receivableAccountId,
      index: 1,
    });
    this.journal.debit(receivableEntry);

    saleInvoice.entries.forEach(
      (entry: IItemEntry & { item: IItem }, index: number) => {
        const income: number = entry.quantity * entry.rate;

        // XXX Credit - Income account.
        const incomeEntry = new JournalEntry({
          ...commonEntry,
          credit: income,
          account: entry.item.sellAccountId,
          note: entry.description,
          index: index + 2,
        });
        this.journal.credit(incomeEntry);
      }
    );
  }
}
