exports.up = (knex) => {
  return knex.schema.createTable('cashflow_transactions', (table) => {
    table.increments();
    table.date('date').index();
    table.decimal('amount', 13, 3);
    table.string('reference_no').index();
    table.string('transaction_type').index();
    table.string('transaction_number').index();
    table.string('description');
    table.date('published_at').index();
    table.integer('user_id').unsigned().index();
    table.timestamps();
  });
};

exports.down = (knex) => {
  return knex.schema.dropTableIfExists('cashflow_transactions');
};
