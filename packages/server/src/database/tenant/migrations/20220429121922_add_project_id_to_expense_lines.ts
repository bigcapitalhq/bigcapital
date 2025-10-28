exports.up = (knex) => {
  return knex.schema.table('expense_transaction_categories', (table) => {
    table.integer('projectId').unsigned().references('id').inTable('projects');
  });
};

exports.down = (knex) => {};
