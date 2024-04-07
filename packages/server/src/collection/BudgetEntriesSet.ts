export default class BudgetEntriesSet {
  constructor() {
    this.accounts = {};
    this.totalSummary = {};
    this.orderSize = null;
  }

  setZeroPlaceholder() {
    if (!this.orderSize) {
      return;
    }

    for (const account of Object.values(this.accounts)) {
      for (let i = 0; i <= this.orderSize.length; i++) {
        if (typeof account[i] === 'undefined') {
          account[i] = { amount: 0 };
        }
      }
    }
  }

  static from(accounts, configs) {
    const collection = new BudgetEntriesSet(configs);

    for (const entry of accounts) {
      if (typeof collection.accounts[entry.accountId] === 'undefined') {
        collection.accounts[entry.accountId] = {};
      }
      if (entry.order) {
        collection.accounts[entry.accountId][entry.order] = entry;
      }
    }
    return collection;
  }

  toArray() {
    const output = [];

    for (const accountId of Object.keys(this.accounts)) {
      const entries = this.accounts[accountId];
      output.push({
        account_id: accountId,
        entries: [
          ...Object.keys(entries).map((order) => {
            const entry = entries[order];
            return {
              order,
              amount: entry.amount,
            };
          }),
        ],
      });
    }
  }

  calcTotalSummary() {
    const totalSummary = {};

    for (let i = 0; i < this.orderSize.length; i++) {
      for (const account of Object.values(this.accounts)) {
        if (typeof totalSummary[i] !== 'undefined') {
          totalSummary[i] = { amount: 0, order: i };
        }
        totalSummary[i].amount += account[i].amount;
      }
    }
    this.totalSummary = totalSummary;
  }

  toArrayTotalSummary() {
    return Object.values(this.totalSummary);
  }
}
