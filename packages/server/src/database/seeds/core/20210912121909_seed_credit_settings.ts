import { TenantSeeder } from '@/lib/Seeder/TenantSeeder';

export default class SeedCustomerVendorCreditSettings extends TenantSeeder {
  /**
   *
   * @returns
   */
  up() {
    const settings = [
      // Credit note.
      { group: 'credit_note', key: 'number_prefix', value: 'CN-' },
      { group: 'credit_note', key: 'next_number', value: '00001' },
      { group: 'credit_note', key: 'auto_increment', value: true },

      // Vendor credit.
      { group: 'vendor_credit', key: 'number_prefix', value: 'VC-' },
      { group: 'vendor_credit', key: 'next_number', value: '00001' },
      { group: 'vendor_credit', key: 'auto_increment', value: true },
    ];
    return this.knex('settings').insert(settings);
  }
}
