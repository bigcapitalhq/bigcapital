exports.up = function (knex) {
  return knex.schema.createTable('matched_bank_transactions', (table) => {
    table.increments('id');
    table
      .integer('uncategorized_transaction_id')
      .unsigned()
      .references('id')
      .inTable('uncategorized_cashflow_transactions');
    table.string('reference_type');
    table.integer('reference_id').unsigned();
    table.decimal('amount');
    table.timestamps();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('matched_bank_transactions');
};
