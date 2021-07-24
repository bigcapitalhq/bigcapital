import moment from 'moment';
import { sumBy } from 'lodash';
import {
  IBill,
  IManualJournalEntry,
  ISaleReceipt,
  ISystemUser,
  IAccount,
} from 'interfaces';
import JournalPoster from './JournalPoster';
import JournalEntry from './JournalEntry';
import {
  IManualJournal,
  IExpense,
  IExpenseCategory,
  IItem,
  ISaleInvoice,
  IInventoryLotCost,
  IItemEntry,
} from 'interfaces';
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
   * Records the bill journal entries.
   * @param {IBill} bill
   * @param {IAccount} payableAccount - 
   */
  bill(bill: IBill, payableAccount: IAccount): void {
    const commonJournalMeta = {
      debit: 0,
      credit: 0,
      referenceId: bill.id,
      referenceType: 'Bill',
      date: moment(bill.billDate).format('YYYY-MM-DD'),
      userId: bill.userId,
      referenceNumber: bill.referenceNo,
      transactionNumber: bill.billNumber,
      createdAt: bill.createdAt,
    };
    const payableEntry = new JournalEntry({
      ...commonJournalMeta,
      credit: bill.amount,
      account: payableAccount.id,
      contactId: bill.vendorId,
      index: 1,
    });
    this.journal.credit(payableEntry);

    bill.entries.forEach((entry, index) => {
      const landedCostAmount = sumBy(entry.allocatedCostEntries, 'cost');

      // Inventory or cost entry.
      const debitEntry = new JournalEntry({
        ...commonJournalMeta,
        debit: entry.amount + landedCostAmount,
        account:
          ['inventory'].indexOf(entry.item.type) !== -1
            ? entry.item.inventoryAccountId
            : entry.costAccountId,
        index: index + 2,
        itemId: entry.itemId,
        itemQuantity: entry.quantity,
      });
      this.journal.debit(debitEntry);
    });

    // Allocate cost entries journal entries.
    bill.locatedLandedCosts.forEach((landedCost) => {
      const creditEntry = new JournalEntry({
        ...commonJournalMeta,
        credit: landedCost.amount,
        account: landedCost.costAccountId,
      });
      this.journal.credit(creditEntry);
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

    const incomeAccount = await accountRepository.findOne({
      slug: 'other-income',
    });
    const receivableAccount = await accountRepository.findOne({
      slug: 'accounts-receivable',
    });

    const commonEntry = {
      referenceType: 'CustomerOpeningBalance',
      referenceId: customerId,
      date: openingBalanceAt,
      userId,
    };
    const debitEntry = new JournalEntry({
      ...commonEntry,
      credit: 0,
      debit: openingBalance,
      account: receivableAccount.id,
      contactId: customerId,
      index: 1,
    });
    const creditEntry = new JournalEntry({
      ...commonEntry,
      credit: openingBalance,
      debit: 0,
      account: incomeAccount.id,
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
      date: openingBalanceAt,
      userId: authorizedUserId,
    };
    const creditEntry = new JournalEntry({
      ...commonEntry,
      account: payableAccount.id,
      credit: openingBalance,
      debit: 0,
      index: 1,
      contactId: vendorId,
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
    const { transactionsRepository } = this.repositories;

    const transactions = await transactionsRepository.journal({
      fromDate: startingDate,
      referenceType: ['SaleInvoice'],
      indexGroup: 20
    });
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

  /**
   * Writes journal entries from manual journal model object.
   * @param {IManualJournal} manualJournalObj
   * @param {number} manualJournalId
   */
  async manualJournal(manualJournalObj: IManualJournal) {
    const commonEntry = {
      transaction_number: manualJournalObj.journalNumber,
      reference_number: manualJournalObj.reference,
      createdAt: manualJournalObj.createdAt,
    };
    manualJournalObj.entries.forEach((entry: IManualJournalEntry) => {
      const jouranlEntry = new JournalEntry({
        ...commonEntry,
        debit: entry.debit,
        credit: entry.credit,
        account: entry.accountId,
        referenceType: 'Journal',
        referenceId: manualJournalObj.id,
        contactId: entry.contactId,
        note: entry.note,
        date: manualJournalObj.date,
        userId: manualJournalObj.userId,
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
   * --------
   * @param {ISaleInvoice} saleInvoice
   * @param {JournalPoster} journal
   */
  saleInvoiceInventoryCost(
    inventoryCostLots: IInventoryLotCost &
      { item: IItem; itemEntry: IItemEntry }[]
  ) {
    const getIndexIncrement = increment(0);

    inventoryCostLots.forEach(
      (
        inventoryCostLot: IInventoryLotCost & {
          item: IItem;
          itemEntry: IItemEntry;
        }
      ) => {
        const commonEntry = {
          referenceType: inventoryCostLot.transactionType,
          referenceId: inventoryCostLot.transactionId,
          date: inventoryCostLot.date,
          indexGroup: 20,
          createdAt: inventoryCostLot.createdAt,
        };
        // XXX Debit - Cost account.
        const costEntry = new JournalEntry({
          ...commonEntry,
          debit: inventoryCostLot.cost,
          account: inventoryCostLot.costAccountId,
          itemId: inventoryCostLot.itemId,
          index: getIndexIncrement(),
        });
        // XXX Credit - Inventory account.
        const inventoryEntry = new JournalEntry({
          ...commonEntry,
          credit: inventoryCostLot.cost,
          account: inventoryCostLot.item.inventoryAccountId,
          itemId: inventoryCostLot.itemId,
          index: getIndexIncrement(),
        });
        this.journal.credit(inventoryEntry);
        this.journal.debit(costEntry);
      }
    );
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

      transactionNumber: saleInvoice.invoiceNo,
      referenceNumber: saleInvoice.referenceNo,

      createdAt: saleInvoice.createdAt,
      indexGroup: 10,
    };
    // XXX Debit - Receivable account.
    const receivableEntry = new JournalEntry({
      ...commonEntry,
      debit: saleInvoice.balance,
      account: receivableAccountId,
      contactId: saleInvoice.customerId,
      index: 1,
    });
    this.journal.debit(receivableEntry);

    saleInvoice.entries.forEach((entry: IItemEntry, index: number) => {
      const income: number = entry.quantity * entry.rate;

      // XXX Credit - Income account.
      const incomeEntry = new JournalEntry({
        ...commonEntry,
        credit: income,
        account: entry.sellAccountId,
        note: entry.description,
        index: index + 2,
        itemId: entry.itemId,
        itemQuantity: entry.quantity,
      });
      this.journal.credit(incomeEntry);
    });
  }

  /**
   * Writes the sale invoice income journal entries.
   * -----
   * - Deposit account -> Debit -> XXXX
   *    - Income -> Credit -> XXXX
   *
   * @param {ISaleInvoice} saleInvoice
   * @param {number} receivableAccountsId
   * @param {number} authorizedUserId
   */
  async saleReceiptIncomeEntries(
    saleReceipt: ISaleReceipt & {
      entries: IItemEntry & { item: IItem };
    }
  ): Promise<void> {
    const commonEntry = {
      referenceType: 'SaleReceipt',
      referenceId: saleReceipt.id,
      date: saleReceipt.receiptDate,
      userId: saleReceipt.userId,
      transactionNumber: saleReceipt.receiptNumber,
      referenceNumber: saleReceipt.referenceNo,
      createdAt: saleReceipt.createdAt,
    };
    // XXX Debit - Deposit account.
    const depositEntry = new JournalEntry({
      ...commonEntry,
      debit: saleReceipt.amount,
      account: saleReceipt.depositAccountId,
      index: 1,
    });
    this.journal.debit(depositEntry);

    saleReceipt.entries.forEach(
      (entry: IItemEntry & { item: IItem }, index: number) => {
        const income: number = entry.quantity * entry.rate;

        // XXX Credit - Income account.
        const incomeEntry = new JournalEntry({
          ...commonEntry,
          credit: income,
          account: entry.item.sellAccountId,
          note: entry.description,
          index: index + 2,
          itemId: entry.itemId,
          itemQuantity: entry.quantity,
        });
        this.journal.credit(incomeEntry);
      }
    );
  }
}
