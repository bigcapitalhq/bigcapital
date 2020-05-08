
exports.seed = (knex) => {
  return knex('resource_fields').del()
    .then(() => {
      return knex('resource_fields').insert([
        // Accounts
        {
          id: 1,
          resource_id: 1,
          label_name: 'Account Name',
          key: 'name',
          data_type: 'textbox',
          predefined: 1,
          columnable: true,
        },
        {
          id: 2,
          resource_id: 1,
          label_name: 'Code',
          key: 'code',
          data_type: 'textbox',
          predefined: 1,
          columnable: true,
        },
        {
          id: 3,
          resource_id: 1,
          label_name: 'Type',
          key: 'type',
          data_type: 'options',
          predefined: 1,
          columnable: true,
        },
        {
          id: 5,
          resource_id: 1,
          label_name: 'Description',
          data_type: 'textarea',
          key: 'description',
          predefined: 1,
          columnable: true,
        },
        {
          id: 6,
          resource_id: 1,
          label_name: 'Root type',
          data_type: 'textbox',
          key: 'root_type',
          predefined: 1,
          columnable: true,
        },

        // Expenses
        {
          id: 7,
          resource_id: 3,
          label_name: 'Date',
          data_type: 'date',
          predefined: 1,
          columnable: true,
        },
        {
          id: 8,
          resource_id: 3,
          label_name: 'Expense Account',
          data_type: 'options',
          predefined: 1,
          columnable: true,
        },
        {
          id: 9,
          resource_id: 3,
          label_name: 'Payment Account',
          data_type: 'options',
          predefined: 1,
          columnable: true,
        },
        {
          id: 10,
          resource_id: 3,
          label_name: 'Amount',
          data_type: 'number',
          predefined: 1,
          columnable: true,
        },

        // Items
        {
          id: 11,
          resource_id: 2,
          label_name: 'Name',
          key: 'name',
          data_type: 'textbox',
          predefined: 1,
          columnable: true,
        },
        {
          id: 12,
          resource_id: 2,
          label_name: 'Type',
          key: 'type',
          data_type: 'textbox',
          predefined: 1,
          columnable: true,
        },

        // Manual Journals
        {
          id: 13,
          resource_id: 4,
          label_name: 'Transaction type',
          key: 'transaction_key',
          data_type: 'textbox',
          predefined: 1,
          columnable: true,
        },
        {
          id: 14,
          resource_id: 4,
          label_name: 'Amount',
          key: 'amount',
          data_type: 'textbox',
          predefined: 1,
          columnable: true,
        },
        {
          id: 15,
          resource_id: 4,
          label_name: 'Journal No.',
          key: 'journal_number',
          data_type: 'textbox',
          predefined: 1,
          columnable: true,
        },
      ]);
    });
};
