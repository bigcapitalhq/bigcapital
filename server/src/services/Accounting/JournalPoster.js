import { pick } from 'lodash';
import moment from 'moment';
import JournalEntry from '@/services/Accounting/JournalEntry';
import AccountTransaction from '@/models/AccountTransaction';
import AccountBalance from '@/models/AccountBalance';
import { promiseSerial } from '@/utils';
import Account from '@/models/Account';
import NestedSet from '../../collection/NestedSet';

export default class JournalPoster {
  /**
   * Journal poster constructor.
   */
  constructor(accountsGraph) {
    this.entries = [];
    this.balancesChange = {};
    this.deletedEntriesIds = [];

    this.accountsBalanceTable = {};
    this.accountsGraph = accountsGraph;
  }

  /**
   * Writes the credit entry for the given account.
   * @param {JournalEntry} entry -
   */
  credit(entryModel) {
    if (entryModel instanceof JournalEntry === false) {
      throw new Error('The entry is not instance of JournalEntry.');
    }
    this.entries.push(entryModel.entry);
    this.setAccountBalanceChange(entryModel.entry, 'credit');
  }

  /**
   * Writes the debit entry for the given account.
   * @param {JournalEntry} entry -
   */
  debit(entryModel) {
    if (entryModel instanceof JournalEntry === false) {
      throw new Error('The entry is not instance of JournalEntry.');
    }
    this.entries.push(entryModel.entry);
    this.setAccountBalanceChange(entryModel.entry, 'debit');
  }

  /**
   * Sets account balance change.
   * @param {JournalEntry} entry
   * @param {String} type
   */
  setAccountBalanceChange(entry, entryType) {
    const depAccountsIds = this.accountsGraph.dependantsOf(entry.account);

    const balanceChangeEntry = {
      debit: entry.debit,
      credit: entry.credit,
      entryType,
      accountNormal: entry.accountNormal,
    };
    this._setAccountBalanceChange({
      ...balanceChangeEntry,
      accountId: entry.account,
    });

    if (entry.contactType && entry.contactId) {
      
    }

    // Effect parent accounts of the given account id.
    depAccountsIds.forEach((accountId) => {
      this._setAccountBalanceChange({
        ...balanceChangeEntry,
        accountId,
      });
    });
  }

  /**
   * Sets account balance change.
   * @private
   */
  _setAccountBalanceChange({
    accountId,
    accountNormal,
    debit,
    credit,
    entryType,
  }) {
    if (!this.balancesChange[accountId]) {
      this.balancesChange[accountId] = 0;
    }
    let change = 0;

    if (accountNormal === 'credit') {
      change = entryType === 'credit' ? credit : -1 * debit;
    } else if (accountNormal === 'debit') {
      change = entryType === 'debit' ? debit : -1 * credit;
    }
    this.balancesChange[accountId] += change;
  }

  /**
   * Set contact balance change.
   * @param {Object} param -  
   */
  _setContactBalanceChange({
    contactType,
    contactId,

    accountNormal,
    debit,
    credit,
    entryType,
  }) {

  }

  /**
   * Mapping the balance change to list.
   */
  mapBalanceChangesToList() {
    const mappedList = [];

    Object.keys(this.balancesChange).forEach((accountId) => {
      const balance = this.balancesChange[accountId];

      mappedList.push({
        account_id: accountId,
        amount: balance,
      });
    });
    return mappedList;
  }

  /**
   * Saves the balance change of journal entries.
   */
  async saveBalance() {
    const balancesList = this.mapBalanceChangesToList();
    const balanceUpdateOpers = [];
    const balanceInsertOpers = [];
    const balanceFindOneOpers = [];
    let balanceAccounts = [];

    balancesList.forEach((balance) => {
      const oper = AccountBalance.tenant()
        .query()
        .findOne('account_id', balance.account_id);
      balanceFindOneOpers.push(oper);
    });
    balanceAccounts = await Promise.all(balanceFindOneOpers);

    balancesList.forEach((balance) => {
      const method = balance.amount < 0 ? 'decrement' : 'increment';

      // Detarmine if the account balance is already exists or not.
      const foundAccBalance = balanceAccounts.some(
        (account) => account && account.account_id === balance.account_id
      );

      if (foundAccBalance) {
        const query = AccountBalance.tenant()
          .query()
          [method]('amount', Math.abs(balance.amount))
          .where('account_id', balance.account_id);

        balanceUpdateOpers.push(query);
      } else {
        const query = AccountBalance.tenant().query().insert({
          account_id: balance.account_id,
          amount: balance.amount,
          currency_code: 'USD',
        });
        balanceInsertOpers.push(query);
      }
    });
    await Promise.all([...balanceUpdateOpers, ...balanceInsertOpers]);
  }

