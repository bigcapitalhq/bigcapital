const { knexSnakeCaseMappers } = require('objection');

exports.up = function (knex) {
  return knex.schema.createTable('payment_receives', (table) => {
    table.increments();
    table
      .integer('customer_id')
      .unsigned()
      .index()
      .references('id')
      .inTable('contacts');
    table.date('payment_date').index();
    table.decimal('amount', 13, 3).defaultTo(0);
    table.string('currency_code', 3);
    table.string('reference_no').index();
    table
      .integer('deposit_account_id')
      .unsigned()
      .references('id')
      .inTable('accounts');
    table.string('payment_receive_no').nullable();
    table.text('statement');
    table.integer('user_id').unsigned().index();
    table.timestamps();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('payment_receives');
};
