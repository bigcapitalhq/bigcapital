
exports.up = function (knex) {
  return knex.schema.createTable('account_balance', (table) => {
    table.increments();
    table.integer('account_id');
    table.decimal('amount');
    table.string('currency_code', 3);
  });
};

exports.down = (knex) => knex.schema.dropTableIfExists('account_balance');
