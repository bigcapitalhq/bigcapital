
exports.up = (knex) => {
  const tenancyService = Container.get(TenancyService);
  const i18n = tenancyService.i18n(knex.userParams.tenantId);

  // Deletes ALL existing entries
  return knex('views').del()
    .then(() => {
      // Inserts seed entries
      return knex('views').insert([
        // Accounts
        { id: 15, name: i18n.__('Inactive'), roles_logic_expression: '1', resource_model: 'Account', predefined: true },
        { id: 1, name: i18n.__('Assets'), roles_logic_expression: '1', resource_model: 'Account', predefined: true },
        { id: 2, name: i18n.__('Liabilities'), roles_logic_expression: '1', resource_model: 'Account', predefined: true },
        { id: 3, name: i18n.__('Equity'), roles_logic_expression: '1', resource_model: 'Account', predefined: true },
        { id: 4, name: i18n.__('Income'), roles_logic_expression: '1', resource_model: 'Account', predefined: true },
        { id: 5, name: i18n.__('Expenses'), roles_logic_expression: '1', resource_model: 'Account', predefined: true },

        // Items
        // { id: 6, name: 'Services', roles_logic_expression: '1', resource_id: 2, predefined: true },
        // { id: 7, name: 'Inventory', roles_logic_expression: '1', resource_id: 2, predefined: true },
        // { id: 8, name: 'Non-Inventory', roles_logic_expression: '1', resource_id: 2, predefined: true },

        // // Manual Journals
        // { id: 9, name: 'Journal', roles_logic_expression: '1', resource_id: 4, predefined: true },
        // { id: 10, name: 'Credit', roles_logic_expression: '1', resource_id: 4, predefined: true },
        // { id: 11, name: 'Reconciliation', roles_logic_expression: '1', resource_id: 4, predefined: true },

        // // Expenses
        // { id: 12, name: 'Interest', roles_logic_expression: '1', resource_id: 3, predefined: false, },
        // { id: 13, name: 'Depreciation', roles_logic_expression: '1', resource_id: 3, predefined: false, },
        // { id: 14, name: 'Payroll', roles_logic_expression: '1', resource_id: '3', predefined: false },
      ]);
    });
};


exports.down = (knex) => {

};