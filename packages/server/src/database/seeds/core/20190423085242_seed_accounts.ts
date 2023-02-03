import { TenantSeeder } from '@/lib/Seeder/TenantSeeder';
import AccountsData from '../data/accounts';

export default class SeedAccounts extends TenantSeeder {
  /**
   * Seeds initial accounts to the organization. 
   */
  up(knex) {
    const data = AccountsData.map((account) => {
      return {
        ...account,
        name: this.i18n.__(account.name),
        description: this.i18n.__(account.description),
        currencyCode: this.tenant.metadata.baseCurrency,
      };
    });
    return knex('accounts').then(async () => {
      // Inserts seed entries.
      return knex('accounts').insert(data);
    });
  }
}
