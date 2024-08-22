import { SeedDemoAbstract } from './SeedDemoAbstract';

export class SeedDemoAccountManualJournals extends SeedDemoAbstract {
  /**
   * Retrieves the seeder file mapping.
   */
  get mapping() {
    return [
      { from: 'Date', to: 'date' },
      { from: 'Journal No', to: 'journalNumber' },
      { from: 'Reference No.', to: 'reference' },
      { from: 'Description', to: 'description' },
      { from: 'Publish', to: 'publish' },
      { from: 'Credit', to: 'credit', group: 'entries' },
      { from: 'Debit', to: 'debit', group: 'entries' },
      { from: 'Account', to: 'accountId', group: 'entries' },
      { from: 'Note', to: 'note', group: 'entries' },
    ];
  }

  /**
   * Retrieves the seeder file name.
   * @returns {string}
   */
  get importFileName() {
    return `manual-journals.csv`;
  }

  /**
   * Retrieve the resource name of the seeder.
   * @returns {string}
   */
  get resource() {
    return 'ManualJournal';
  }
}
