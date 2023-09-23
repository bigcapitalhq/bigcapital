import { TenantSeeder } from '@/lib/Seeder/TenantSeeder';
import { InitialTaxRates } from '../data/TaxRates';

export default class UpdateTaxPayableAccount extends TenantSeeder {
  /**
   * Seeds initial tax rates to the organization.
   */
  up(knex) {
    return knex('accounts').then(async () => {
      // Inserts seed entries.
      return knex('accounts').where('slug', 'tax-payable').update({
        account_type: 'tax-payable',
      });
    });
  }
}
