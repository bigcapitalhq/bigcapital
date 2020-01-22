
exports.up = function(knex) {
  return knex.schema.createTable('manual_journals', (table) => {
    table.increments();
    table.string('reference');
    table.string('transaction_type');
    table.decimal('amount');
    table.date('date');
    table.string('note');
    table.integer('user_id').unsigned().references('id').inTable('users');
    table.timestamps();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('manual_journals');
};
