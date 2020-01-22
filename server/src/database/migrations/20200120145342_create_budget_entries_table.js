
exports.up = function(knex) {
  return knex.schema.createTable('budget_entries', (table) => {
    table.increments();
    table.integer('budget_id').unsigned().references('id').inTable('budgets');
    table.integer('account_id').unsigned().references('id').inTable('accounts');
    table.decimal('amount', 15, 5);
    table.integer('order');
  })  
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('budget_entries');
};
