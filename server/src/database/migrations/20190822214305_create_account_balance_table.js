
exports.up = function (knex) {
  return knex.schema.createTable('account_balances', (table) => {
    table.increments();
    table.integer('account_id');
    table.decimal('amount', 15, 5);
    table.string('currency_code', 3);
  });
};

exports.down = (knex) => knex.schema.dropTableIfExists('account_balances');
