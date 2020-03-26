
exports.seed = (knex) => {
  // Deletes ALL existing entries
  return knex('view_roles').del()
    .then(() => {
      // Inserts seed entries
      return knex('view_roles').insert([
        {id: 1, field_id: 3, comparator: 'equals', value: '', view_id: 1},
        {id: 2, field_id: 3, comparator: 'equals', value: '', view_id: 2}, 
        {id: 3, field_id: 3, comparator: 'equals', value: '', view_id: 3}, 
        {id: 4, field_id: 3, comparator: 'equals', value: '', view_id: 4}, 
        {id: 5, field_id: 3, comparator: 'equals', value: '', view_id: 5}, 
      ]);
    });
};
