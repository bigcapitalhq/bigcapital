import { pick } from 'lodash';
import moment from 'moment';
import JournalEntry from '@/services/Accounting/JournalEntry';
import AccountTransaction from '@/models/AccountTransaction';
import AccountBalance from '@/models/AccountBalance';
import {promiseSerial} from '@/utils';

export default class JournalPoster {
  /**
   * Journal poster constructor.
   */
  constructor() {
    this.entries = [];
    this.balancesChange = {};
    this.deletedEntriesIds = [];
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
  setAccountBalanceChange(entry, type) {
    if (!this.balancesChange[entry.account]) {
      this.balancesChange[entry.account] = 0;
    }
    let change = 0;

    if (entry.accountNormal === 'credit') {
      change = (type === 'credit') ? entry.credit : -1 * entry.debit;
    } else if (entry.accountNormal === 'debit') {
      change = (type === 'debit') ? entry.debit : -1 * entry.credit;
    }
    this.balancesChange[entry.account] += change;
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
      const oper = AccountBalance.query().findOne('account_id', balance.account_id);
      balanceFindOneOpers.push(oper);
    });
    balanceAccounts = await Promise.all(balanceFindOneOpers);

    balancesList.forEach((balance) => {
      const method = balance.amount < 0 ? 'decrement' : 'increment';

      // Detarmine if the account balance is already exists or not.
      const foundAccBalance = balanceAccounts.some((account) => (
        account && account.account_id === balance.account_id
      ));
      if (foundAccBalance) {
        const query = AccountBalance
          .query()[method]('amount', Math.abs(balance.amount))
          .where('account_id', balance.account_id);

        balanceUpdateOpers.push(query);
      } else {
        const query = AccountBalance.query().insert({
          account_id: balance.account_id,
          amount: balance.amount,
          currency_code: 'USD',
        });
        balanceInsertOpers.push(query);
      }
    });
    await Promise.all([
      ...balanceUpdateOpers, ...balanceInsertOpers,
    ]);
  }

  /**
   * Saves the stacked journal entries to the storage.
   */
  async saveEntries() {
    const saveOperations = [];

    this.entries.forEach((entry) => {
      const oper = AccountTransaction.query().insert({
        accountId: entry.account,
        ...pick(entry, ['credit', 'debit', 'transactionType', 'date', 'userId',
          'referenceType', 'referenceId', 'note']),
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
    const targetIds = (ids.length <= 0) ? this.entries.map(e => e.id) : ids;
    const removeEntries = this.entries.filter((e) => targetIds.indexOf(e.id) !== -1);

    this.entries = this.entries
      .filter(e => targetIds.indexOf(e.id) === -1)

    removeEntries.forEach((entry) => {
      entry.credit = -1 * entry.credit;
      entry.debit = -1 * entry.debit;

      this.setAccountBalanceChange(entry, entry.accountNormal);
    });
    this.deletedEntriesIds.push(
      ...removeEntries.map(entry => entry.id),
    );
  }

  async deleteEntries() {
    if (this.deletedEntriesIds.length > 0) {
      await AccountTransaction.query()
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
      if ((!momentClosingDate.isAfter(entry.date, dateType)
        && !momentClosingDate.isSame(entry.date, dateType))
        || (entry.account !== accountId && accountId)) {
        return;
      }
      if (entry.accountNormal === 'credit') {
        closingBalance += (entry.credit) ? entry.credit : -1 * entry.debit;
      } else if (entry.accountNormal === 'debit') {
        closingBalance += (entry.debit) ? entry.debit : -1 * entry.credit;
      }
    });
    return closingBalance;
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
      if ((!momentClosingDate.isAfter(entry.date, dateType)
        && !momentClosingDate.isSame(entry.date, dateType))
        || (entry.account !== accountId && accountId)) {
        return;
      }
      result.credit += entry.credit;
      result.debit += entry.debit;

      if (entry.accountNormal === 'credit') {
        result.balance += (entry.credit) ? entry.credit : -1 * entry.debit;
      } else if (entry.accountNormal === 'debit') {
        result.balance += (entry.debit) ? entry.debit : -1 * entry.credit;
      }
    });
    return result;
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
        accountNormal: (entry.account && entry.account.type)
          ? entry.account.type.normal : entry.accountNormal,
      });
    });
  }

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

  static loadAccounts() {

  }
}
