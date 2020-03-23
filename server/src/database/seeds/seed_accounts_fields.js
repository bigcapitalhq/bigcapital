
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('resource_fields').del()
    .then(() => {
      // Inserts seed entries
      return knex('resource_fields').insert([
        {id: 1, label_name: 'Name', key: 'name', data_type: '', active: 1, predefined: 1} ,
        {id: 2, label_name: 'Code', key: 'code', data_type: '', active: 1, predefined: 1 },
        {id: 3, label_name: 'Account Type', key: 'account_type_id', data_type: '', active: 1, predefined: 1},
        {id: 4, label_name: 'Description', key: 'description', data_type: '', active: 1, predefined: 1},
      ]);
    });
};
