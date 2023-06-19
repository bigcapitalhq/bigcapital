import { omit, get, chain } from 'lodash';
import moment from 'moment';
import { Container } from 'typedi';
import async from 'async';
import JournalEntry from '@/services/Accounting/JournalEntry';
import TenancyService from '@/services/Tenancy/TenancyService';
import {
  IJournalEntry,
  IJournalPoster,
  IAccountChange,
  IAccountsChange,
  TEntryType,
} from '@/interfaces';
import Knex from 'knex';

const CONTACTS_CONFIG = [
  {
    accountBySlug: 'accounts-receivable',
    contactService: 'customer',
    assignRequired: true,
  },
  {
    accountBySlug: 'accounts-payable',
    contactService: 'vendor',
    assignRequired: true,
  },
];

export default class JournalPoster implements IJournalPoster {
  tenantId: number;
  tenancy: TenancyService;
  logger: any;
  models: any;
  repositories: any;

  deletedEntriesIds: number[] = [];
  entries: IJournalEntry[] = [];
  balancesChange: IAccountsChange = {};
  accountsDepGraph: IAccountsChange;

  accountsBalanceTable: { [key: number]: number } = {};
  contactsBalanceTable: {
    [key: number]: { credit: number; debit: number }[];
  } = {};
  saveContactBalanceQueue: any;

  /**
   * Journal poster constructor.
   * @param {number} tenantId -
   */
  constructor(tenantId: number, accountsGraph?: any, trx?: Knex.Transaction) {
    this.initTenancy();

    this.tenantId = tenantId;
    this.models = this.tenancy.models(tenantId);
    this.repositories = this.tenancy.repositories(tenantId);

    if (accountsGraph) {
      this.accountsDepGraph = accountsGraph;
    }
    this.trx = trx;
    this.saveContactBalanceQueue = async.queue(
      this.saveContactBalanceChangeTask.bind(this),
      10
    );
  }

  /**
   * Initial tenancy.
   * @private
   */
  private initTenancy() {
    try {
      this.tenancy = Container.get(TenancyService);
      this.logger = Container.get('logger');
    } catch (exception) {
      throw new Error('Should execute this class inside tenancy area.');
    }
  }

  /**
   * Async initialize accounts dependency graph.
   * @private
   * @returns {Promise<void>}
   */
  public async initAccountsDepGraph(): Promise<void> {
    const { accountRepository } = this.repositories;

    if (!this.accountsDepGraph) {
      const accountsDepGraph = await accountRepository.getDependencyGraph();
      this.accountsDepGraph = accountsDepGraph;
    }
  }

  /**
   * Detarmines the ledger is empty.
   */
  public isEmpty() {
    return this.entries.length === 0;
  }

  /**
   * Writes the credit entry for the given account.
   * @param {IJournalEntry} entry -
   */
  public credit(entryModel: IJournalEntry): void {
    if (entryModel instanceof JournalEntry === false) {
      throw new Error('The entry is not instance of JournalEntry.');
    }
    this.entries.push(entryModel.entry);
    this.setAccountBalanceChange(entryModel.entry);
    this.setContactBalanceChange(entryModel.entry);
  }

  /**
   * Writes the debit entry for the given account.
   * @param {JournalEntry} entry -
   */
  public debit(entryModel: IJournalEntry): void {
    if (entryModel instanceof JournalEntry === false) {
      throw new Error('The entry is not instance of JournalEntry.');
    }
    this.entries.push(entryModel.entry);
    this.setAccountBalanceChange(entryModel.entry);
    this.setContactBalanceChange(entryModel.entry);
  }

  /**
   * Sets the contact balance change.
   */
  private setContactBalanceChange(entry) {
    if (!entry.contactId) {
      return;
    }
    const change = {
      debit: entry.debit || 0,
      credit: entry.credit || 0,
      account: entry.account,
    };
    if (!this.contactsBalanceTable[entry.contactId]) {
      this.contactsBalanceTable[entry.contactId] = [];
    }
    this.contactsBalanceTable[entry.contactId].push(change);
  }

