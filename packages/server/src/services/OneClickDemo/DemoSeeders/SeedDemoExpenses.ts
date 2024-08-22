import { SeedDemoAbstract } from './SeedDemoAbstract';

export class SeedDemoAccountExpenses extends SeedDemoAbstract {
  /**
   * Retrieves the seeder file mapping.
   */
  get mapping() {
    return [
      { from: 'Payment Account', to: 'paymentAccountId' },
      { from: 'Reference No.', to: 'referenceNo' },
      { from: 'Payment Date', to: 'paymentDate' },
      { from: 'Description', to: 'description' },
      { from: 'Publish', to: 'publish' },
      {
        from: 'Expense Account',
        to: 'expenseAccountId',
        group: 'categories',
      },
      { from: 'Amount', to: 'amount', group: 'categories' },
      { from: 'Line Description', to: 'description', group: 'categories' },
    ];
  }

  /**
   * Retrieves the seeder file name.
   * @returns {string}
   */
  get importFileName() {
    return `Expenses.csv`;
  }

  /**
   * Retrieve the resource name of the seeder.
   * @returns {string}
   */
  get resource() {
    return 'Expense';
  }
}
