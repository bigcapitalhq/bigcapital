import { TenantSeeder } from '@/lib/Seeder/TenantSeeder';

export default class SeedSettings extends TenantSeeder {
  /**
   *
   * @returns
   */
  up() {
    const settings = [
      // Organization settings.
      { group: 'organization', key: 'accounting_basis', value: 'accrual' },

      // Accounts settings.
      { group: 'accounts', key: 'account_code_unique', value: true },

      // Manual journals settings.
      { group: 'manual_journals', key: 'next_number', value: '00001' },
      { group: 'manual_journals', key: 'auto_increment', value: true },

      // Sale invoices settings.
      { group: 'sales_invoices', key: 'next_number', value: '00001' },
      { group: 'sales_invoices', key: 'number_prefix', value: 'INV-' },
      { group: 'sales_invoices', key: 'auto_increment', value: true },

      // Sale receipts settings.
      { group: 'sales_receipts', key: 'next_number', value: '00001' },
      { group: 'sales_receipts', key: 'number_prefix', value: 'REC-' },
      { group: 'sales_receipts', key: 'auto_increment', value: true },

      // Sale estimates settings.
      { group: 'sales_estimates', key: 'next_number', value: '00001' },
      { group: 'sales_estimates', key: 'number_prefix', value: 'EST-' },
      { group: 'sales_estimates', key: 'auto_increment', value: true },

      // Payment receives settings.
      { group: 'payment_receives', key: 'number_prefix', value: 'PAY-' },
      { group: 'payment_receives', key: 'next_number', value: '00001' },
      { group: 'payment_receives', key: 'auto_increment', value: true },

      // Cashflow settings.
      { group: 'cashflow', key: 'number_prefix', value: 'CF-' },
      { group: 'cashflow', key: 'next_number', value: '00001' },
      { group: 'cashflow', key: 'auto_increment', value: true },

      // warehouse transfers settings.
      { group: 'warehouse_transfers', key: 'next_number', value: '00001' },
      { group: 'warehouse_transfers', key: 'number_prefix', value: 'WT-' },
      { group: 'warehouse_transfers', key: 'auto_increment', value: true },
    ];
    return this.knex('settings').insert(settings);
  }
}