  /**
   * Save contacts balance change.
   */
  async saveContactsBalance() {
    await this.initAccountsDepGraph();

    const balanceChanges = Object.entries(this.contactsBalanceTable).map(
      ([contactId, entries]) => ({
        contactId,
        entries: entries.filter((entry) => {
          const account = this.accountsDepGraph.getNodeData(entry.account);

          return (
            account &&
            CONTACTS_CONFIG.some((config) => {
              return config.accountBySlug === account.slug;
            })
          );
        }),
      })
    );

    const balanceEntries = chain(balanceChanges)
      .map((change) =>
        change.entries.map((entry) => ({
          ...entry,
          contactId: change.contactId,
        }))
      )
      .flatten()
      .value();

    return this.saveContactBalanceQueue.pushAsync(balanceEntries);
  }

  /**
   * Saves contact balance change task.
   * @param {number} contactId - Contact id.
   * @param {number} credit - Credit amount.
   * @param {number} debit - Debit amount.
   */
  async saveContactBalanceChangeTask({ contactId, credit, debit }) {
    const { contactRepository } = this.repositories;

    const contact = await contactRepository.findOneById(contactId);
    let balanceChange = 0;

    if (contact.contactNormal === 'credit') {
      balanceChange += credit - debit;
    } else {
      balanceChange += debit - credit;
    }
    // Contact change balance.
    await contactRepository.changeNumber(
      { id: contactId },
      'balance',
      balanceChange,
      this.trx
    );
  }

  /**
   * Sets account balance change.
   * @param {JournalEntry} entry
   * @param {String} type
   */
  private setAccountBalanceChange(entry: IJournalEntry): void {
    const accountChange: IAccountChange = {
      debit: entry.debit,
      credit: entry.credit,
    };
    this._setAccountBalanceChange(entry.account, accountChange);
  }

  /**
   * Sets account balance change.
   * @private
   * @param {number} accountId -
   * @param {IAccountChange} accountChange
   */
  private _setAccountBalanceChange(
    accountId: number,
    accountChange: IAccountChange
  ) {
    this.balancesChange = this.accountBalanceChangeReducer(
      this.balancesChange,
      accountId,
      accountChange
    );
  }

  /**
   * Accounts balance change reducer.
   * @param {IAccountsChange} balancesChange
   * @param {number} accountId
   * @param {IAccountChange} accountChange
   * @return {IAccountChange}
   */
  private accountBalanceChangeReducer(
    balancesChange: IAccountsChange,
    accountId: number,
    accountChange: IAccountChange
  ) {
    const change = { ...balancesChange };

    if (!change[accountId]) {
      change[accountId] = { credit: 0, debit: 0 };
    }
    if (accountChange.credit) {
      change[accountId].credit += accountChange.credit;
    }
    if (accountChange.debit) {
      change[accountId].debit += accountChange.debit;
    }
    return change;
  }

  /**
   * Converts balance changes to array.
   * @private
   * @param {IAccountsChange} accountsChange -
   * @return {Promise<{ account: number, change: number }>}
   */
  private async convertBalanceChangesToArr(
    accountsChange: IAccountsChange
  ): Promise<{ account: number; change: number }[]> {
    const mappedList: { account: number; change: number }[] = [];
    const accountsIds: number[] = Object.keys(accountsChange).map((id) =>
      parseInt(id, 10)
    );

    await Promise.all(
      accountsIds.map(async (account: number) => {
        const accountChange = accountsChange[account];
        const accountNode = this.accountsDepGraph.getNodeData(account);
        const normal = accountNode.accountNormal;

        let change = 0;

        if (accountChange.credit) {
          change +=
            normal === 'credit'
              ? accountChange.credit
              : -1 * accountChange.credit;
        }
        if (accountChange.debit) {
          change +=
            normal === 'debit' ? accountChange.debit : -1 * accountChange.debit;
        }
        mappedList.push({ account, change });
      })
    );
    return mappedList;
  }

