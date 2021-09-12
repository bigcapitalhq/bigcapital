
exports.up = (knex) => {
  const settings = [
    // Orgnization settings.
    { group: 'organization', key: 'accounting_basis', value: 'accural' },

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
  ];
  return knex('settings').insert(settings);
};

exports.down = (knex) => {};
