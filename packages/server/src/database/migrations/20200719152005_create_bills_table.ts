exports.up = function (knex) {
  return knex.schema.createTable('bills', (table) => {
    table.increments();
    table
      .integer('vendor_id')
      .unsigned()
      .index()
      .references('id')
      .inTable('contacts');
    table.string('bill_number');
    table.date('bill_date').index();
    table.date('due_date').index();
    table.string('reference_no').index();
    table.string('status').index();
    table.text('note');
    table.decimal('amount', 13, 3).defaultTo(0);
    table.string('currency_code');
    table.decimal('payment_amount', 13, 3).defaultTo(0);
    table.decimal('landed_cost_amount', 13, 3).defaultTo(0);
    table.decimal('allocated_cost_amount', 13, 3).defaultTo(0);
    table.decimal('credited_amount', 13, 3).defaultTo(0);
    table.string('inv_lot_number').index();
    table.date('opened_at').index();
    table.integer('user_id').unsigned();
    table.timestamps();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('bills');
};
