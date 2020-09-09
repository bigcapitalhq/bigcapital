import moment from 'moment';

export default class JournalFinancial {
  accountsBalanceTable: { [key: number]: number; } = {};

  /**
   * Retrieve the closing balance for the given account and closing date.
   * @param {Number} accountId -
   * @param {Date} closingDate -
   * @param {string} dataType? - 
   * @return {number}
   */
  getClosingBalance(
    accountId: number,
    closingDate: Date|string,
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
   * @param {Number} accountId
   * @param {Date} closingDate
   * @param {String} dateType
   * @return {Number}
   */
  getAccountBalance(accountId: number, closingDate: Date|string, dateType: string) {
    const accountNode = this.accountsDepGraph.getNodeData(accountId);
    const depAccountsIds = this.accountsDepGraph.dependenciesOf(accountId);
    const depAccounts = depAccountsIds
      .map((id) => this.accountsDepGraph.getNodeData(id));

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

  getTrialBalanceWithDepands(accountId: number, closingDate: Date, dateType: string) {
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
    closingDate: Date|string,
    openingDate: Date|string,
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
    accountId: number,
    contactId: number,
    contactType: string,
    closingDate: Date,
    openingDate: Date,
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

}