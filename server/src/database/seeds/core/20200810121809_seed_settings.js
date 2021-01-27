import Container from 'typedi';
import TenancyService from 'services/Tenancy/TenancyService';

exports.up = (knex) => {
  const tenancyService = Container.get(TenancyService);
  const settings = tenancyService.settings(knex.userParams.tenantId);

  settings.set({ group: 'manual_journals', key: 'next_number', value: 1 });
  settings.set({ group: 'sales_invoices', key: 'next_number', value: 1 });
  settings.set({ group: 'sales_invoices', key: 'number_prefix', value: 'INV' });
  settings.set({ group: 'sales_receipts', key: 'next_number', value: 1 });
  settings.set({ group: 'sales_receipts', key: 'number_prefix', value: 'REC' });
  settings.set({ group: 'sales_estimates', key: 'next_number', value: 1 });
  settings.set({ group: 'sales_estimates', key: 'number_prefix', value: 'EST' });
  settings.set({ group: 'payment_receives', key: 'next_number', value: 1 });

  return settings.save();
};

exports.down = (knex) => {};
