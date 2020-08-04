const { knexSnakeCaseMappers } = require("objection");

exports.up = function(knex) {
  return knex.schema.createTable('payment_receives', (table) => {
    table.increments();
    table.integer('customer_id').unsigned();
    table.date('payment_date');
    table.decimal('amount', 13, 3).defaultTo(0);
    table.string('reference_no');
    table.integer('deposit_account_id').unsigned();
    table.string('payment_receive_no');
    table.text('description');
    table.integer('user_id').unsigned();
    table.timestamps();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('payment_receives');
};