  /**
   * Saves the balance change of journal entries.
   * @returns {Promise<void>}
   */
  public async saveBalance() {
    await this.initAccountsDepGraph();

    const { Account } = this.models;
    const accountsChange = this.balanceChangeWithDepends(this.balancesChange);
    const balancesList = await this.convertBalanceChangesToArr(accountsChange);
    const balancesAccounts = balancesList.map((b) => b.account);

    // Ensure the accounts has atleast zero in amount.
    await Account.query(this.trx)
      .where('amount', null)
      .whereIn('id', balancesAccounts)
      .patch({ amount: 0 });

    const balanceUpdateOpers: Promise<void>[] = [];

    balancesList.forEach((balance: { account: number; change: number }) => {
      const method: string = balance.change < 0 ? 'decrement' : 'increment';

      this.logger.info(
        '[journal_poster] increment/decrement account balance.',
        {
          balance,
          tenantId: this.tenantId,
        }
      );
      const query = Account.query(this.trx)
        [method]('amount', Math.abs(balance.change))
        .where('id', balance.account);

      balanceUpdateOpers.push(query);
    });

    await Promise.all(balanceUpdateOpers);
    this.resetAccountsBalanceChange();
  }

  /**
   * Changes all accounts that dependencies of changed accounts.
   * @param {IAccountsChange} accountsChange
   * @returns {IAccountsChange}
   */
  private balanceChangeWithDepends(
    accountsChange: IAccountsChange
  ): IAccountsChange {
    const accountsIds = Object.keys(accountsChange);
    let changes: IAccountsChange = {};

    accountsIds.forEach((accountId) => {
      const accountChange = accountsChange[accountId];
      const depAccountsIds = this.accountsDepGraph.dependantsOf(accountId);

      [accountId, ...depAccountsIds].forEach((account) => {
        changes = this.accountBalanceChangeReducer(
          changes,
          account,
          accountChange
        );
      });
    });
    return changes;
  }

  /**
   * Resets accounts balance change.
   * @private
   */
  private resetAccountsBalanceChange() {
    this.balancesChange = {};
  }

  /**
   * Saves the stacked journal entries to the storage.
   * @returns {Promise<void>}
   */
  public async saveEntries() {
    const { transactionsRepository } = this.repositories;
    const saveOperations: Promise<void>[] = [];

    this.logger.info('[journal] trying to insert accounts transactions.');

    this.entries.forEach((entry) => {
      const oper = transactionsRepository.create(
        {
          accountId: entry.account,
          ...omit(entry, ['account']),
        },
        this.trx
      );
      saveOperations.push(oper);
    });
    await Promise.all(saveOperations);
  }

  /**
   * Reverses the stacked journal entries.
   */
  public reverseEntries() {
    const reverseEntries: IJournalEntry[] = [];

    this.entries.forEach((entry) => {
      const reverseEntry = { ...entry };

      if (entry.credit) {
        reverseEntry.debit = entry.credit;
      }
      if (entry.debit) {
        reverseEntry.credit = entry.debit;
      }
      reverseEntries.push(reverseEntry);
    });
    this.entries = reverseEntries;
  }

  /**
   * Removes all stored entries or by the given in ids.
   * @param {Array} ids -
   */
  removeEntries(ids: number[] = []) {
    const targetIds = ids.length <= 0 ? this.entries.map((e) => e.id) : ids;
    const removeEntries = this.entries.filter(
      (e) => targetIds.indexOf(e.id) !== -1
    );
    this.entries = this.entries.filter((e) => targetIds.indexOf(e.id) === -1);

    removeEntries.forEach((entry) => {
      entry.credit = -1 * entry.credit;
      entry.debit = -1 * entry.debit;

      this.setAccountBalanceChange(entry);
      this.setContactBalanceChange(entry);
    });
    this.deletedEntriesIds.push(...removeEntries.map((entry) => entry.id));
  }

  /**
   * Delete all the stacked entries.
   * @return {Promise<void>}
   */
  public async deleteEntries() {
    const { transactionsRepository } = this.repositories;

    if (this.deletedEntriesIds.length > 0) {
      await transactionsRepository.deleteWhereIdIn(
        this.deletedEntriesIds,
        this.trx
      );
    }
  }

