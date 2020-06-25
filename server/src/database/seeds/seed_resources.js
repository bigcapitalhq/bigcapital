
exports.seed = (knex) => {
  // Deletes ALL existing entries
  return knex('resources').del()
    .then(() => {
      // Inserts seed entries
      return knex('resources').insert([
        { id: 1, name: 'accounts' },
        { id: 8, name: 'accounts_types' },

        { id: 2, name: 'items' },
        { id: 3, name: 'expenses' },
        { id: 4, name: 'manual_journals' },
        { id: 5, name: 'items_categories' },
        { id: 6, name: 'customers' },
        { id: 7, name: 'vendors' },
      ]);
    });
};
