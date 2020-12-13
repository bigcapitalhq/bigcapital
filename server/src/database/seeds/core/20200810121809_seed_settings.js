
exports.up = (knex) => {
    // Inserts seed entries
    return knex('settings').insert([
      { group: 'manual_journals', key: 'next_number', value: 1 },

      { group: 'sales_invoices', key: 'next_number', value: 1},
      { group: 'sales_invoices', key: 'number_prefix', value: 'INV' },

      { group: 'sales_receipts', key: 'next_number', value: 1 },
      { group: 'sales_receipts', key: 'number_prefix', value: 'REC' },

      { group: 'sales_estimates', key: 'next_number', value: 1 },
      { group: 'sales_estimates', key: 'number_prefix', value: 'EST' },

      { group: 'payment_receives', key: 'next_number', value: 1 },
    ]);
};

exports.down = (knex) => {

}