  /**
   * Load fetched accounts journal entries.
   * @param {IJournalEntry[]} entries -
   */
  fromTransactions(transactions) {
    transactions.forEach((transaction) => {
      this.entries.push({
        ...transaction,
        referenceTypeFormatted: transaction.referenceTypeFormatted,
        account: transaction.accountId,
        accountNormal: get(transaction, 'account.accountNormal'),
      });
    });
  }

  /**
   * Calculates the entries balance change.
   * @public
   */
  public calculateEntriesBalanceChange() {
    this.entries.forEach((entry) => {
      if (entry.credit) {
        this.setAccountBalanceChange(entry, 'credit');
      }
      if (entry.debit) {
        this.setAccountBalanceChange(entry, 'debit');
      }
    });
  }

  static fromTransactions(entries, ...args: [number, ...any]) {
    const journal = new this(...args);
    journal.fromTransactions(entries);

    return journal;
  }

  /**
   * Retrieve the closing balance for the given account and closing date.
   * @param  {Number} accountId -
   * @param  {Date} closingDate -
   * @param  {string} dataType? -
   * @return {number}
   */
  getClosingBalance(
    accountId: number,
    closingDate: Date | string,
    dateType: string = 'day'
  ): number {
    let closingBalance = 0;
    const momentClosingDate = moment(closingDate);

    this.entries.forEach((entry) => {
      // Can not continue if not before or event same closing date.
      if (
        (!momentClosingDate.isAfter(entry.date, dateType) &&
          !momentClosingDate.isSame(entry.date, dateType)) ||
        (entry.account !== accountId && accountId)
      ) {
        return;
      }
      if (entry.accountNormal === 'credit') {
        closingBalance += entry.credit ? entry.credit : -1 * entry.debit;
      } else if (entry.accountNormal === 'debit') {
        closingBalance += entry.debit ? entry.debit : -1 * entry.credit;
      }
    });
    return closingBalance;
  }

  /**
   * Retrieve the given account balance with dependencies accounts.
   * @param {Number} accountId -
   * @param {Date} closingDate -
   * @param {String} dateType -
   * @return {Number}
   */
  getAccountBalance(
    accountId: number,
    closingDate: Date | string,
    dateType: string
  ) {
    const accountNode = this.accountsDepGraph.getNodeData(accountId);
    const depAccountsIds = this.accountsDepGraph.dependenciesOf(accountId);
    const depAccounts = depAccountsIds.map((id) =>
      this.accountsDepGraph.getNodeData(id)
    );

    let balance: number = 0;

    [...depAccounts, accountNode].forEach((account) => {
      const closingBalance = this.getClosingBalance(
        account.id,
        closingDate,
        dateType
      );
      this.accountsBalanceTable[account.id] = closingBalance;
      balance += this.accountsBalanceTable[account.id];
    });
    return balance;
  }

  /**
   * Retrieve the credit/debit sumation for the given account and date.
   * @param {Number} account -
   * @param {Date|String} closingDate -
   */
  getTrialBalance(accountId, closingDate) {
    const momentClosingDate = moment(closingDate);
    const result = {
      credit: 0,
      debit: 0,
      balance: 0,
    };
    this.entries.forEach((entry) => {
      if (
        (!momentClosingDate.isAfter(entry.date, 'day') &&
          !momentClosingDate.isSame(entry.date, 'day')) ||
        (entry.account !== accountId && accountId)
      ) {
        return;
      }
      result.credit += entry.credit;
      result.debit += entry.debit;

      if (entry.accountNormal === 'credit') {
        result.balance += entry.credit - entry.debit;
      } else if (entry.accountNormal === 'debit') {
        result.balance += entry.debit - entry.credit;
      }
    });
    return result;
  }

  /**
   * Retrieve trial balance of the given account with depends.
   * @param {Number} accountId
   * @param {Date} closingDate
   * @param {String} dateType
   * @return {Number}
   */

