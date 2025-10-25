
exports.up = function(knex) {
  return knex.schema.createTable('manual_journals_entries', (table) => {
    table.increments();
    table.decimal('credit', 13, 3);
    table.decimal('debit', 13, 3);
    table.integer('index').unsigned();
    table.integer('account_id').unsigned().index().references('id').inTable('accounts');
    table.integer('contact_id').unsigned().nullable().index();
    table.string('note');
    table.integer('manual_journal_id').unsigned().index().references('id').inTable('manual_journals');
  }).raw('ALTER TABLE `MANUAL_JOURNALS_ENTRIES` AUTO_INCREMENT = 1000');
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('manual_journals_entries');
};