  /**
   * Saves the stacked journal entries to the storage.
   */
  async saveEntries() {
    const saveOperations = [];

    this.entries.forEach((entry) => {
      const oper = AccountTransaction.tenant()
        .query()
        .insert({
          accountId: entry.account,
          ...pick(entry, [
            'credit',
            'debit',
            'transactionType',
            'date',
            'userId',
            'referenceType',
            'referenceId',
            'note',
            'contactId',
            'contactType',
          ]),
        });
      saveOperations.push(() => oper);
    });
    await promiseSerial(saveOperations);
  }

  /**
   * Reverses the stacked journal entries.
   */
  reverseEntries() {
    const reverseEntries = [];

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
   *
   * @param {Array} ids -
   */
  removeEntries(ids = []) {
    const targetIds = ids.length <= 0 ? this.entries.map((e) => e.id) : ids;
    const removeEntries = this.entries.filter(
      (e) => targetIds.indexOf(e.id) !== -1
    );

    this.entries = this.entries.filter((e) => targetIds.indexOf(e.id) === -1);

    removeEntries.forEach((entry) => {
      entry.credit = -1 * entry.credit;
      entry.debit = -1 * entry.debit;

      this.setAccountBalanceChange(entry, entry.accountNormal);
    });
    this.deletedEntriesIds.push(...removeEntries.map((entry) => entry.id));
  }

  /**
   * Revert the given transactions.
   * @param {*} entries 
   */
  removeTransactions(entries) {
    this.loadEntries(entries);


    this.deletedEntriesIds.push(...entriesIDsShouldDel);
  }

  /**
   * Delete all the stacked entries.
   */
  async deleteEntries() {
    if (this.deletedEntriesIds.length > 0) {
      await AccountTransaction.tenant()
        .query()
        .whereIn('id', this.deletedEntriesIds)
        .delete();
    }
  }

  /**
   * Retrieve the closing balance for the given account and closing date.
   * @param {Number} accountId -
   * @param {Date} closingDate -
   */
  getClosingBalance(accountId, closingDate, dateType = 'day') {
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
   * @param {Number} accountId
   * @param {Date} closingDate
   * @param {String} dateType
   * @return {Number}
   */
  getAccountBalance(accountId, closingDate, dateType) {
    const accountNode = this.accountsGraph.getNodeData(accountId);
    const depAccountsIds = this.accountsGraph.dependenciesOf(accountId);
    const depAccounts = depAccountsIds.map((id) =>
      this.accountsGraph.getNodeData(id)
    );
    let balance = 0;

    [...depAccounts, accountNode].forEach((account) => {
      // if (!this.accountsBalanceTable[account.id]) {
      const closingBalance = this.getClosingBalance(
        account.id,
        closingDate,
        dateType
      );
      this.accountsBalanceTable[account.id] = closingBalance;
      // }
      balance += this.accountsBalanceTable[account.id];
    });
    return balance;
  }

  /**
   * Retrieve the credit/debit sumation for the given account and date.
   * @param {Number} account -
   * @param {Date|String} closingDate -
   */
  getTrialBalance(accountId, closingDate, dateType) {
    const momentClosingDate = moment(closingDate);
    const result = {
      credit: 0,
      debit: 0,
      balance: 0,
    };
    this.entries.forEach((entry) => {
      if (
        (!momentClosingDate.isAfter(entry.date, dateType) &&
          !momentClosingDate.isSame(entry.date, dateType)) ||
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

  getTrialBalanceWithDepands(accountId, closingDate, dateType) {
    const accountNode = this.accountsGraph.getNodeData(accountId);
    const depAccountsIds = this.accountsGraph.dependenciesOf(accountId);
    const depAccounts = depAccountsIds.map((id) =>
      this.accountsGraph.getNodeData(id)
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
    accountId,
    contactId,
    contactType,
    closingDate,
    openingDate
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
   * Retrieve total balnace of the given customer/vendor contact.
   * @param {Number} accountId
   * @param {Number} contactId
   * @param {String} contactType
   * @param {Date} closingDate
   */
  getContactBalance(
    accountId,
    contactId,
    contactType,
    closingDate,
    openingDate
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

  /**
   * Load fetched accounts journal entries.
   * @param {Array} entries -
   */
  loadEntries(entries) {
    entries.forEach((entry) => {
      this.entries.push({
        ...entry,
        account: entry.account ? entry.account.id : entry.accountId,
        accountNormal:
          entry.account && entry.account.type
            ? entry.account.type.normal
            : entry.accountNormal,
      });
    });
  }

  /**
   * Calculates the entries balance change.
   */
  calculateEntriesBalanceChange() {
    this.entries.forEach((entry) => {
      if (entry.credit) {
        this.setAccountBalanceChange(entry, 'credit');
      }
      if (entry.debit) {
        this.setAccountBalanceChange(entry, 'debit');
      }
    });
  }
}
