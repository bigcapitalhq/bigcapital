
exports.seed = (knex) => {
  // Deletes ALL existing entries
  return knex('views').del()
    .then(() => {
      // Inserts seed entries
      return knex('views').insert([
        {id: 1, name: 'Assets', roles_logic_expression: '1', resource_id: 1, predefined: true },
        {id: 2, name: 'Liabilities', roles_logic_expression: '1', resource_id: 1, predefined: true },
        {id: 3, name: 'Equity', roles_logic_expression: '1', resource_id: 1, predefined: true },
        {id: 4, name: 'Income', roles_logic_expression: '1', resource_id: 1, predefined: true },
        {id: 5, name: 'Expenses', roles_logic_expression: '1', resource_id: 1, predefined: true },
      ]);
    });
};
