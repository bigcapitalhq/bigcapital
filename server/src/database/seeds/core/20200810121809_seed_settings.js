import Container from 'typedi';
import TenancyService from 'services/Tenancy/TenancyService';

exports.up = (knex) => {
  const tenancyService = Container.get(TenancyService);
  const settings = tenancyService.settings(knex.userParams.tenantId);

  // Orgnization settings.
  settings.set({ group: 'organization', key: 'accounting_basis', value: 'accural' });

  // Accounts settings.
  settings.set({ group: 'accounts', key: 'account_code_unique', value: true });

  // Manual journals settings.
  settings.set({ group: 'manual_journals', key: 'next_number', value: '00001' });
  settings.set({ group: 'manual_journals', key: 'auto_increment', value: true });

  // Sale invoices settings.
  settings.set({ group: 'sales_invoices', key: 'next_number', value: '00001' });
  settings.set({ group: 'sales_invoices', key: 'number_prefix', value: 'INV-' });
  settings.set({ group: 'sales_invoices', key: 'auto_increment', value: true });

  // Sale receipts settings.
  settings.set({ group: 'sales_receipts', key: 'next_number', value: '00001' });
  settings.set({ group: 'sales_receipts', key: 'number_prefix', value: 'REC-' });
  settings.set({ group: 'sales_receipts', key: 'auto_increment', value: true });

  // Sale estimates settings.
  settings.set({ group: 'sales_estimates', key: 'next_number', value: '00001' });
  settings.set({ group: 'sales_estimates', key: 'number_prefix', value: 'EST-' });
  settings.set({ group: 'sales_estimates', key: 'auto_increment', value: true });

  // Payment receives settings.
  settings.set({ group: 'payment_receives', key: 'number_prefix', value: 'PAY-' });
  settings.set({ group: 'payment_receives', key: 'next_number', value: '00001' });
  settings.set({ group: 'payment_receives', key: 'auto_increment', value: true });

  return settings.save();
};

exports.down = (knex) => {};
