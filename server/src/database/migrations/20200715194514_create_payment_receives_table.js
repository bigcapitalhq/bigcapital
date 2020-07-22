const { knexSnakeCaseMappers } = require("objection");

exports.up = function(knex) {
  return knex.schema.createTable('payment_receives', (table) => {
    table.increments();
    table.integer('customer_id').unsigned();
    table.date('payment_date');
    table.string('reference_no');
    table.integer('deposit_account_id').unsigned();
    table.string('payment_receive_no');
    table.timestamps();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('payment_receives');
};
