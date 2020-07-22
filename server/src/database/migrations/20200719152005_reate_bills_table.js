
exports.up = function(knex) {
  return knex.schema.createTable('bills', (table) => {
    table.increments();
    table.string('bill_number');
    table.date('bill_date');
    table.date('due_date');
    table.integer('vendor_id').unsigned();
    table.text('note');
    table.timestamps();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('bills');
};
