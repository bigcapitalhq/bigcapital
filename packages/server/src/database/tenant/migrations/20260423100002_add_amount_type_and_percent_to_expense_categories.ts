exports.up = function (knex) {
  return knex.schema.alterTable('expense_transaction_categories', (table) => {
    table.string('amount_type', 16).notNullable().defaultTo('fixed');
    table.decimal('percent', 9, 4).nullable();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('expense_transaction_categories', (table) => {
    table.dropColumn('percent');
    table.dropColumn('amount_type');
  });
};