  getTrialBalanceWithDepends(
    accountId: number,
    closingDate: Date,
    dateType: string
  ) {
    const accountNode = this.accountsDepGraph.getNodeData(accountId);
    const depAccountsIds = this.accountsDepGraph.dependenciesOf(accountId);
    const depAccounts = depAccountsIds.map((id) =>
      this.accountsDepGraph.getNodeData(id)
    );
    const trialBalance = { credit: 0, debit: 0, balance: 0 };

    [...depAccounts, accountNode].forEach((account) => {
      const _trialBalance = this.getTrialBalance(
        account.id,
        closingDate,
        dateType
      );

      trialBalance.credit += _trialBalance.credit;
      trialBalance.debit += _trialBalance.debit;
      trialBalance.balance += _trialBalance.balance;
    });
    return trialBalance;
  }

  getContactTrialBalance(
    accountId: number,
    contactId: number,
    contactType: string,
    closingDate?: Date | string,
    openingDate?: Date | string
  ) {
    const momentClosingDate = moment(closingDate);
    const momentOpeningDate = moment(openingDate);
    const trial = {
      credit: 0,
      debit: 0,
      balance: 0,
    };

    this.entries.forEach((entry) => {
      if (
        (closingDate &&
          !momentClosingDate.isAfter(entry.date, 'day') &&
          !momentClosingDate.isSame(entry.date, 'day')) ||
        (openingDate &&
          !momentOpeningDate.isBefore(entry.date, 'day') &&
          !momentOpeningDate.isSame(entry.date)) ||
        (accountId && entry.account !== accountId) ||
        (contactId && entry.contactId !== contactId) ||
        entry.contactType !== contactType
      ) {
        return;
      }
      if (entry.credit) {
        trial.balance -= entry.credit;
        trial.credit += entry.credit;
      }
      if (entry.debit) {
        trial.balance += entry.debit;
        trial.debit += entry.debit;
      }
    });
    return trial;
  }

  /**
   * Retrieve total balance of the given customer/vendor contact.
   * @param {Number} accountId
   * @param {Number} contactId
   * @param {String} contactType
   * @param {Date} closingDate
   */
  getContactBalance(
    accountId: number,
    contactId: number,
    contactType: string,
    closingDate: Date,
    openingDate: Date
  ) {
    const momentClosingDate = moment(closingDate);
    let balance = 0;

    this.entries.forEach((entry) => {
      if (
        (closingDate &&
          !momentClosingDate.isAfter(entry.date, 'day') &&
          !momentClosingDate.isSame(entry.date, 'day')) ||
        (entry.account !== accountId && accountId) ||
        (contactId && entry.contactId !== contactId) ||
        entry.contactType !== contactType
      ) {
        return;
      }
      if (entry.credit) {
        balance -= entry.credit;
      }
      if (entry.debit) {
        balance += entry.debit;
      }
    });
    return balance;
  }

  getAccountEntries(accountId: number) {
    return this.entries.filter((entry) => entry.account === accountId);
  }

  /**
   * Retrieve account entries with depends accounts.
   * @param {number} accountId - 
   */
  getAccountEntriesWithDepends(accountId: number) {
    const depAccountsIds = this.accountsDepGraph.dependenciesOf(accountId);
    const accountsIds = [accountId, ...depAccountsIds];

    return this.entries.filter(
      (entry) => accountsIds.indexOf(entry.account) !== -1
    );
  }

  /**
   * Retrieve total balance of the given customer/vendor contact.
   * @param {Number} accountId
   * @param {Number} contactId
   * @param {String} contactType
   * @param {Date} closingDate
   */
  getEntriesBalance(entries) {
    let balance = 0;

    entries.forEach((entry) => {
      if (entry.credit) {
        balance -= entry.credit;
      }
      if (entry.debit) {
        balance += entry.debit;
      }
    });
    return balance;
  }

  getContactEntries(contactId: number, openingDate: Date, closingDate?: Date) {
    const momentClosingDate = moment(closingDate);
    const momentOpeningDate = moment(openingDate);

    return this.entries.filter((entry) => {
      if (
        (closingDate &&
          !momentClosingDate.isAfter(entry.date, 'day') &&
          !momentClosingDate.isSame(entry.date, 'day')) ||
        (openingDate &&
          !momentOpeningDate.isBefore(entry.date, 'day') &&
          !momentOpeningDate.isSame(entry.date)) ||
        entry.contactId === contactId
      ) {
        return true;
      }
      return false;
    });
  }
}
