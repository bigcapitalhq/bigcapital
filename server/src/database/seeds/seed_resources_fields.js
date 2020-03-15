
exports.seed = (knex) => {
  return knex('resource_fields').del()
    .then(() => {
      return knex('resource_fields').insert([
        // Accounts
        {
          id: 1,
          resource_id: 1,
          label_name: 'Account Name',
          data_type: 'textbox',
          predefined: 1,
          columnable: true,
        },
        {
          id: 2,
          resource_id: 1,
          label_name: 'Code',
          data_type: 'textbox',
          predefined: 1,
          columnable: true,
        },
        {
          id: 3,
          resource_id: 1,
          label_name: 'Type',
          data_type: 'options',
          predefined: 1,
          columnable: true,
        },
        {
          id: 4,
          resource_id: 1,
          label_name: 'Type',
          data_type: 'normal',
          predefined: 1,
          columnable: true,
        },
        {
          id: 5,
          resource_id: 1,
          label_name: 'Description',
          data_type: 'textarea',
          predefined: 1,
          columnable: true,
        },

        // Expenses
        {
          id: 6,
          resource_id: 3,
          label_name: 'Date',
          data_type: 'date',
          predefined: 1,
          columnable: true,
        },
        {
          id: 7,
          resource_id: 3,
          label_name: 'Expense Account',
          data_type: 'options',
          predefined: 1,
          columnable: true,
        },
        {
          id: 8,
          resource_id: 3,
          label_name: 'Payment Account',
          data_type: 'options',
          predefined: 1,
          columnable: true,
        },
        {
          id: 9,
          resource_id: 3,
          label_name: 'Amount',
          data_type: 'number',
          predefined: 1,
          columnable: true,
        },
      ]);
    });
};
