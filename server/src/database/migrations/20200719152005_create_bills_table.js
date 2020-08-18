
exports.up = function(knex) {
  return knex.schema.createTable('bills', (table) => {
    table.increments();
    table.integer('vendor_id').unsigned();
    table.string('bill_number');
    table.date('bill_date');
    table.date('due_date');
    table.string('reference_no');
    table.string('status');
    table.text('note');

    table.decimal('amount', 13, 3).defaultTo(0);
    table.decimal('payment_amount', 13, 3).defaultTo(0);

    table.string('inv_lot_number');
    table.timestamps();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('bills');
};
