exports.up = function (knex) {
  return knex.schema.createTable(
    'uncategorized_cashflow_transactions',
    (table) => {
      table.increments('id');
      table.date('date').index();
      table.decimal('amount');
      table.string('currency_code');
      table.string('reference_no').index();
      table.string('payee');
      table
        .integer('account_id')
        .unsigned()
        .references('id')
        .inTable('accounts');
      table.string('description');
      table.string('categorize_ref_type');
      table.integer('categorize_ref_id').unsigned();
      table.boolean('categorized').defaultTo(false);
      table.string('plaid_transaction_id');
      table.timestamps();
    }
  );
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('uncategorized_cashflow_transactions');
};
