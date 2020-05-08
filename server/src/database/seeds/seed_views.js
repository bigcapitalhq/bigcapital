
exports.seed = (knex) => {
  // Deletes ALL existing entries
  return knex('views').del()
    .then(() => {
      // Inserts seed entries
      return knex('views').insert([

        // Accounts
        { id: 1, name: 'Assets', roles_logic_expression: '1', resource_id: 1, predefined: true },
        { id: 2, name: 'Liabilities', roles_logic_expression: '1', resource_id: 1, predefined: true },
        { id: 3, name: 'Equity', roles_logic_expression: '1', resource_id: 1, predefined: true },
        { id: 4, name: 'Income', roles_logic_expression: '1', resource_id: 1, predefined: true },
        { id: 5, name: 'Expenses', roles_logic_expression: '1', resource_id: 1, predefined: true },

        // Items
        { id: 6, name: 'Services', roles_logic_expression: '1', resource_id: 2, predefined: true },
        { id: 7, name: 'Inventory', roles_logic_expression: '1', resource_id: 2, predefined: true },
        { id: 8, name: 'Non-Inventory', roles_logic_expression: '1', resource_id: 2, predefined: true },

        // Manual Journals
        { id: 9, name: 'Journal', roles_logic_expression: '1', resource_id: 4, predefined: true },
        { id: 10, name: 'Credit', roles_logic_expression: '1', resource_id: 4, predefined: true },
        { id: 11, name: 'Reconciliation', roles_logic_expression: '1', resource_id: 4, predefined: true },
      ]);
    });
};
