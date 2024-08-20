import { SeedDemoAbstract } from './SeedDemoAbstract';

export class SeedDemoAccountVendors extends SeedDemoAbstract {
  /**
   * Retrieves the seeder file mapping.
   */
  get mapping() {
    return [
      { from: 'First Name', to: 'firstName' },
      { from: 'Last Name', to: 'lastName' },
      { from: 'Display Name', to: 'displayName' },
      { from: 'Email', to: 'email' },
      { from: 'Work Phone Number', to: 'workPhone' },
      { from: 'Personal Phone Number', to: 'personalPhone' },
      { from: 'Company Name', to: 'companyName' },
      { from: 'Website', to: 'website' },
      { from: 'Active', to: 'active' },
    ];
  }

  /**
   * Retrieves the seeder file name.
   * @returns {string}
   */
  get importFileName() {
    return `vendors.csv`;
  }

  /**
   * Retrieve the resource name of the seeder.
   * @returns {string}
   */
  get resource() {
    return 'Vendor';
  }
}
