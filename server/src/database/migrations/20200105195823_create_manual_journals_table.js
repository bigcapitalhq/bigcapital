
exports.up = function(knex) {
  return knex.schema.createTable('manual_journals', (table) => {
    table.increments();
    table.string('journal_number');
    table.string('transaction_type');
    table.decimal('amount');
    table.date('date');
    table.boolean('status').defaultTo(false);
    table.string('note');
    table.integer('user_id').unsigned();
    table.timestamps();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('manual_journals');
};
