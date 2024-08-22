import { SeedDemoAbstract } from './SeedDemoAbstract';

export class SeedDemoBankTransactions extends SeedDemoAbstract {
  get mapping() {
    return [
      { from: 'Date', to: 'date' },
      { from: 'Payee', to: 'payee' },
      { from: 'Description', to: 'description' },
      { from: 'Reference No.', to: 'referenceNo' },
      { from: 'Amount', to: 'amount' },
    ];
  }

  /**
   * Retrieves the seeder file name.
   * @returns {string}
   */
  get importFileName() {
    return `bank-transactions.csv`;
  }

  /**
   * Retrieve the resource name of the seeder.
   * @returns {string}
   */
  get resource() {
    return 'UncategorizedCashflowTransaction';
  }

  get importParams() {
    return {
      accountId: 1001,
    };
  }
}
