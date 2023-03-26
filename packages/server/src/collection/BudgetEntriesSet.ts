

export default class BudgetEntriesSet {

  constructor() {
    this.accounts = {}; 
    this.totalSummary = {}
    this.orderSize = null;
  }

  setZeroPlaceholder() {
    if (!this.orderSize) { return; }

    Object.values(this.accounts).forEach((account) => {

      for (let i = 0; i <= this.orderSize.length; i++) {
        if (typeof account[i] === 'undefined') {
          account[i] = { amount: 0 };
        }
      }
    });
  }

  static from(accounts, configs) {
    const collection = new this(configs);

    accounts.forEach((entry) => {
      if (typeof this.accounts[entry.accountId] === 'undefined') {
        collection.accounts[entry.accountId] = {};
      }
      if (entry.order) {
        collection.accounts[entry.accountId][entry.order] = entry;
      }
    });
    return collection;
  }

  toArray() {
    const output = [];

    Object.key(this.accounts).forEach((accountId) => {
      const entries = this.accounts[accountId];
      output.push({
        account_id: accountId,
        entries: [
          ...Object.key(entries).map((order) => {
            const entry = entries[order];
            return {
              order,
              amount: entry.amount,
            };
          }),
        ],
      });
    });
  }

  calcTotalSummary() {
    const totalSummary = {};

    for (let i = 0; i < this.orderSize.length; i++) {
      Object.value(this.accounts).forEach((account) => {
        if (typeof totalSummary[i] !== 'undefined') {
          totalSummary[i] = { amount: 0, order: i };
        }
        totalSummary[i].amount += account[i].amount;
      });
    }
    this.totalSummary = totalSummary;
  }

  toArrayTotalSummary() {
    return Object.values(this.totalSummary);
  }

}
